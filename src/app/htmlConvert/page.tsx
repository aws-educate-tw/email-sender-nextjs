"use client";
import { useState } from "react";
import Modal from "@/app/ui/email-template-preview";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImage(event.target.files[0]);
    }
  };

  const htmlTemplate = (title: string, content: string, imageUrl: string) => `
  <!DOCTYPE html>
  <html lang="zh-TW">
  <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f9;
              margin: 0;
              padding: 20px;
          }
          .container {
              background-color: white;
              padding-top: 40px;
              padding-bottom: 60px;
              padding-left: 60px;
              padding-right: 60px;
              margin: auto;
              max-width: 800px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
              color: #333;
          }
          p {
              color: #666;
              line-height: 1.6;
          }
          a {
              color: #0077cc;
          }
          ul {
              padding-left: 20px;
          }
          .banner {
              width: 100%;
              margin-bottom: 10px;
              border-radius: 8px;
          }
          .footer {
              display: flex;
              align-items: center;
              text-align: start;
              font-size: 0.9em;
              color: #777;
          }
          .avatar {
              width: 60px; 
              height: 60px; 
              border-radius: 50%;
              border: solid;
              border-width: 2px ;
              border-color: #333;
              margin-right: 15px; 
          }
          .avatar-info p {
              display: flex;
              flex-direction: column;
              line-height: 0.5 ;
          }
          .important {
              color: red;
          }
          .highlight {
              color: #333;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img class="banner" src="/aws-educate-banner.png" alt="Banner of AWS Educate">
          <h2>親愛的 {姓名}，</h2>
          <div>
              <p >您好！</p>
              <p>恭喜您成功加入<strong class="highlight">「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」</strong>！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！</p>
              <p>為確保您能夠有效利用本計畫資源，校園大使團隊精心統整許多考照資源於在 Notion Page，並建立 Discord 社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。</p>
              <p>您可以透過以下連結訪問：</p>
              <ul>
                <li>Notion Page：<a target="_blank" href="https://aws-educate-tw.notion.site/AWS-0824fda6e4aa470e863c4d91daf9563a">點擊這裡</a></li>
                <li>Discord 社群：{Discord Link}</li>
              </ul>
          </div>
          <b>【注意事項】</b>
          <ul>
              <li>請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。</li>
              <li>陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見 Notion Page。</li>
          </ul>
          <b>【開幕活動與報名資訊】</b>
          <div>
              <p>隨著「6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫」正式啟動，誠摯邀請您參加 2024 年 5 月 3 日（星期五）舉行的開幕活動。開幕活動不僅標誌著計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。</p>
              <p>有意願參加開幕活動請填寫以下報名表單，<span class="important">表單將於 4/29（一）18:00 截止</span>：<a target="_blank" href="https://www.surveycake.com/s/VKO3k">點擊這裡</a></p>
              <p>最後，我們再次感謝您的參與。這是一場充滿學習和成長的旅程，我們期待在開幕活動上見到您！</p>
              <p>若您有任何問題或需要進一步的幫助，請聯繫我們。</p>
              <p>台灣 AWS Educate Cloud Ambassador 官方社群：<a target="_blank" href="https://bit.ly/3pD9aCr">Facebook</a>＆<a target="_blank" href="https://bit.ly/3BBr7XQ">Instagram</a></p>
          </div>
                  
          <p>Best regards,</p>
          <div class="footer">
              <img class="avatar" src="/aws-educate-avatar.png" alt="Avatar of AWS Educate">
              <div class="avatar-info">
                  <p>Bill Wu</p>
                  <p>AWS Educate Cloud Ambassador</p>
                  <p><a href="mailto:billwu0222@gmail.com">billwu0222@gmail.com</a></p>
              </div>
          </div>
      </div>
  </body>
  </html>  
  `;

  const handlePreview = () => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64Image = e.target?.result;
      const htmlContent = htmlTemplate(title, content, base64Image as string);
      setPreviewHtml(htmlContent);
      setShowModal(true);
    };
    if (image) {
      reader.readAsDataURL(image);
    } else {
      const htmlContent = htmlTemplate(title, content, "");
      setPreviewHtml(htmlContent);
      setShowModal(true);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const blob = new Blob([previewHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "download.html";
    link.click();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="rounded-md bg-gray-50 p-4">
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your email title
            </label>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your email content
            </label>
            <textarea
              placeholder="Enter content"
              value={content}
              className="block rounded-md border min-h-64 border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Upload your email image
            </label>
            <input
              type="file"
              className="block rounded-md border bg-white border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="w-full flex justify-end my-3 gap-3">
          <button
            type="button"
            className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            onClick={handlePreview}
          >
            Preview
          </button>
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            content={previewHtml}
          />
          <button
            type="submit"
            className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
          >
            Download HTML
          </button>
        </div>
      </form>

      {/* <iframe
        srcDoc={previewHtml}
        style={{ width: "100%", height: "400px" }}
      ></iframe> */}
    </div>
  );
}
