"use client";
import { useState, useEffect } from "react";
import TipTap from "@/app/ui/tip-tap";
import { Check } from "lucide-react";
import cn from "classnames";

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

interface EmailServiceTemplateEditorProps {
  onNext: () => void;
  onSave?: (templateFileId: string, templateFileUrl: string) => void;
}

export default function EmailServiceTemplateEditor({
  onNext,
  onSave,
}: EmailServiceTemplateEditorProps) {
  const [content, setContent] = useState(htmltemplateContent);
  const [templateName, setTemplateName] = useState("");
  const [saveButtonState, setSaveButtonState] = useState<"idle" | "saved" | "error">("idle");
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleUpload = async () => {
    if (!templateName || templateName.trim() === "") {
      console.error("Template name is required");
      setSaveButtonState("error");
      setTimeout(() => {
        setSaveButtonState("idle");
      }, 3000);
      return;
    }

    const saveFileName = templateName.trim();

    const preserveEmptyLines = (content: string): string => {
      return (
        content
          // 將已有的空段落轉換為包含 &nbsp; 的格式
          .replace(/<p>\s*<\/p>/g, "<p>&nbsp;</p>")
          // 處理連續空行，但保留它們
          .replace(/(<p>&nbsp;<\/p>)+/g, match => match)
          // 確保段落之間有換行符號
          .replace(/<\/p><p>/g, "</p>\n<p>")
      );
    };

    const formattedContent = preserveEmptyLines(content);

    const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <title>加入 AWS Educate Taiwan 雲端校園大使證照陪跑計畫</title>
    </head>
    <body>
        ${formattedContent}
    </body>
    </html>`;
    const blob = new Blob([html], { type: "text/html" });
    const fileName = `${saveFileName}.html`;
    const formData = new FormData();
    formData.append("file", blob, fileName);

    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/upload-multiple-file`);
      setIsUploading(true);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });
      const result = await response.json();
      setIsUploading(false);
      setShowToast(true);

      // Show "Saved" button state
      setSaveButtonState("saved");
      setTimeout(() => {
        setSaveButtonState("idle");
      }, 3000);

      setTimeout(() => setShowToast(false), 5000);

      // Extract file_id from the response and pass it to the onSave callback
      const templateFileId = result?.files?.[0]?.file_id;
      const templateFileUrl = result?.files?.[0]?.file_url;

      // Call the onSave callback if provided
      if (onSave) {
        onSave(templateFileId, templateFileUrl);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setSaveButtonState("error");
      setTimeout(() => {
        setSaveButtonState("idle");
      }, 3000);
    }
  };

  const handleSaveTemplate = () => {
    if (saveButtonState === "saved") return;
    handleUpload();
  };

  const handleNextClick = () => {
    if (onNext) {
      onNext();
    } else {
      // Fallback to a default action if onNext is not provided
      console.warn("onNext callback is not provided, redirecting to recipients page.");
      window.location.href = "/emailService";
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        {/* <p className="text-4xl font-bold pt-2">Create an Email Template</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">Create and save your HTML file here.</p>
          <div className="flex justify-end">
            <TemplateDropdown onSelect={handleHtmlSelect} />
          </div>
        </div> */}
      </div>
      <div>
        <TipTap content={content} onChange={handleContentChange} />
      </div>
      <div className="flex flex-wrap justify-end gap-3 items-center h-12">
        {/* Template Name Input */}
        <input
          type="text"
          placeholder="Enter file name"
          value={templateName}
          onChange={e => setTemplateName(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-base w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
        />

        {/* Save Template Button */}
        {isUploading ? (
          <button
            className="rounded-md bg-gray-500 px-4 py-3 text-base font-medium text-white transition-colors"
            disabled
          >
            Saving...
          </button>
        ) : saveButtonState === "saved" ? (
          <button
            className="flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 px-4 py-3 text-base font-medium text-white transition-colors"
            disabled
          >
            <Check className="mr-2" size={20} /> Saved
          </button>
        ) : (
          <button
            onClick={handleSaveTemplate}
            disabled={!templateName || templateName.trim() === ""}
            className={cn(
              "flex items-center justify-center rounded-md px-4 py-3 text-base font-medium text-white transition-colors",
              saveButtonState === "error"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#1a2f4a] hover:bg-[#1a2f4a]/90 disabled:bg-gray-400"
            )}
          >
            Save Template
          </button>
        )}

        {/* Next Button */}
        <button
          onClick={handleNextClick}
          className="rounded-md bg-[#1a2f4a] hover:bg-[#1a2f4a]/90 px-4 py-3 text-base font-medium text-white transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
