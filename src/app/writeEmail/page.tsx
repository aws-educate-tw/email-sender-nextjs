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
        <p className="text-4xl font-bold pt-2">Write a new Email</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Select the participants and write your email
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="bg-neutral-100 px-8 py-4 text-xl font-bold rounded-lg shadow-md">
          New Email
        </p>
        <div className="rounded-md bg-neutral-100 p-4 shadow-md">
          <div className="flex items-center m-3 px-1">
            <label className="min-w-24 text-sm font-medium">主旨 :</label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter the subject"
              // disabled={isSubmitting}
              className={`rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full border-gray-200`}
            />
          </div>
          <div className="flex items-center m-3 px-1">
            <label className="min-w-24 text-sm font-medium">寄件人姓名 :</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Enter the name"
              // disabled={isSubmitting}
              className={`rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full border-gray-200`}
            />
          </div>
          <div className="flex items-center m-3 px-1 py-2">
            <label className="min-w-24 text-sm font-medium">內容 :</label>
          </div>
          <TipTap
            content={content}
            onChange={(newContent: string) => handleContentChange(newContent)}
          />
        </div>
      </div>
    </div>
  );
}
