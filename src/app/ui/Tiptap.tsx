"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/app/ui/Toolbar";
import { Underline } from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import "./styles.scss";

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
    <p>AWS Educate Cloud Ambassadorbillwu0222@gmail.com</p>`;

const Tiptap = ({ onChange, content }: any) => {
  const hangdleChange = (newContent: string) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline, BulletList, ListItem],
    editorProps: {
      attributes: {
        class:
          "flex min-h-96 flex-col px-4 justify-start border-b border-l border-r border-gray-700 text-gray-400 items-start w-full gap-3 font-medium pt-4 rounded-bl-md rounded-br-md outline-none focus:ring-2 focus:ring-sky-900 focus:ring-opacity-50",
      },
    },
    content: htmltemplate,
    onUpdate: ({ editor }) => {
      hangdleChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full px-4">
      <Toolbar editor={editor} content={content} />
      <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
    </div>
  );
};

export default Tiptap;
