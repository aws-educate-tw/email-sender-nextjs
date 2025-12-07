"use client";
import { useEffect, useState } from "react";
import TipTap from "@/app/ui/emailService/tip-tap";
import { Check } from "lucide-react";
import cn from "classnames";
import { ArrowRight } from "lucide-react";

const htmltemplateContent = ``;

interface EmailServiceTemplateEditorProps {
  onNext: () => void;
  templateFileUrl?: string | null;
  onSave?: (templateFileName: string, templateFileId: string, templateFileUrl: string) => void;
}

export default function EmailServiceTemplateEditor({
  onNext,
  templateFileUrl,
  onSave,
}: EmailServiceTemplateEditorProps) {
  const [content, setContent] = useState(htmltemplateContent);
  const [originalContent, setOriginalContent] = useState(htmltemplateContent);
  const [templateName, setTemplateName] = useState("");
  const [saveButtonState, setSaveButtonState] = useState<"idle" | "saved" | "error">("idle");
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (templateFileUrl) {
      fetch(templateFileUrl)
        .then(response => response.text())
        .then(htmlContent => {
          setContent(htmlContent);
          setOriginalContent(htmlContent);
          setHasChanges(false);
        })
        .catch(error => {
          console.error("Error fetching template file:", error);
        });
    } else {
      setOriginalContent(htmltemplateContent);
      setHasChanges(false);
    }
  }, [templateFileUrl]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== originalContent);
    // Reset save state when content changes
    if (saveButtonState === "saved") {
      setSaveButtonState("idle");
    }
  };

  // Upload base64 image to S3 and return the S3 URL
  const uploadBase64ImageToS3 = async (base64Data: string): Promise<string | null> => {
    try {
      // Extract the data from base64 string
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 data");
      }

      const mimeType = matches[1];
      const base64Content = matches[2];

      // Convert base64 to blob
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // Generate a unique filename
      const extension = mimeType.split("/")[1] || "png";
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${templateName}_image_${timestamp}_${randomStr}.${extension}`;

      // Upload to S3
      const formData = new FormData();
      formData.append("file", blob, fileName);

      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/upload-multiple-file`);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      return result?.files?.[0]?.file_url || null;
    } catch (error) {
      console.error("Failed to upload image:", error);
      return null;
    }
  };

  // Process content and upload all base64 images to S3
  const processImagesAndUpload = async (htmlContent: string): Promise<string> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");

    // Upload all base64 images
    const uploadPromises: Promise<void>[] = [];
    
    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && src.startsWith("data:")) {
        // This is a base64 image, upload it
        const uploadPromise = uploadBase64ImageToS3(src).then((s3Url) => {
          if (s3Url) {
            img.setAttribute("src", s3Url);
          }
        });
        uploadPromises.push(uploadPromise);
      }
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    // Return the updated HTML
    return doc.body.innerHTML;
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

    let formattedContent = preserveEmptyLines(content);
    
    // Upload all base64 images to S3 and replace with S3 URLs
    try {
      setIsUploading(true);
      formattedContent = await processImagesAndUpload(formattedContent);
    } catch (error) {
      console.error("Failed to process images:", error);
      alert("Failed to upload images. Please try again.");
      setIsUploading(false);
      setSaveButtonState("error");
      setTimeout(() => {
        setSaveButtonState("idle");
      }, 3000);
      return;
    }

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
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });
      const result = await response.json();
      setIsUploading(false);

      // Show "Saved" button state
      setSaveButtonState("saved");

      // Update original content and reset changes flag
      setOriginalContent(content);
      setHasChanges(false);

      // Extract file_id from the response and pass it to the onSave callback
      const templateFileName = result?.files?.[0]?.file_name;
      const templateFileId = result?.files?.[0]?.file_id;
      const templateFileUrl = result?.files?.[0]?.file_url;

      // Call the onSave callback if provided
      if (onSave) {
        onSave(templateFileName, templateFileId, templateFileUrl);
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
    // If there are changes, save first
    if (hasChanges && saveButtonState !== "saved") {
      handleUpload();
      return;
    }

    // If no changes or already saved, proceed to next step
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
      <div className="flex flex-col justify-center items-start"></div>
      <div>
        <TipTap content={content} onChange={handleContentChange} />
      </div>
      <div className="flex flex-wrap justify-end gap-3 items-center h-12">
        {/* Template Name Input */}
        <div className="relative flex items-center w-60 h-full">
          <input
            type="text"
            placeholder="Enter file name"
            value={templateName}
            onChange={e => {
              // 自動移除 .html 後綴
              const value = e.target.value.replace(/\.html$/i, "");
              setTemplateName(value);
            }}
            className="w-full rounded-md border border-gray-300 pl-3 pr-14 py-2 text-base focus:outline focus:ring-2 focus:ring-sky-950 h-full"
          />
          <span className="absolute right-3 text-gray-500 text-sm pointer-events-none">.html</span>
        </div>

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
          disabled={hasChanges && saveButtonState !== "saved"}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-3 text-base font-medium text-white transition-colors",
            hasChanges && saveButtonState !== "saved"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1a2f4a] hover:bg-[#1a2f4a]/90"
          )}
        >
          {hasChanges && saveButtonState !== "saved" ? "Save First" : "Next"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
