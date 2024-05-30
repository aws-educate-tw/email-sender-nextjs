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
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<FileDataType | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log("Form Data:", formData);

    setIsSubmitting(true);

    try {
      // const response = await fetch(
      //   "https://ssckvgoo10.execute-api.ap-northeast-1.amazonaws.com/dev/upload-file",
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );

      // if (!response.ok) {
      //   const errorMessage = `Upload failed: ${response.status} - ${response.statusText}`;
      //   throw new Error(errorMessage);
      // }
      // const result = await response.json();

      // Mock data
      const result = {
        file_id: "001b6694f73f4e418f3e532f8a51c2fd",
        created_at: "2024-05-27T16:22:04Z",
        updated_at: "2024-05-27T16:22:04Z",
        file_url:
          "https://xxxxxx.s3.ap-northeast-1.amazonaws.com/resources/organizations/xxxxxxx/file1.xlsx",
        file_name: "file1.xlsx",
        file_extension: "xlsx",
        file_size: 123456,
        uploader_id: "dummy_uploader_id",
      };

      setFileData(result);
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
          <label className="mb-2 block text-lg font-medium">
            Upload a xlsx file
          </label>
          {/* <div className="justify-between py-3 px-5 gap-3 items-center bg-white rounded-md border border-gray-200 text-sm outline-2 placeholder:text-gray-500 w-full"> */}
          <input
            className="custom-fileinput block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white dark:text-gray-400 focus:outline-none dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            name="file"
            accept=".xlsx"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <style jsx>{`
            .custom-fileinput-label {
              background-color: #082f49;
            }
          `}</style>
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            .xlsx files only
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
        {/* </div> */}
      </form>
      {fileData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">File Details:</h3>
          <table className="table-fixed w-full">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="text-sm text-gray-500">
                <td className="py-2 px-3 font-medium">File Name:</td>
                <td className="py-2 px-3">{fileData.file_name}</td>
              </tr>
              <tr className="text-sm text-gray-500">
                <td className="py-2 px-3 font-medium">File Size:</td>
                <td className="py-2 px-3">{fileData.file_size}</td>
              </tr>
              <tr className="text-sm text-gray-500">
                <td className="py-2 px-3 font-medium">Created At:</td>
                <td className="py-2 px-3">
                  {new Date(fileData.created_at).toLocaleString()}
                </td>
              </tr>
              <tr className="text-sm text-gray-500">
                <td className="py-2 px-3 font-medium">Updated At:</td>
                <td className="py-2 px-3">
                  {new Date(fileData.updated_at).toLocaleString()}
                </td>
              </tr>
              <tr className="text-sm text-gray-500">
                <td className="py-2 px-3 font-medium">Download:</td>
                <td className="py-2 px-3">
                  <a
                    href={fileData.file_url}
                    className="text-blue-500 hover:underline"
                  >
                    Download File
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
