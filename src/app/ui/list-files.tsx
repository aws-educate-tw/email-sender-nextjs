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
  const limit = 10;
  const last_evaluated_key =
    "eyJmaWxlX2lkIjogIjdkYmY2NGU3ZTIyMDQ5NWU5NmZhNmJmNmI0NzJmNmQzIn0=";

  useEffect(() => {
    if (!hasFetched.current) {
      fetchFiles("xlsx", setXlsxFiles);
      fetchFiles("html", setHtmlFiles);
      hasFetched.current = true;
    }
  }, []);

  const fetchFiles = async (
    file_extension: string,
    setFiles: React.Dispatch<React.SetStateAction<fileDataType[] | null>>
  ) => {
    try {
      setLoading(true);
      // alert("fetching files from " + file_extension);
      const base_url =
        "https://8um2zizr80.execute-api.ap-northeast-1.amazonaws.com/dev";
      const url = `${base_url}/files?file_extension=${file_extension}&last_evaluated_key=${last_evaluated_key}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        const errorMessage = `Request failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setFiles(result.data);
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
        setXlsxFiles={setXlsxFiles}
        setHtmlFiles={setHtmlFiles}
      />
      <FileTable
        files={htmlFiles}
        title="html"
        loading={loading}
        fetchFiles={fetchFiles}
        setXlsxFiles={setXlsxFiles}
        setHtmlFiles={setHtmlFiles}
      />
    </>
  );
}
