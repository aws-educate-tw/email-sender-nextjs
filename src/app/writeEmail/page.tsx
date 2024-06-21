"use client";
import { useState } from "react";
import TipTap from "@/app/ui/Tiptap";

export default function Page() {
  const [content, setContent] = useState("");

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  return (
    <div>
      <TipTap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </div>
  );
}
