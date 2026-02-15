"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import RsvpStatusBanner from "./rsvp-status-banner";
import RsvpRadioGroup from "./rsvp-radio-group";
import RsvpSubmitButton from "./rsvp-submit-button";
import type { RsvpStatus } from "./types";
import { MOCK_RSVP_DATA } from "./mock-data";

interface RsvpConfirmationFormProps {
  token: string;
  testMode?: string;
}

export default function RsvpConfirmationForm({ token, testMode }: RsvpConfirmationFormProps) {
  const [currentStatus, setCurrentStatus] = useState<RsvpStatus>("PENDING");
  const [selectedOption, setSelectedOption] = useState<"ATTEND" | "NOT_ATTEND" | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [lastEditedTime, setLastEditedTime] = useState<string | null>(null);
  const [participantName] = useState(MOCK_RSVP_DATA.participant.name);
  const [participantEmail] = useState(MOCK_RSVP_DATA.participant.email);
  const [eventName] = useState(MOCK_RSVP_DATA.event.name);
  const [eventTime] = useState(
    `${MOCK_RSVP_DATA.event.startTime} - ${MOCK_RSVP_DATA.event.endTime}`
  );
  const [location] = useState(MOCK_RSVP_DATA.event.location);
  const [deadline] = useState(MOCK_RSVP_DATA.event.deadline);

  useEffect(() => {
    // TODO: Replace with actual API call to fetch RSVP status
    // const fetchRsvpStatus = async () => {
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rsvp`, {
    //     method: 'GET',
    //     headers: { 'Authorization': `Bearer ${token}` },
    //   });
    //   const data = await response.json();
    //   // Update state based on response
    // };
    // fetchRsvpStatus();

    // Mock: Simulate different states via URL parameter for testing
    if (testMode === "expired-pending") {
      setIsExpired(true);
      setIsEditing(false);
    } else if (testMode === "submitted-attend") {
      const mockData = MOCK_RSVP_DATA.responses.attended;
      setCurrentStatus(mockData.status);
      setSelectedOption(mockData.status);
      setIsEditing(false);
      setLastEditedTime(mockData.lastEditedTime);
    } else if (testMode === "submitted-not-attend") {
      const mockData = MOCK_RSVP_DATA.responses.notAttended;
      setCurrentStatus(mockData.status);
      setSelectedOption(mockData.status);
      setIsEditing(false);
      setLastEditedTime(mockData.lastEditedTime);
    } else if (testMode === "expired-submitted") {
      const mockData = MOCK_RSVP_DATA.responses.attended;
      setCurrentStatus(mockData.status);
      setSelectedOption(mockData.status);
      setIsExpired(true);
      setIsEditing(false);
      setLastEditedTime(mockData.lastEditedTime);
    } else {
      // Default: PENDING state
      setIsEditing(true);
    }
  }, [testMode, token]);

  const handleSubmit = async () => {
    if (!selectedOption) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));

    // TODO: Replace with actual API call
    // const response = await fetch(BACKEND_API_URL, {
    //   method: 'PUT',
    //   headers: { 'Authorization': `Bearer ${token}` },
    //   body: JSON.stringify({ action: selectedOption, clientTimestamp: Date.now() })
    // });

    setCurrentStatus(selectedOption);
    setIsEditing(false);
    setIsSubmitting(false);
    setLastEditedTime(
      new Date().toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleOptionChange = (option: "ATTEND" | "NOT_ATTEND") => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#2c3e50] text-white p-4 flex items-center justify-center">
        <Image src="/aws-educate-logo.png" alt="AWS Educate" width={150} height={40} priority />
      </header>

      <main className="flex-1 p-4 sm:p-8 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">活動出缺席回覆</h1>
        <h2 className="text-lg sm:text-xl mb-6">{eventName}</h2>

        <div className="text-gray-600 mb-8 space-y-2 text-sm sm:text-base">
          <p>活動時間：{eventTime}</p>
          <p>活動地點：{location}</p>
          <p>回覆期限：{deadline}</p>
        </div>

        {isExpired && currentStatus === "PENDING" && (
          <div className="max-w-2xl mx-auto mb-8">
            <RsvpStatusBanner type="expired" />
          </div>
        )}

        {!isEditing && currentStatus !== "PENDING" && (
          <div className="max-w-2xl mx-auto mb-8">
            <RsvpStatusBanner
              type="submitted"
              status={currentStatus as "ATTEND" | "NOT_ATTEND"}
              lastEditedTime={lastEditedTime || undefined}
              isExpired={isExpired}
            />
          </div>
        )}

        <p className="mb-2 font-medium text-black text-sm sm:text-base">姓名：{participantName}</p>
        <p className="mb-6 font-medium text-black text-sm sm:text-base">信箱：{participantEmail}</p>
        <p className="mb-6 font-medium text-sm sm:text-base">您是否會準時出席此次活動：</p>

        <RsvpRadioGroup
          selectedOption={selectedOption}
          onChange={handleOptionChange}
          disabled={!isEditing || isExpired}
        />

        <div className="text-center">
          <RsvpSubmitButton
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            disabled={isExpired || (isEditing && !selectedOption)}
            onClick={isEditing ? handleSubmit : handleEdit}
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
