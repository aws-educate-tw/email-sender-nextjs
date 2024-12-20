"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/app/ui/tool-bar";
import { Underline } from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { Link } from "@tiptap/extension-link";
import "./styles.scss";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useState } from "react";
import NextStepLink from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";

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

export default function TipTap({ onChange, content }: any) {
  const [editorContent, setEditorContent] = useState(htmltemplateContent);
  const [isFocused, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showNextStep, setShowNextStep] = useState(false);
  const [isFileNameEmpty, setIsFileNameEmpty] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const router = useRouter();

  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem("token_expiry_time");
    if (!expiryTime) return true;
    return new Date().getTime() > parseInt(expiryTime);
  };

  useEffect(() => {
    console.log("checkLoginStatus function called");
    const access_token = localStorage.getItem("access_token");
    if (!access_token || isTokenExpired()) {
      router.push("/login");
    }
  }, [router]);

  const handleUpload = async () => {
    const saveFileNameInput = document.getElementById("save_file_name") as HTMLInputElement;
    // Remove the leading and trailing white spaces
    const saveFileName = saveFileNameInput?.value.trim();

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

    const formattedContent = preserveEmptyLines(editorContent);

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
      console.log(result);
      setIsUploading(false);
      setIsFileNameEmpty(true);
      setShowNextStep(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Update the state of rich editor based on the input value
  const handleChange = (newContent: string) => {
    setEditorContent(newContent);
    onChange(newContent);
  };

  // Update the state of file name based on the input value
  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setIsFileNameEmpty(value === "");
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      BulletList,
      ListItem,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
      ImageResize,
    ],
    editorProps: {
      attributes: {
        class:
          "w-full flex-col justify-start text-black items-start w-full gap-3 pt-4 rounded-bl-md rounded-br-md outline-none",
      },
    },
    content: htmltemplateContent,
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-6 z-50">
          <Toast
            className="bg-green-400 drop-shadow-lg transition-opacity hover: cursor-pointer"
            onClick={() => setShowToast(false)}
          >
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
              <HiCheck className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3 font-medium text-white">File uploaded successfully.</div>
          </Toast>
        </div>
      )}
      <div className="w-full p-4 rounded-md bg-neutral-100">
        <div
          className={`bg-white p-3 px-6 border-2 border-gray-200 flex flex-col justify-between rounded-lg ${
            isFocused ? "outline outline-2 outline-blue-500" : ""
          }`}
        >
          <EditorContent
            style={{ whiteSpace: "pre-line" }}
            editor={editor}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Toolbar editor={editor} content={content} />
        </div>
      </div>
      <div className="mt-1 flex justify-end gap-2">
        {isUploading ? (
          <button
            onClick={handleUpload}
            className="flex mt-4 h-10 items-center rounded-lg bg-gray-500 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
            disabled
          >
            Saving...
          </button>
        ) : (
          <div className="flex flex-col">
            <p className="text-sm">File name</p>
            <div className="flex gap-2">
              <div className="flex items-center rounded-md border-2 overflow-hidden focus-within:outline focus-within:outline-2 focus-within:outline-blue-500">
                <input
                  id="save_file_name"
                  name="save_file_name"
                  type="text"
                  placeholder="Please Enter the File Name"
                  onChange={handleFileNameChange}
                  className="py-2 pl-4 pr-0 font-medium w-72 focus:outline-none border-none"
                />
                <div className="px-3 flex h-10 items-center justify-center font-medium bg-neutral-300 text-black">
                  .html
                </div>
              </div>
              <button
                onClick={handleUpload}
                disabled={isFileNameEmpty}
                className="flex whitespace-nowrap border-2 items-center rounded-lg bg-sky-950 hover:bg-sky-800 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 disabled:bg-gray-500"
              >
                Save as template
              </button>
              {showNextStep && (
                <NextStepLink
                  href="/sendEmail"
                  className="flex border-2 items-center rounded-lg  bg-sky-800 hover:bg-sky-700 hover:text-white px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
                >
                  Next Step &rarr;
                </NextStepLink>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
