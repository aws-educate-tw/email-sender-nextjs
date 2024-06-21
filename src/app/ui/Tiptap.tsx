"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/app/ui/Toolbar";
import { Underline } from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { Link } from "@tiptap/extension-link";
import "./styles.scss";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useState } from "react";

const htmltemplate = `
    <p>親愛的 {姓名}，</p>
    <p>您好！恭喜您成功加入<strong class="highlight">「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」</strong>！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！</p>
    <p>為確保您能夠有效利用本計畫資源，校園大使團隊精心統整許多考照資源於在 Notion Page，並建立 Discord 社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。</p>
    <p>您可以透過以下連結訪問：<br>Notion Page：<a target="_blank" href="https://aws-educate-tw.notion.site/AWS-0824fda6e4aa470e863c4d91daf9563a">點擊這裡</a><br>Discord 社群：{Discord Link}</p>
    <p>【注意事項】<br>請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。<br>陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見 Notion Page。</p>
    <p>【開幕活動與報名資訊】<br>隨著「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」正式啟動，誠摯邀請您參加 2024 年 5 月 3 日（星期五）舉行的開幕活動。開幕活動不僅標誌著計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。<br>有意願參加開幕活動請填寫以下報名表單，<span class="important">表單將於 4/29（一）18:00 截止</span>：<a target="_blank" href="https://www.surveycake.com/s/VKO3k">點擊這裡</a></p>
    <p>若您有任何問題或需要進一步協助，請隨時與我們聯繫，我們將竭誠為您服務！</p>
    <p>台灣 AWS Educate Cloud Ambassador 官方社群：Facebook＆Instagram</p>
    <p>Best regards,</p>
    <p>Bill Wu</p>
    <p>AWS Educate Cloud Ambassador</p>
    <p>billwu0222@gmail.com</p>`;

const Tiptap = ({ onChange, content }: any) => {
  const [editorContent, setEditorContent] = useState(htmltemplate);
  const [uploadResponse, setUploadResponse] = useState<null | {
    error: string;
  }>(null);

  const handleSave = () => {
    const blob = new Blob([editorContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "editor-content.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    const blob = new Blob([editorContent], { type: "text/html" });
    const formData = new FormData();
    formData.append("file", blob, "editor-content.html");

    try {
      const response = await fetch(
        "https://sojek1stci.execute-api.ap-northeast-1.amazonaws.com/dev/upload-multiple-file",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      setUploadResponse(result);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadResponse({ error: "Upload failed" });
    }
  };

  const handleChange = (newContent: string) => {
    console.log(newContent);
    setEditorContent(newContent);
    onChange(newContent);
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
    content: htmltemplate,
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full px-4">
      <div className="p-3 border-2 border-black flex flex-col justify-between rounded-lg">
        <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
        <Toolbar editor={editor} content={content} />
      </div>
      <div className="mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-4"
        >
          Save as HTML
        </button>
        <button
          onClick={handleUpload}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Upload and Show Response
        </button>
      </div>
      {uploadResponse && (
        <pre className="mt-4 p-4 bg-gray-800 text-white rounded">
          {JSON.stringify(uploadResponse, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Tiptap;
