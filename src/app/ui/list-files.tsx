"use client";
import React, { useState, useEffect, useRef } from "react";
import FileTable from "./FileTable";

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
  const [xlsxFiles, setXlsxFiles] = useState<fileDataType[] | null>(null);
  const [htmlFiles, setHtmlFiles] = useState<fileDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [xlsxLastEvaluatedKey, setXlsxLastEvaluatedKey] = useState<
    string | null
  >(null);
  const [htmlLastEvaluatedKey, setHtmlLastEvaluatedKey] = useState<
    string | null
  >(null);
  const limit = 10;

  useEffect(() => {
    if (!hasFetched.current) {
      fetchFiles("xlsx", setXlsxFiles, setXlsxLastEvaluatedKey);
      fetchFiles("html", setHtmlFiles, setHtmlLastEvaluatedKey);
      hasFetched.current = true;
    }
  }, []);

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

  return (
    <>
      <FileTable
        files={xlsxFiles}
        title="xlsx"
        loading={loading}
        fetchFiles={fetchFiles}
        setFiles={setXlsxFiles}
        setLastEvaluatedKey={setXlsxLastEvaluatedKey}
        lastEvaluatedKey={xlsxLastEvaluatedKey}
      />
      <FileTable
        files={htmlFiles}
        title="html"
        loading={loading}
        fetchFiles={fetchFiles}
        setFiles={setHtmlFiles}
        setLastEvaluatedKey={setHtmlLastEvaluatedKey}
        lastEvaluatedKey={htmlLastEvaluatedKey}
      />
      <div className="w-full flex justify-end my-3 gap-3">
        <button
          type="submit"
          className="text-white min-w-20 flex justify-center items-center bg-sky-950 hover:bg-sky-800 h-10 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          <a href="/sendEmail">Next...</a>
        </button>
      </div>
    </>
  );
}
