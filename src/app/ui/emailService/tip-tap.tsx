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

export default function TipTap({ onChange, content }: TipTapProps) {
  const [, setEditorContent] = useState(content);
  const [, setIsFocused] = useState(false);

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
      StarterKit.configure({
        bulletList: false,
        listItem: false,
      }),
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
      ImageResize,
    ],
    editorProps: {
      attributes: {
        class:
          "w-full h-[60vh] border border-gray-300 rounded-md p-4 font-sans text-sm overflow-auto bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
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

  return (
    <>
      <div className="flex-col">
        <div className="pb-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center rounded-md p-1 bg-gray-200 mb-4">
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

          <div className="border border-sky-950 p-4 rounded-t-lg bg-sky-950 flex justify-between items-center">
            <span className="text-sm font-medium text-white">Template Preview</span>
          </div>

          {/* Editor Content */}
          <EditorContent
            editor={editor}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="p-4 border border-gray-200 border-t-0 bg-gray-50 rounded-b-lg "
          />
        </div>
      </div>
    </>
  );
}
