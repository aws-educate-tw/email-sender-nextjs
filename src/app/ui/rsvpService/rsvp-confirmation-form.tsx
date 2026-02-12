"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import RsvpStatusBanner from "./rsvp-status-banner";
import RsvpRadioGroup from "./rsvp-radio-group";
import RsvpSubmitButton from "./rsvp-submit-button";
import type { RsvpStatus } from "./types";

interface RsvpConfirmationFormProps {
  token: string;
  testMode?: string;
}

export default function RsvpConfirmationForm({ token, testMode }: RsvpConfirmationFormProps) {
  const [currentStatus, setCurrentStatus] = useState<RsvpStatus>('PENDING');
  const [selectedOption, setSelectedOption] = useState<'ATTEND' | 'NOT_ATTEND' | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [lastEditedTime, setLastEditedTime] = useState<string | null>(null);
  const [participantName] = useState('王小明');
  const [eventName] = useState('AWS Cloud Workshop');
  const [eventTime] = useState('2026-03-01 09:00 - 2026-03-01 17:00');
  const [location] = useState('Taipei 101');
  const [deadline] = useState('2026-02-20 23:59');

  useEffect(() => {
    // Test mode: simulate different states via URL parameter
    if (testMode === 'expired') {
      setIsExpired(true);
      setIsEditing(false);
    } else if (testMode === 'attend') {
      setCurrentStatus('ATTEND');
      setSelectedOption('ATTEND');
      setIsEditing(false);
      setLastEditedTime('2026-01-29 21:20');
    } else if (testMode === 'not-attend') {
      setCurrentStatus('NOT_ATTEND');
      setSelectedOption('NOT_ATTEND');
      setIsEditing(false);
      setLastEditedTime('2026-01-29 21:20');
    } else if (testMode === 'expired-attend') {
      setCurrentStatus('ATTEND');
      setSelectedOption('ATTEND');
      setIsExpired(true);
      setIsEditing(false);
      setLastEditedTime('2026-01-29 21:20');
    } else {
      // Default: PENDING state
      setIsEditing(true);
    }

    // TODO: Replace with actual API call
    // fetchRsvpStatus(token);
  }, [testMode]);

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
    setLastEditedTime(new Date().toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleOptionChange = (option: 'ATTEND' | 'NOT_ATTEND') => {
    setSelectedOption(option);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#2c3e50] text-white p-4 flex items-center justify-center">
        <Image
          src="/aws-educate-logo.png"
          alt="AWS Educate"
          width={150}
          height={40}
          priority
        />
      </header>

      <main className="flex-1 p-4 sm:p-8 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">活動出缺席回覆</h1>
        <h2 className="text-lg sm:text-xl mb-6">{eventName}</h2>

        <div className="text-gray-600 mb-8 space-y-2 text-sm sm:text-base">
          <p>活動時間：{eventTime}</p>
          <p>活動地點：{location}</p>
          <p>回覆期限：{deadline}</p>
        </div>

        {isExpired && currentStatus === 'PENDING' && (
          <div className="max-w-2xl mx-auto mb-8">
            <RsvpStatusBanner type="expired" />
          </div>
        )}

        {!isEditing && currentStatus !== 'PENDING' && (
          <div className="max-w-2xl mx-auto mb-8">
            <RsvpStatusBanner
              type="submitted"
              status={currentStatus as 'ATTEND' | 'NOT_ATTEND'}
              lastEditedTime={lastEditedTime || undefined}
            />
          </div>
        )}

        <p className="mb-6 font-medium text-sm sm:text-base">
          {participantName} 您好，您是否會準時出席此次活動：
        </p>

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
        <a href="mailto:awseducate.cloudambassador@gmail.com" className="underline ml-1">
          awseducate.cloudambassador@gmail.com
        </a>
      </footer>
    </div>
  );
}
