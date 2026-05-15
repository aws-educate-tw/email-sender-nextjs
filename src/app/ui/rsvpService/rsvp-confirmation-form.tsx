"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import RsvpStatusBanner from "./rsvp-status-banner";
import RsvpRadioGroup from "./rsvp-radio-group";
import RsvpSubmitButton from "./rsvp-submit-button";
import type { RsvpStatus, RsvpStatusResponse, RsvpToken, RsvpUpdateResponse } from "./types";

interface RsvpConfirmationFormProps {
  token: string;
}

type PageError = "invalid_token" | "not_found" | "system_error";
type RsvpTokenPayload = Pick<RsvpToken, "run_id" | "participant_id">;

function parseJwtPayload(token: string): RsvpTokenPayload | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof decoded.run_id !== "string" || typeof decoded.participant_id !== "string") {
      return null;
    }

    return {
      run_id: decoded.run_id,
      participant_id: decoded.participant_id,
    };
  } catch {
    return null;
  }
}

function formatDatetime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export default function RsvpConfirmationForm({ token }: RsvpConfirmationFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState<PageError | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("PENDING");
  const [participantName, setParticipantName] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignStartTime, setCampaignStartTime] = useState("");
  const [campaignLocation, setCampaignLocation] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"ATTEND" | "NOT_ATTEND" | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastEditedTime, setLastEditedTime] = useState<string | null>(null);
  const [compositeId, setCompositeId] = useState("");

  const apiBase = process.env.NEXT_PUBLIC_RSVP_API_ENDPOINT;

  const applyStatusResponse = useCallback((data: RsvpStatusResponse) => {
    setRsvpStatus(data.rsvp_status);
    setParticipantName(data.participant_name);
    setCampaignName(data.campaign_name);
    setCampaignStartTime(formatDatetime(data.campaign_start_time));
    setCampaignLocation(data.campaign_location);
    setRegistrationDeadline(formatDatetime(data.registration_deadline));
    setIsRegistrationClosed(data.is_registration_closed);

    if (data.rsvp_status !== "PENDING") {
      setSelectedOption(data.rsvp_status);
      setIsEditing(false);
    } else {
      setSelectedOption(null);
      setIsEditing(!data.is_registration_closed);
    }
  }, []);

  const fetchStatus = useCallback(
    async (id: string): Promise<boolean> => {
      if (!apiBase) {
        setPageError("system_error");
        return false;
      }

      const res = await fetch(`${apiBase}/rsvp/${id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setPageError("invalid_token");
        return false;
      }
      if (res.status === 404) {
        setPageError("not_found");
        return false;
      }
      if (!res.ok) {
        setPageError("system_error");
        return false;
      }

      const data: RsvpStatusResponse = await res.json();
      applyStatusResponse(data);
      return true;
    },
    [apiBase, applyStatusResponse, token]
  );

  useEffect(() => {
    const payload = parseJwtPayload(token);
    if (!payload) {
      setPageError("invalid_token");
      setIsLoading(false);
      return;
    }

    const id = `${payload.run_id}_${payload.participant_id}`;
    setCompositeId(id);

    const loadStatus = async () => {
      try {
        await fetchStatus(id);
      } catch {
        setPageError("system_error");
      } finally {
        setIsLoading(false);
      }
    };

    loadStatus();
  }, [token, fetchStatus]);

  const handleSubmit = async () => {
    if (!selectedOption || !apiBase || !compositeId) return;
    setIsSubmitting(true);

    let retryCount = 0;
    while (retryCount <= 3) {
      try {
        const res = await fetch(`${apiBase}/rsvp/${compositeId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: selectedOption,
          }),
        });

        if (res.status === 401) {
          setPageError("invalid_token");
          break;
        }

        if (res.status === 403) {
          try {
            await fetchStatus(compositeId);
          } finally {
            setIsRegistrationClosed(true);
            setIsEditing(false);
          }
          break;
        }

        if (res.status === 409 && retryCount < 3) {
          retryCount++;
          await new Promise(r => setTimeout(r, 500 * retryCount));
          continue;
        }

        if (res.status === 409) {
          await fetchStatus(compositeId);
          break;
        }

        if (!res.ok) {
          setPageError("system_error");
          break;
        }

        const data: RsvpUpdateResponse = await res.json();
        const current = data.data.currentStatus;
        setRsvpStatus(current);
        if (current !== "PENDING") setSelectedOption(current);
        setIsEditing(false);
        setLastEditedTime(
          new Date().toLocaleString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        break;
      } catch {
        setPageError("system_error");
        break;
      }
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  if (pageError === "invalid_token") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">連結無效或已過期</h1>
          <p className="text-gray-600">此連結無效或已過期，請檢查您的電子郵件。</p>
        </div>
      </div>
    );
  }

  if (pageError === "not_found") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">活動不存在</h1>
          <p className="text-gray-600">找不到此活動資訊，請聯絡主辦單位。</p>
        </div>
      </div>
    );
  }

  if (pageError === "system_error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">系統忙碌中</h1>
          <p className="text-gray-600">請稍後再試，若問題持續請聯絡主辦單位。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#2c3e50] text-white p-4 flex items-center justify-center">
        <Image src="/aws-educate-logo.png" alt="AWS Educate" width={150} height={40} priority />
      </header>

      <main className="flex-1 p-4 sm:p-8 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">活動出缺席回覆</h1>
        <h2 className="text-lg sm:text-xl mb-6">{campaignName}</h2>

        <div className="text-gray-600 mb-8 space-y-2 text-sm sm:text-base">
          <p>活動時間：{campaignStartTime}</p>
          <p>活動地點：{campaignLocation}</p>
          <p>回覆期限：{registrationDeadline}</p>
        </div>

        {isRegistrationClosed && rsvpStatus === "PENDING" && (
          <div className="max-w-2xl mx-auto mb-8">
            <RsvpStatusBanner type="expired" />
          </div>
        )}

        {!isEditing && rsvpStatus !== "PENDING" && (
          <div className="max-w-2xl mx-auto mb-8">
            <RsvpStatusBanner
              type="submitted"
              status={rsvpStatus as "ATTEND" | "NOT_ATTEND"}
              lastEditedTime={lastEditedTime || undefined}
              isExpired={isRegistrationClosed}
            />
          </div>
        )}

        <p className="mb-6 font-medium text-black text-sm sm:text-base">姓名：{participantName}</p>
        <p className="mb-6 font-medium text-sm sm:text-base">您是否會準時出席此次活動：</p>

        <RsvpRadioGroup
          selectedOption={selectedOption}
          onChange={setSelectedOption}
          disabled={!isEditing || isRegistrationClosed}
        />

        <div className="text-center">
          <RsvpSubmitButton
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            disabled={isRegistrationClosed || (isEditing && !selectedOption)}
            onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
          />
        </div>
      </main>

      <footer className="bg-[#2c3e50] text-white text-center p-4 text-sm sm:text-base">
        聯絡我們：
        <a href="mailto:contact@aws-educate.com" className="underline ml-1">
          contact@aws-educate.com
        </a>
      </footer>
    </div>
  );
}
