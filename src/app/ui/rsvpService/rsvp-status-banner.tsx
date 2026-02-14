"use client";

import { Info } from "lucide-react";

interface RsvpStatusBannerProps {
  type: "expired" | "submitted";
  status?: "ATTEND" | "NOT_ATTEND";
  lastEditedTime?: string;
  isExpired?: boolean;
}

export default function RsvpStatusBanner({
  type,
  status,
  lastEditedTime,
  isExpired,
}: RsvpStatusBannerProps) {
  // 已過期且已回覆：顯示紅色橫幅
  if (isExpired && type === "submitted" && status) {
    return (
      <div className="bg-[#e74c3c] text-white rounded-full p-4 text-center">
        <Info size={20} className="inline align-middle mr-2" />
        <span className="text-sm inline align-middle">
          您的回覆狀態：
          {status === "ATTEND" ? "是，我會準時出席。" : "否，我不克出席。"}
          {lastEditedTime && <span className="italic ml-2">last edited: {lastEditedTime}</span>}
          <br />
          該活動的出缺席回覆期限已過，您無法再進行修改。
        </span>
      </div>
    );
  }

  // 已過期未回覆：顯示紅色橫幅
  if (type === "expired") {
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

  // 已提交未過期：顯示橘色橫幅
  return (
    <div className="bg-[#f39c12] text-white rounded-full p-4 text-center">
      <Info size={20} className="inline align-middle mr-2" />
      <span className="text-sm inline align-middle">
        您的回覆狀態：
        {status === "ATTEND" ? "是，我會準時出席。" : "否，我不克出席。"}
        {lastEditedTime && <span className="italic ml-2">last edited: {lastEditedTime}</span>}
      </span>
    </div>
  );
}
