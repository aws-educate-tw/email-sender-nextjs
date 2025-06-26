import React from "react";
import { Send, Mail } from "lucide-react";

interface ReviewProps {
  onSubmit: () => void;
}

export const EmailServiceReview: React.FC<ReviewProps> = ({ onSubmit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mt-2 p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail className="w-6 h-6" /> Email Details
      </h2>

      <div className="mb-8">
        <div className="space-y-4">
          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Subject:</p>
            <p className="text-gray-600">Welcome to AWS Educate Cloud Ambassador Program</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">From:</p>
            <p className="text-gray-600">Bill Wu &lt;billwu0222@aws-educate.tw&gt;</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">To:</p>
            <p className="text-gray-600">Recipients from sheet file</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Template file:</p>
            <p className="text-gray-600">welcome-template.html</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Sheet file:</p>
            <p className="text-gray-600">recipients-list.xlsx</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Local part:</p>
            <p className="text-gray-600">billwu0222</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Reply to:</p>
            <p className="text-gray-600">billwu0222@gmail.com</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">BCC:</p>
            <p className="text-gray-600">No BCC recipients</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">CC:</p>
            <p className="text-gray-600">No CC recipients</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Attach files:</p>
            <p className="text-gray-600">No files attached</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">
              Provide a certification of participation?:
            </p>
            <p className="text-gray-600">No</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3">Template Preview</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 bg-[#f5f5f4] whitespace-pre-wrap">
            <p>親愛的&#123;&#123;Name&#125;&#125;，</p>
            <p className="mt-4">
              您好！恭喜您成功加入「6th AWS Educate Taiwan
              雲端校園大使證照陪跑計畫」！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！
            </p>

            <p className="mt-4">
              為確保您能夠有效利用本計畫資源，校園大使團隊懇請心統整許多考照資源於在 Notion
              Page，並建立 Discord
              社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。
            </p>

            <p className="mt-4">
              您可以透過以下連結訪問：
              <br />
              Notion Page：點擊這裡
              <br />
              Discord 社群：&#123;&#123;Discord Link&#125;&#125;
            </p>

            <p className="mt-4">
              【注意事項】
              <br />
              請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。
              <br />
              陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見
              Notion Page。
            </p>

            <p className="mt-4">
              【開幕活動與報名資訊】
              <br />
              隨著「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」正式啟動，誠摯邀請您參加 2024
              年 5 月 3
              日（星期五）舉行的開幕活動。開幕活動不僅補充詳細計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。
              <br />
              有意願參加開幕活動請填寫以下報名表單，表單將於 4/29 (一) 18:00 截止：點擊這裡
            </p>

            <p className="mt-4">
              若您有任何問題或需要進一步協助，請隨時與我們聯繫，我們將竭誠為您服務！
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          className="px-6 py-2 bg-[#1a2f4a] text-white rounded flex items-center hover:bg-[#1a2f4a]/90"
          onClick={onSubmit}
        >
          Send Email <Send className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
