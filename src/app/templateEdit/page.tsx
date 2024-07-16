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
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Create an Email template</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Create and save your html file here.
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <div className="">
        <div className="">
          <TipTap
            content={content}
            onChange={(newContent: string) => handleContentChange(newContent)}
          />
        </div>
      </div>
    </div>
  );
}
