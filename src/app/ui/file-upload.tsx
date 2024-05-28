"use client";
import React, { useRef, useState, FormEvent } from "react";

export default function UploadFile() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [link, setLink] = useState<string>("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = new FormData(ref.current);
    const fileInput = ref.current.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      formData.append("file", file);
      formData.append("filename", file.name);

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        setLink(result.S3URL);
        alert(result.message || "File uploaded successfully!");
        // ref.current.reset();
      } catch (error: any) {
        alert("Failed to send form data: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} ref={ref}>
        <div className="rounded-md bg-gray-50 p-4">
          <label className="mb-2 block text-lg font-medium">
            Upload a xlsx file
          </label>
          <div className="flex justify-between py-3 px-5 gap-3 items-center bg-white rounded-md border border-gray-200 text-sm outline-2 placeholder:text-gray-500 w-full">
            <input
              type="file"
              name="file"
              accept=".xlsx"
              disabled={isSubmitting}
              className="flex flex-grow hover:cursor-pointer text-lg"
            />
            <button
              type="submit"
              className={`flex h-10 items-center rounded-lg ${
                isSubmitting ? "bg-gray-500" : "bg-sky-800 hover:bg-sky-700"
              } px-4 text-sm font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>
      </form>
      {link && (
        <a href={link} className="hover:text-blue-500 hover:underline">
          This is the S3 url you have uploaded
        </a>
      )}
    </>
  );
}
