"use client";

import { Info } from "lucide-react";

interface RsvpStatusBannerProps {
  type: 'expired' | 'submitted';
  status?: 'ATTEND' | 'NOT_ATTEND';
  lastEditedTime?: string;
}

export default function RsvpStatusBanner({ type, status, lastEditedTime }: RsvpStatusBannerProps) {
  if (type === 'expired') {
    return (
      <div className="bg-[#e74c3c] text-white rounded-full p-4 text-center">
        <Info size={20} className="inline align-middle mr-2" />
        <span className="text-sm inline align-middle">
          該活動的出缺席回覆期限已過，您無法再進行回覆。若有任何特殊狀況，請聯絡{" "}
          <a href="mailto:awseducate.cloudambassador@gmail.com" className="underline">
            awseducate.cloudambassador@gmail.com
          </a>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#f39c12] text-white rounded-full p-4 flex items-center justify-center gap-2 text-center">
      <Info size={20} className="flex-shrink-0" />
      <div className="text-sm">
        <span>您的回覆狀態： </span>
        <span>{status === 'ATTEND' ? '是，我會準時出席。' : '否，我不克出席。'}</span>
        {lastEditedTime && (
          <span className="italic ml-2">last edited: {lastEditedTime}</span>
        )}
      </div>
    </div>
  );
}
