"use client";
import { useState } from "react";
import TextEditor from "@/app/ui/text-editor";

export default function Home() {
  const [emailHtml, setEmailHtml] = useState<string>(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Custom Email Template</title>
        <style>
            body { font-family: 'Arial', sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px; }
            .container { background-color: white; padding: 40px 60px; margin: auto; max-width: 800px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            p { color: #333; line-height: 1.6; }
            a { color: #0077cc; }
            b { line-height: 2; }
            .important { color: red; }
            .highlight { font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <p>【信件主旨】</p>
            <p>親愛的 {姓名}，</p>
              <div class="title-content">
              <p>您好！</p>
              <p>恭喜您成功加入<strong class="highlight">「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」</strong>！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！</p>
              <p>為確保您能夠有效利用本計畫資源，校園大使團隊精心統整許多考照資源於在 Notion Page，並建立 Discord 社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。</p>
              </div>
            <p>【注意事項】</p>
            <ul class="notice-content">
              <li>請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。</li>
              <li>陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見 Notion Page。</li>
            </ul>
            <p>【開幕活動與報名資訊】</p>
            <div class="full-content"> 
              <p>隨著「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」正式啟動，誠摯邀請您參加 2024 年 5 月 3 日（星期五）舉行的開幕活動。開幕活動不僅標誌著計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。</p>
              <p>有意願參加開幕活動請填寫以下報名表單，<span class="important">表單將於 4/29（一）18:00 截止</span>：<a target="_blank" href="https://www.surveycake.com/s/VKO3k">點擊這裡</a></p>
              <p>最後，我們再次感謝您的參與。這是一場充滿學習和成長的旅程，我們期待在開幕活動上見到您！</p>
              <p>若您有任何問題或需要進一步的幫助，請聯繫我們。</p>
              <p>台灣 AWS Educate Cloud Ambassador 官方社群：<a target="_blank" href="https://bit.ly/3pD9aCr">Facebook</a>＆<a target="_blank" href="https://bit.ly/3BBr7XQ">Instagram</a></p>
            </div>
            <p>Best regards,</p>
            <div style="display: flex; align-items: center; font-size: 0.9em; color: #777; padding-top:20px">
                <img src="/aws-educate-avatar.png" alt="Avatar of AWS Educate" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #333; margin-right: 15px;">
                <div>
                    <p>Bill Wu</p>
                    <p>AWS Educate Cloud Ambassador</p>
                    <p><a href="mailto:billwu0222@gmail.com">billwu0222@gmail.com</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);

  const downloadHtmlFile = (html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "exported_content.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <TextEditor content={emailHtml} onChange={setEmailHtml} />
      {/* <div dangerouslySetInnerHTML={{ __html: emailHtml }} /> */}
      <button onClick={() => downloadHtmlFile(emailHtml)}>Download HTML</button>
    </div>
  );
}
