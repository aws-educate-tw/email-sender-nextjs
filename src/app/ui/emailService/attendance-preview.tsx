"use client";

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
      <header className="bg-[#2c3e50] text-white p-4 text-center">
        <span className="font-bold">aws</span>{" "}
        <span className="font-bold" style={{ color: "#EA9D3A" }}>
          educate
        </span>
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

        <p className="mb-6 font-medium">您是否會準時出席此次活動：</p>

        <div className="space-y-4 max-w-2xl mx-auto">
          <button className="w-full p-4 border-2 border-blue-300 bg-blue-50 rounded-lg flex items-center justify-center gap-2 text-blue-900">
            <span>✓</span> 是，我會準時出席。
          </button>
          <button className="w-full p-4 border-2 border-gray-300 bg-white rounded-lg flex items-center justify-center gap-2 text-gray-700">
            <span>○</span> 否，我不克出席。
          </button>
        </div>

        <button className="mt-8 bg-[#2c3e50] text-white px-12 py-3 rounded-lg font-medium hover:bg-[#1a2f4a] transition-colors">
          確認送出
        </button>
      </main>
    </div>
  );
}
