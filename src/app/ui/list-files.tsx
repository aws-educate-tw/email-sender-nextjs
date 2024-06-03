"use client";
import React, { useState, useEffect } from "react";

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
  const [files, setFiles] = useState<fileDataType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const limit = 10;
      const last_evaluated_key =
        "eyJmaWxlX2lkIjogIjdkYmY2NGU3ZTIyMDQ5NWU5NmZhNmJmNmI0NzJmNmQzIn0=";
      const file_extension = "xlsx";

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

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      {files ? (
        <div className="rounded-md bg-gray-100 p-4 min-w-48">
          <div className="flex justify-between px-1">
            <label className="mb-2 block text-lg font-medium">
              Uploaded files
            </label>
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="hover:bg-gray-200 rounded-md h-8 w-8 flex justify-center items-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V5q0-.425.288-.712T19 4t.713.288T20 5v5q0 .425-.288.713T19 11h-5q-.425 0-.712-.288T13 10t.288-.712T14 9h3.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313q.2-.35.563-.487t.737-.013q.4.125.575.525t-.025.75q-1.025 2-2.925 3.2T12 20"
                />
              </svg>
            </button>
          </div>
          <div className="relative overflow-x-auto rounded-md border">
            <table className="w-full text-sm text-left rtl:text-right text-black">
              <thead className="text-xs text-black uppercase bg-slate-300">
                <tr>
                  <th scope="col" className="pl-6 py-3">
                    SELECT
                  </th>
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
              {files.map((file: fileDataType, index: number) => (
                <tbody key={index}>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="pl-6 py-4">
                      <input
                        id={`bordered-checkbox-${index}`}
                        type="checkbox"
                        value=""
                        name="bordered-checkbox"
                        className="flex flex-grow text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
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
                    <td className="px-6 py-4">{file.created_at}</td>
                    <td className="px-6 py-4">{file.updated_at}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      ) : (
        !loading && <p>No files available.</p>
      )}
    </>
  );
}
