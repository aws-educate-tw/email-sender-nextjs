"use client";
import { useState, ChangeEvent } from "react";
import EmailTemplatePreview from "@/app/ui/email-template-preview";

interface FileInputEvent extends ChangeEvent<HTMLInputElement> {}

export default function Home() {
  const [helpHtml, setHelpHtml] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const [title, setTitle] = useState<string>(
    "6th AWS Educate Taiwan 雲端校園大使證照陪跑計畫"
  );
  const [content, setContent] = useState<string>(
    "誠摯邀請您參加 2024 年 5 月 3 日（星期五）舉行的開幕活動。開幕活動不僅標誌著計畫的正式啟動，也將針對計畫內容、規則等詳細說明，亦可與其他參與者相互認識、交流分享。"
  );
  const [eventLink, setEventLink] = useState<string>(
    "https://www.surveycake.com/s/VKO3k"
  );
  const [deadline, setDeadline] = useState<string>("4/29（一）18:00");
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [name, setName] = useState<string>("Harry Chung");
  const [email, setEmail] = useState<string>("harryTest@gmail.com");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const loadHelpContent = async () => {
    try {
      const response = await fetch("./reference.html");
      const htmlContent = await response.text();
      setHelpHtml(htmlContent);
      setShowHelpModal(true);
    } catch (error) {
      console.error("Failed to load help content:", error);
    }
  };

  const handleImageChange = (
    event: FileInputEvent,
    setImage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const convertToBase64 = (file: File | null): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      if (file) {
        reader.readAsDataURL(file);
      } else {
        resolve("");
      }
    });

  const convertImageToBase64 = (imgUrl: string): Promise<string> =>
    new Promise((resolve, reject) => {
      fetch(imgUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
        })
        .catch(reject);
    });

  const htmlTemplate = (
    title: string,
    content: string,
    eventLink: string,
    deadline: string,
    name: string,
    email: string,
    bannerImageUrl: string,
    avatarImageUrl: string
  ) => `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
    </head>
    <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
        <div style="background-color: white; padding: 40px 60px 60px 60px; margin: auto; max-width: 800px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img class="banner" src="${
              bannerImageUrl || "/aws-educate-banner.png"
            }" alt="Banner of AWS Educate" style="width: 100%; margin-bottom: 10px; border-radius: 8px;">
            <p>親愛的{name} ，</p>
            <div>
                <p>您好！</p>
                <p>恭喜您成功加入<strong style="color: #FB2200; font-weight: bold;">「${title}」</strong>！非常高興您決定與我們一起踏上學習的旅程，共同探索雲端技術的無限可能！</p>
                <p>為確保您能夠有效利用本計畫資源，校園大使團隊精心統整許多考照資源於在 Notion Page，並建立 Discord 社群以促進更深入的討論和即時互動，讓您可以輕鬆地提問並與大使互動問答。</p>
                <b>您可以透過以下連結訪問：</b>
                <ul style="padding-left: 20px;">
                  <li>Notion Page：<a target="_blank" href="https://aws-educate-tw.notion.site/AWS-0824fda6e4aa470e863c4d91daf9563a" style="color: #0077cc;">點擊這裡</a></li>
                  <li>Instagram 社群：<a target="_blank" href="https://www.instagram.com/awseducatestdambtw?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" style="color: #0077cc;">點擊這裡</a></li>
                </ul>
            </div>
            <b>【注意事項】</b>
            <ul style="padding-left: 20px;">
                <li>請記得定期追蹤計畫 Notion Page 和 Discord 社群，我們會定期更新資源和消息。</li>
                <li>陪跑計畫包含證照課程與獎勵課程，獎勵課程需完成規定的課程進度才可以參與，詳細規則請見 Notion Page。</li>
            </ul>
            <b>【開幕活動與報名資訊】</b>
            <div>
                <p>隨著「${title}」正式啟動，${content}</p>
                <p>有意願參加活動請填寫以下報名表單，<span style="color: red;">表單將於 ${deadline} 截止</span>：<a target="_blank" href="${eventLink}" style="color: #0077cc;">點擊這裡</a></p>
                <p>最後，我們再次感謝您的參與。這是一場充滿學習和成長的旅程，我們期待在開幕活動上見到您！</p>
                <p>若您有任何問題或需要進一步的幫助，請聯繫我們。</p>
                <p>台灣 AWS Educate Cloud Ambassador 官方社群：<a target="_blank" href="https://bit.ly/3pD9aCr" style="color: #0077cc;">Facebook</a>＆<a target="_blank" href="https://bit.ly/3BBr7XQ" style="color: #0077cc;">Instagram</a></p>
            </div>
            <br>
                    
            <p>Best regards,</p>
            <div class="footer" style="display: flex; align-items: center; text-align: start; font-size: 0.9em; color: #777;">
                <img class="avatar" src="${
                  avatarImageUrl || "/aws-educate-avatar.png"
                }" alt="Avatar of AWS Educate" style="width: 80px; height: 80px; border-radius: 50%; border: solid 2px #333; margin-right: 15px;">
                <div class="avatar-info" style="display: flex; flex-direction: column; line-height: 0.5;">
                    <p>${name}</p>
                    <p>AWS Educate Cloud Ambassador</p>
                    <p><a href="mailto:${email}" style="color: #0077cc;">${email}</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>  
    `;

  const handlePreview = async () => {
    const bannerBase64 = bannerImage
      ? await convertToBase64(bannerImage)
      : await convertImageToBase64("/aws-educate-banner.png"); // Update the path as per your directory structure

    const avatarBase64 = avatarImage
      ? await convertToBase64(avatarImage)
      : await convertImageToBase64("/aws-educate-avatar.png"); // Update the path as per your directory structure

    const htmlContent = htmlTemplate(
      title,
      content,
      eventLink,
      deadline,
      name,
      email,
      bannerBase64,
      avatarBase64
    );

    setPreviewHtml(htmlContent);
    setShowModal(true);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Initialize base64 strings for images
    let bannerBase64 = "";
    let avatarBase64 = "";

    // Convert banner image if it exists or fallback to a default image
    if (bannerImage) {
      bannerBase64 = await convertToBase64(bannerImage);
    } else {
      bannerBase64 = await convertImageToBase64("/aws-educate-banner.png"); // Ensure the path is correct
    }

    // Convert avatar image if it exists or fallback to a default image
    if (avatarImage) {
      avatarBase64 = await convertToBase64(avatarImage);
    } else {
      avatarBase64 = await convertImageToBase64("/aws-educate-avatar.png"); // Ensure the path is correct
    }

    // Generate HTML content with the converted images
    const htmlContent = htmlTemplate(
      title,
      content,
      eventLink,
      deadline,
      name,
      email,
      bannerBase64,
      avatarBase64
    );

    // Update the state to hold the latest HTML
    setPreviewHtml(htmlContent);

    // Create a blob from the latest HTML content and trigger the download
    const blob = new Blob([htmlContent], { type: "text/html" });
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
              Upload your banner image
            </label>
            <input
              type="file"
              className="block rounded-md border bg-white border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) =>
                handleImageChange(e as FileInputEvent, setBannerImage)
              }
            />
          </div>
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
              className="block rounded-md border min-h-40 border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your event link
            </label>
            <input
              placeholder="Enter Link"
              value={eventLink}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) => setEventLink(e.target.value)}
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your event deadline
            </label>
            <input
              placeholder="Enter event deadline"
              value={deadline}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your name
            </label>
            <input
              placeholder="Enter name"
              value={name}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your email
            </label>
            <input
              placeholder="Enter email"
              value={email}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Upload your avatar image
            </label>
            <input
              type="file"
              className="block rounded-md border bg-white border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
              onChange={(e) =>
                handleImageChange(e as FileInputEvent, setAvatarImage)
              }
            />
          </div>
        </div>
        <div className="w-full flex justify-end my-3 gap-3">
          <button
            type="button"
            className="flex h-10 items-center rounded-lg px-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 active:text-gray-600"
            onClick={loadHelpContent}
          >
            Help
          </button>
          <button
            type="button"
            className="flex h-10 items-center rounded-lg px-4 text-sm font-medium text-sky-800 transition-colors hover:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 active:text-sky-800"
            onClick={handlePreview}
          >
            Preview
          </button>
          <EmailTemplatePreview
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            content={previewHtml}
          />
          <EmailTemplatePreview
            isOpen={showHelpModal}
            onClose={() => setShowHelpModal(false)}
            content={helpHtml}
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
