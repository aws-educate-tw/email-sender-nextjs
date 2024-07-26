"use client";
import React, { useState, ChangeEvent } from "react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";

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

export default function FileUpload({
  OnFileExtension,
}: {
  OnFileExtension: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileData, setFileData] = useState<FileDataType[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    // console.log("Form Data:", formData);

    setIsSubmitting(true);

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

      if (!response.ok) {
        const errorMessage = `Upload failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();

      setFileData(result.files);
      // result.files.forEach((file: FileDataType) => {
      //   if (file.file_extension === "xlsx") {
      //     localStorage.setItem("xlsx_key", file.file_id);
      //   } else if (file.file_extension === "html") {
      //     localStorage.setItem("html_key", file.file_id);
      //   }
      // });
      // onFileUploadSuccess(result.files);
      alert("File uploaded successfully!");
    } catch (error: any) {
      alert("Failed to send form data: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start py-3 gap-2">
        <p className="text-4xl font-bold pt-2">Upload new files</p>
        {OnFileExtension === ".html" ? (
          <p className="text-gray-500 italic pb-4">
            Upload your email template.
          </p>
        ) : OnFileExtension === ".xlsx" ? (
          <p className="text-gray-500 italic pb-4">
            Upload your participants sheet.
          </p>
        ) : OnFileExtension === "all" ? (
          <p className="text-gray-500 italic pb-4">Attach your files.</p>
        ) : (
          <p className="text-gray-500 italic pb-4">Unsupported file type.</p>
        )}
      </div>
      <div>
        <div className="rounded-md bg-neutral-100 p-4 min-w-48">
          <label className="mb-2 block text-lg font-medium">Select files</label>
          <input
            className="custom-fileinput block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            name="file"
            onChange={handleFileChange}
            disabled={isSubmitting}
            multiple
            accept={OnFileExtension}
          />
          <style jsx>{`
            .custom-fileinput-label {
              background-color: #082f49;
            }
          `}</style>
          {OnFileExtension === "all" ? (
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-right"
              id="file_input_help"
            >
              all types of files are accepted
            </p>
          ) : (
            <p
              className="mt-1 text-sm text-gray-500 dark:text-gray-300 text-right"
              id="file_input_help"
            >
              only {OnFileExtension} is accepted
            </p>
          )}
        </div>
        <div className="flex justify-end py-3">
          <button
            type="button"
            onClick={handleUpload}
            className={`flex h-10 items-center rounded-lg ${
              isSubmitting ? "bg-gray-500" : "bg-sky-950 hover:bg-sky-800"
            } px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>
      {fileData && (
        <div className="rounded-md bg-neutral-100 p-4 min-w-48">
          <label className="mb-2 block text-lg font-medium">
            Uploaded files
          </label>
          <div>
            <div className="relative overflow-x-auto rounded-md border">
              <table className="w-full text-sm text-left rtl:text-right text-black">
                <thead className="text-xs text-black uppercase bg-slate-300">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      FILE NAME
                    </th>
                    <th scope="col" className="px-6 py-3">
                      FILE SIZE
                    </th>
                    <th scope="col" className="px-6 py-3">
                      CREATED AT
                    </th>
                    <th scope="col" className="px-6 py-3">
                      UPDATED AT
                    </th>
                  </tr>
                </thead>
                {fileData.map((file: FileDataType, index: number) => (
                  <tbody key={index}>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-semibold text-black whitespace-nowrap"
                      >
                        <a
                          className="hover:cursor-pointer hover:text-blue-500 underline"
                          href={file.file_url}
                        >
                          {file.file_name}
                        </a>
                      </th>
                      <td className="px-6 py-4">{file.file_size}</td>
                      <td className="px-6 py-4">
                        {convertToTaipeiTime(file.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        {convertToTaipeiTime(file.updated_at)}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      )}
      {/* <div className="w-full flex justify-end my-3 gap-3">
        <button
          type="submit"
          className="text-white min-w-32 flex justify-center items-center bg-sky-950 hover:bg-sky-800 h-10 rounded-lg px-4 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          <a href="/sendEmail">Next Step</a>
        </button>
      </div> */}
    </>
  );
}
