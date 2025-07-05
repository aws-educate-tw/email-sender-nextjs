"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import { useEffect, useState } from "react";
import { Toast } from "flowbite-react";
import { HiCheck } from "react-icons/hi";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Undo,
  Redo,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import cn from "classnames";
import "./styles.scss";

const ToolbarButton = ({
  icon,
  onClick,
  label,
  isActive = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  isActive?: boolean;
}) => (
  <button
    className={cn(
      "p-2 mx-1 rounded transition-colors",
      isActive ? "bg-gray-200" : "hover:bg-gray-100"
    )}
    onClick={onClick}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

interface TipTapProps {
  onChange: (content: string) => void;
  content: string;
  onNext?: () => void;
  templateName?: string;
  onSave?: (content: string, fileId?: string, fileUrl?: string) => void; // Updated callback signature
}

export default function TipTap({ onChange, content, onNext, templateName, onSave }: TipTapProps) {
  const [editorContent, setEditorContent] = useState(content);
  const [, setIsFocused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [saveButtonState, setSaveButtonState] = useState<"idle" | "saved" | "error">("idle");

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

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      BulletList,
      ListItem,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      Image,
      ImageResize,
    ],
    editorProps: {
      attributes: {
        class:
          "w-full h-[400px] border border-gray-200 rounded-md p-3 font-sans text-sm overflow-auto bg-white outline-none focus:border-gray-300",
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorContent(html);
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      setEditorContent(content);
    }
  }, [content, editor]);

  const handleFormatAction = (action: string) => {
    if (!editor) return;

    switch (action) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
      case "strikethrough":
        editor.chain().focus().toggleStrike().run();
        break;
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "numberedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "quote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "link":
        const url = window.prompt("Enter URL");
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        } else {
          editor.chain().focus().unsetLink().run();
        }
        break;
      case "image":
        const imageUrl = window.prompt("Enter image URL");
        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
        break;
      case "undo":
        editor.chain().focus().undo().run();
        break;
      case "redo":
        editor.chain().focus().redo().run();
        break;
      default:
        break;
    }
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
      setShowToast(true);

      // Show "Saved" button state
      setSaveButtonState("saved");
      setTimeout(() => {
        setSaveButtonState("idle");
      }, 3000);

      setTimeout(() => setShowToast(false), 5000);

      // Extract file_id from the response and pass it to the onSave callback
      const fileId = result?.files?.[0]?.file_id;
      const fileUrl = result?.files?.[0]?.file_url;

      // Call the onSave callback if provided
      if (onSave) {
        onSave(formattedContent, fileId, fileUrl);
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
      router.push("/sendEmail");
    }
  };

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

      <div className="relative">
        {/* Right-side floating buttons */}
        <div className="absolute right-0 top-0 flex flex-col gap-3 w-[200px] ml-4">
          {isUploading ? (
            <button
              className="w-full rounded-md bg-gray-500 px-4 py-3 text-base font-medium text-white transition-colors"
              disabled
            >
              Saving...
            </button>
          ) : (
            <>
              {saveButtonState === "saved" ? (
                <button
                  className="w-full flex items-center justify-center rounded-md bg-green-600 hover:bg-green-700 px-4 py-3 text-base font-medium text-white transition-colors"
                  disabled
                >
                  <Check className="mr-2" size={20} /> Saved
                </button>
              ) : (
                <button
                  onClick={handleSaveTemplate}
                  disabled={!templateName || templateName.trim() === ""}
                  className={cn(
                    "w-full flex items-center justify-center rounded-md px-4 py-3 text-base font-medium text-white transition-colors",
                    saveButtonState === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#1a2f4a] hover:bg-[#1a2f4a]/90 disabled:bg-gray-400"
                  )}
                >
                  Save Template
                </button>
              )}

              <button
                onClick={handleNextClick}
                className="w-full rounded-md bg-[#1a2f4a] hover:bg-[#1a2f4a]/90 px-4 py-3 text-base font-medium text-white transition-colors"
              >
                Next
              </button>
            </>
          )}
        </div>

        <div className="pr-[220px]">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center rounded-md p-1 bg-gray-50 mb-4">
            <ToolbarButton
              icon={<LinkIcon size={18} />}
              onClick={() => handleFormatAction("link")}
              label="Insert link"
              isActive={editor?.isActive("link")}
            />
            <ToolbarButton
              icon={<Bold size={18} />}
              onClick={() => handleFormatAction("bold")}
              label="Bold text"
              isActive={editor?.isActive("bold")}
            />
            <ToolbarButton
              icon={<Italic size={18} />}
              onClick={() => handleFormatAction("italic")}
              label="Italic text"
              isActive={editor?.isActive("italic")}
            />
            <ToolbarButton
              icon={<UnderlineIcon size={18} />}
              onClick={() => handleFormatAction("underline")}
              label="Underline text"
              isActive={editor?.isActive("underline")}
            />
            <ToolbarButton
              icon={<Strikethrough size={18} />}
              onClick={() => handleFormatAction("strikethrough")}
              label="Strikethrough text"
              isActive={editor?.isActive("strike")}
            />
            <ToolbarButton
              icon={<Heading1 size={18} />}
              onClick={() => handleFormatAction("h1")}
              label="Heading 1"
              isActive={editor?.isActive("heading", { level: 1 })}
            />
            <ToolbarButton
              icon={<Heading2 size={18} />}
              onClick={() => handleFormatAction("h2")}
              label="Heading 2"
              isActive={editor?.isActive("heading", { level: 2 })}
            />
            <ToolbarButton
              icon={<Heading3 size={18} />}
              onClick={() => handleFormatAction("h3")}
              label="Heading 3"
              isActive={editor?.isActive("heading", { level: 3 })}
            />
            <ToolbarButton
              icon={<List size={18} />}
              onClick={() => handleFormatAction("bulletList")}
              label="Bullet list"
              isActive={editor?.isActive("bulletList")}
            />
            <ToolbarButton
              icon={<ListOrdered size={18} />}
              onClick={() => handleFormatAction("numberedList")}
              label="Numbered list"
              isActive={editor?.isActive("orderedList")}
            />
            <ToolbarButton
              icon={<Quote size={18} />}
              onClick={() => handleFormatAction("quote")}
              label="Quote"
              isActive={editor?.isActive("blockquote")}
            />
            <ToolbarButton
              icon={<ImageIcon size={18} aria-hidden="true" />}
              onClick={() => handleFormatAction("image")}
              label="Insert image"
            />
            <ToolbarButton
              icon={<Undo size={18} />}
              onClick={() => handleFormatAction("undo")}
              label="Undo"
            />
            <ToolbarButton
              icon={<Redo size={18} />}
              onClick={() => handleFormatAction("redo")}
              label="Redo"
            />
          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>
    </>
  );
}
