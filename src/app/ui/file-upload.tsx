"use client";
import React, { useRef, useState, FormEvent } from "react";
import { set } from "zod";

const UploadFile: React.FC = () => {
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
        <input type="file" name="file" accept=".xlsx" disabled={isSubmitting} />
        <button type="submit" disabled={isSubmitting}>
          Upload File
        </button>
      </form>
      <a href={link} className="hover:text-blue-500 hover:underline">
        This is the S3 url you have uploaded
      </a>
    </>
  );
};

export default UploadFile;
