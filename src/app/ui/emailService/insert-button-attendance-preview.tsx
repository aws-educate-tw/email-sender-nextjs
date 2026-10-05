"use client";

import Image from "next/image";

interface AttendancePreviewProps {
  campaignName: string;
  campaignStartDate: string;
  campaignStartTime: string;
  campaignEndDate: string;
  campaignEndTime: string;
  campaignPlace: string;
  deadline: string;
  deadlineTime: string;
}

export default function AttendancePreview({
  campaignName,
  campaignStartDate,
  campaignStartTime,
  campaignEndDate,
  campaignEndTime,
  campaignPlace,
  deadline,
  deadlineTime,
}: AttendancePreviewProps) {
  const formatDateTime = (date: string, time: string) => {
    if (!date && !time) return "";
    return `${date || "年/月/日"} ${time || "--:--:--"}`;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <header className="bg-[#2c3e50] text-white p-4 flex items-center justify-center">
        <Image src="/aws-educate-logo.png" alt="AWS Educate" width={150} height={40} priority />
      </header>

      <main className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">活動出缺席回覆</h1>
        <h2 className="text-xl mb-6">{campaignName || "{{活動名稱}}"}</h2>

        <div className="text-gray-600 mb-8 space-y-2">
          <p>
            活動時間：
            {campaignStartDate || campaignStartTime || campaignEndDate || campaignEndTime
              ? `${formatDateTime(campaignStartDate, campaignStartTime)} - ${formatDateTime(campaignEndDate, campaignEndTime)}`
              : ""}
          </p>
          <p>活動地點：{campaignPlace || ""}</p>
          <p>回覆期限：{formatDateTime(deadline, deadlineTime)}</p>
        </div>

        <p className="mb-2 font-medium text-black">
          姓名：{"{"}
          {"{"}Name{"}"}
          {"}"}
        </p>
        <p className="mb-6 font-medium text-black">
          信箱：{"{"}
          {"{"}Email{"}"}
          {"}"}
        </p>
        <p className="mb-6 font-medium">您是否會準時出席此次活動：</p>

        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="w-full p-3 border-2 border-[#2c3e50] bg-[#d4e3f7] rounded-full flex items-center justify-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-[#2c3e50]">
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            是，我會準時出席。
          </div>
          <div className="w-full p-3 border-2 border-gray-300 bg-white rounded-full flex items-center justify-center gap-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-gray-400" />
            否，我不克出席。
          </div>
        </div>

        <div className="mt-8 bg-[#2c3e50] text-white px-12 py-3 rounded-full font-medium inline-block">
          確認送出
        </div>
      </main>
    </div>
  );
}
