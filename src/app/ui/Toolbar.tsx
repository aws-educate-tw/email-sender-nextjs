import React, { useCallback } from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Underline,
  Quote,
  Undo,
  Redo,
  Link,
  Image,
} from "lucide-react";

type Props = {
  editor: Editor | null;
  content: string;
};

const Toolbar = ({ editor, content }: Props) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
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
    if (result && result.files && result.files.length > 0) {
      return result.files[0].file_url;
    }

    return null;
  };

  const addImage = useCallback(async () => {
    if (!editor) return;
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async () => {
      if (fileInput.files && fileInput.files[0]) {
        const fileUrl = await uploadFile(fileInput.files[0]);
        if (fileUrl) {
          editor.chain().focus().setImage({ src: fileUrl }).run();
        }
      }
    };
    fileInput.click();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="">
      <hr className="mt-12 mb-2 h-0.5 border-t-0 bg-neutral-300" />
      <div className="flex justify-start items-center gap-1 lg:w-10/12 flex-wrap">
        <button
          onClick={setLink}
          className={
            editor.isActive("link")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Link className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={
            editor.isActive("bold")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Bold className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={
            editor.isActive("italic")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Italic className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={
            editor.isActive("underline")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Underline className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={
            editor.isActive("strike")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Strikethrough className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={
            editor.isActive("heading", { level: 1 })
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Heading1 className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={
            editor.isActive("heading", { level: 2 })
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Heading2 className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={
            editor.isActive("heading", { level: 3 })
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Heading3 className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={
            editor.isActive("bulletList")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <List className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={
            editor.isActive("orderedList")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <ListOrdered className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={
            editor.isActive("blockquote")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Quote className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={addImage}
          className={
            editor.isActive("image")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Image className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
          className={
            editor.isActive("undo")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Undo className="w-5 h-5" />
          </div>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
          className={
            editor.isActive("redo")
              ? "border-2 border-neutral-300  bg-neutral-300 rounded text-white hover:bg-neutral-200 active:bg-neutral-100 active:border-neutral-200"
              : "border-2 border-neutral-300  text-sky-950 rounded shadow-lg hover:bg-neutral-100 active:bg-neutral-300 active:border-neutral-200"
          }
        >
          <div className="p-2">
            <Redo className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
