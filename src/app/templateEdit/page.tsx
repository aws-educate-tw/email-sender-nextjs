"use client";
import { useState, useEffect } from "react";
import TipTap from "@/app/ui/tip-tap";
import TemplateDropdown from "@/app/ui/template-dropdown";

const htmltemplateContent = `
    <p>親愛的{{Name}}，</p>
    <p>您好！恭喜您成功加入<strong class="highlight">「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」</strong>！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！</p>
    <p>為確保您能夠有效利用本計畫資源，校園大使團隊精心統整許多考照資源於在 Notion Page，並建立 Discord 社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。</p>
    <p>您可以透過以下連結訪問：<br>Notion Page：<a target="_blank" href="https://aws-educate-tw.notion.site/AWS-0824fda6e4aa470e863c4d91daf9563a">點擊這裡</a><br>Discord 社群：{{Discord Link}}</p>
    <p>【注意事項】<br>請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。<br>陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見 Notion Page。</p>
    <p>【開幕活動與報名資訊】<br>隨著「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」正式啟動，誠摯邀請您參加 2024 年 5 月 3 日（星期五）舉行的開幕活動。開幕活動不僅標誌著計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。<br>有意願參加開幕活動請填寫以下報名表單，<span class="important">表單將於 4/29（一）18:00 截止</span>：<a target="_blank" href="https://www.surveycake.com/s/VKO3k">點擊這裡</a></p>
    <p>若您有任何問題或需要進一步協助，請隨時與我們聯繫，我們將竭誠為您服務！</p>
    <p>台灣 AWS Educate Cloud Ambassador 官方社群：Facebook＆Instagram</p>
    <br>
    <p>Best regards,</p>
    <p>Bill Wu</p>
    <p>AWS Educate Cloud Ambassador</p>
    <p>billwu0222@gmail.com</p>`;

export default function Page() {
  const [content, setContent] = useState(htmltemplateContent);
  const [htmlPreviewLink, setHtmlPreviewLink] = useState<string | null>(null);

  useEffect(() => {
    // Fetch HTML content when htmlPreviewLink changes
    const fetchHtmlContent = async () => {
      if (htmlPreviewLink) {
        try {
          const response = await fetch(htmlPreviewLink);
          if (!response.ok) {
            throw new Error("Failed to fetch the HTML file.");
          }
          const htmlContent = await response.text();

          // Extract the body content from the fetched HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, "text/html");
          const bodyContent = doc.body.innerHTML; // Extract only the body content

          // console.log("Fetched HTML body content:", bodyContent);
          setContent(bodyContent); // Update the TipTap content with the fetched HTML body
        } catch (error) {
          console.error("Error fetching HTML content:", error);
        }
      }
    };

    fetchHtmlContent();
  }, [htmlPreviewLink]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleHtmlSelect = (file_id: string | null, file_url: string | null) => {
    setHtmlPreviewLink(file_url);
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Create an Email Template</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">Create and save your HTML file here.</p>
          <div className="flex justify-end">
            <TemplateDropdown onSelect={handleHtmlSelect} />
          </div>
        </div>
      </div>
      <div>
        <TipTap
          content={content} // Pass the updated content
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}
