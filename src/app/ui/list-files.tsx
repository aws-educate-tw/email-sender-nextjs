"use client";
import React, { useState, useEffect, useRef } from "react";
import FileTable from "@/app/ui/file-table";
import DriveUpload from "@/app/ui/drive-upload";

interface fileDataType {
  file_id: string;
  created_at: string;
  updated_at: string;
  file_url: string;
  file_name: string;
  file_extension: string;
  file_size: number;
  uploader_id: string;
}

export default function ListFiles() {
  const hasFetched = useRef(false);
  const [htmlFiles, setHtmlFiles] = useState<fileDataType[] | null>(null);
  const [xlsxFiles, setXlsxFiles] = useState<fileDataType[] | null>(null);
  const [htmlLastEvaluatedKey, setHtmlLastEvaluatedKey] = useState<
    string | null
  >(null);
  const [xlsxLastEvaluatedKey, setXlsxLastEvaluatedKey] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const limit = 10;

  const fetchFiles = async (
    file_extension: string,
    setFiles: React.Dispatch<React.SetStateAction<fileDataType[] | null>>,
    setLastEvaluatedKey: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    try {
      setLoading(true);
      const base_url =
        "https://8um2zizr80.execute-api.ap-northeast-1.amazonaws.com/dev";
      const url = new URL(`${base_url}/files`);
      url.searchParams.append("file_extension", file_extension);
      url.searchParams.append("limit", limit.toString());

      const lastEvaluatedKey =
        file_extension === "xlsx" ? xlsxLastEvaluatedKey : htmlLastEvaluatedKey;
      if (lastEvaluatedKey) {
        url.searchParams.append("last_evaluated_key", lastEvaluatedKey);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        const errorMessage = `Request failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setFiles((prevFiles) =>
        prevFiles ? [...prevFiles, ...result.data] : result.data
      );
      setLastEvaluatedKey(result.last_evaluated_key || null);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchFiles("xlsx", setXlsxFiles, setXlsxLastEvaluatedKey);
      fetchFiles("html", setHtmlFiles, setHtmlLastEvaluatedKey);
      hasFetched.current = true;
    }
  }, [fetchFiles]);

  const handleOpenUpload = () => {
    setShowUpload(true);
  };
  const handleCloseUpload = () => {
    setShowUpload(false);
  };

  const handleFileUploadSuccess = (newFiles: fileDataType[]) => {
    const htmlFilesUploaded = newFiles.filter(
      (file) => file.file_extension === "html"
    );
    const xlsxFilesUploaded = newFiles.filter(
      (file) => file.file_extension === "xlsx"
    );

    setHtmlFiles((prevFiles) =>
      prevFiles ? [...htmlFilesUploaded, ...prevFiles] : htmlFilesUploaded
    );
    setXlsxFiles((prevFiles) =>
      prevFiles ? [...xlsxFilesUploaded, ...prevFiles] : xlsxFilesUploaded
    );
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">TPET drive</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Select <strong>a participants sheet</strong> and{" "}
            <strong>an email template</strong> in each table.
          </p>
          <button
            onClick={handleOpenUpload}
            className="text-white min-w-32 bg-sky-950 hover:bg-sky-800 h-10 rounded-lg px-4 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Upload New Files
          </button>
        </div>
      </div>
      {showUpload && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-screen-lg relative">
            <button
              onClick={handleCloseUpload}
              className="absolute top-4 right-4 text-black"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
            <DriveUpload onFileUploadSuccess={handleFileUploadSuccess} />
          </div>
        </div>
      )}
      <FileTable
        files={htmlFiles}
        title="Email Template Table"
        file_extension="html"
        loading={loading}
        fetchFiles={fetchFiles}
        setFiles={setHtmlFiles}
        setLastEvaluatedKey={setHtmlLastEvaluatedKey}
        lastEvaluatedKey={htmlLastEvaluatedKey}
      />
      <FileTable
        files={xlsxFiles}
        title="Participants Sheet Table"
        file_extension="xlsx"
        loading={loading}
        fetchFiles={fetchFiles}
        setFiles={setXlsxFiles}
        setLastEvaluatedKey={setXlsxLastEvaluatedKey}
        lastEvaluatedKey={xlsxLastEvaluatedKey}
      />
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
