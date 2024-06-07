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

interface FileTableProps {
  files: fileDataType[] | null;
  title: string;
  loading: boolean;
  fetchFiles: (
    file_extension: string,
    setFiles: React.Dispatch<React.SetStateAction<fileDataType[] | null>>,
    setLastEvaluatedKey: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
  refreshFiles: (file_extension: string) => void;
  setFiles: React.Dispatch<React.SetStateAction<fileDataType[] | null>>;
  setLastEvaluatedKey: React.Dispatch<React.SetStateAction<string | null>>;
  lastEvaluatedKey: string | null;
}

export default function FileTable({
  files,
  title,
  loading,
  fetchFiles,
  refreshFiles,
  setFiles,
  setLastEvaluatedKey,
  lastEvaluatedKey,
}: FileTableProps) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    const savedFileId = localStorage.getItem(`${title}_key`);
    if (savedFileId) {
      setSelectedFileId(savedFileId);
    }
  }, [title]);

  const handleCheckboxChange = (file_id: string) => {
    setSelectedFileId(file_id);
    localStorage.setItem(`${title}_key`, file_id);
  };

  return files ? (
    <div className="rounded-md bg-gray-100 p-4 min-w-48 mb-4">
      <div className="flex justify-between px-1">
        <label className="mb-2 block text-lg font-medium">{title}</label>
        <button
          // onClick={() => fetchFiles(title, setFiles, setLastEvaluatedKey)}
          onClick={() => refreshFiles(title)}
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
                FILE ID
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
                    checked={selectedFileId === file.file_id}
                    onChange={() => handleCheckboxChange(file.file_id)}
                    className="flex flex-grow text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-semibold text-black whitespace-nowrap max-w-16"
                >
                  <a
                    className="hover:cursor-pointer hover:text-blue-500 underline"
                    href={file.file_url}
                  >
                    <p className="truncate">{file.file_name}</p>
                  </a>
                </th>
                <td className="px-6 py-4">{file.file_id}</td>
                <td className="px-6 py-4">{file.file_size}</td>
                <td className="px-6 py-4">{file.created_at}</td>
                <td className="px-6 py-4">{file.updated_at}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={() => fetchFiles(title, setFiles, setLastEvaluatedKey)}
          disabled={loading || !lastEvaluatedKey}
          className="mt-3 p-2 text-gray-500 rounded disabled:opacity-50 w-12 h-8 flex justify-center items-center"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12 14.95q-.2 0-.375-.062t-.325-.213l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213T12 14.95"
            />
          </svg>
        </button>
      </div>
    </div>
  ) : (
    !loading && <p>No files available.</p>
  );
}
