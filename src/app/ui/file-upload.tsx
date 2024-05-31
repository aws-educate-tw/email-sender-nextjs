"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";

interface FileDataType {
  file_id: string;
  created_at: string;
  updated_at: string;
  file_url: string;
  file_name: string;
  file_extension: string;
  file_size: number;
  uploader_id: string;
}

export default function UploadFile() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileData, setFileData] = useState<FileDataType[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    console.log("Form Data:", formData);

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://sojek1stci.execute-api.ap-northeast-1.amazonaws.com/dev/upload-multiple-file",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = `Upload failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();

      setFileData(result.files);
      alert("File uploaded successfully!");
    } catch (error: any) {
      alert("Failed to send form data: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="rounded-md bg-gray-100 p-4 min-w-48">
          <label className="mb-2 block text-lg font-medium">Upload files</label>
          <input
            className="custom-fileinput block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            name="file"
            onChange={handleFileChange}
            disabled={isSubmitting}
            multiple
          />
          <style jsx>{`
            .custom-fileinput-label {
              background-color: #082f49;
            }
          `}</style>
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-right"
            id="file_input_help"
          >
            .docx .html .xlsx .pdf
          </p>
        </div>
        <div className="flex justify-end py-3">
          <button
            type="submit"
            className={`flex h-10 items-center rounded-lg ${
              isSubmitting ? "bg-gray-500" : "bg-sky-800 hover:bg-sky-700"
            } px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </form>
      {fileData && (
        <div>
          {fileData.map((file: FileDataType, index: number) => (
            <div key={index}>
              <p>File Name: {file.file_name}</p>
              <p>File URL: {file.file_url}</p>
              <p>Uploaded At: {file.created_at}</p>
              <p>File Size: {file.file_size} bytes</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
