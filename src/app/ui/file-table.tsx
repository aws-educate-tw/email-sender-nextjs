import React, { useState, useEffect } from "react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";

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
  file_extension: string;
  loading: boolean;
  fetchFiles: (
    file_extension: string,
    setFiles: React.Dispatch<React.SetStateAction<fileDataType[] | null>>,
    setLastEvaluatedKey: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
  setFiles: React.Dispatch<React.SetStateAction<fileDataType[] | null>>;
  setLastEvaluatedKey: React.Dispatch<React.SetStateAction<string | null>>;
  lastEvaluatedKey: string | null;
}

export default function FileTable({
  files,
  title,
  file_extension,
  loading,
  fetchFiles,
  setFiles,
  setLastEvaluatedKey,
  lastEvaluatedKey,
}: FileTableProps) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    if (files && files.length > 0) {
      const latestFile = files.reduce((latest, file) => {
        return new Date(file.created_at) > new Date(latest.created_at)
          ? file
          : latest;
      }, files[0]);
      setSelectedFileId(latestFile.file_id);
      localStorage.setItem(`${file_extension}_key`, latestFile.file_id);
    }
  }, [files, file_extension]);

  const handleCheckboxChange = (file_id: string) => {
    setSelectedFileId(file_id);
    localStorage.setItem(`${file_extension}_key`, file_id);
  };

  return files ? (
    <div className="rounded-md bg-neutral-100 p-4 min-w-48 mb-4">
      <div className="flex justify-between px-1">
        <div className="flex items-end gap-3">
          <label className="mb-2 flex text-xl font-medium">{title}</label>
          <label className="mb-2 flex text-md font-medium text-gray-500 italic">
            .{file_extension} files are shown here
          </label>
        </div>
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
                  className="px-6 py-4 font-semibold text-black whitespace-nowrap max-w-40"
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
      <div className="flex justify-center items-center">
        <button
          onClick={() =>
            fetchFiles(file_extension, setFiles, setLastEvaluatedKey)
          }
          disabled={loading || !lastEvaluatedKey}
          className={`mt-3 p-2 rounded h-8 flex justify-center items-center ${
            loading || !lastEvaluatedKey
              ? "text-gray-400 cursor-not-allowed"
              : "active:text-sky-950 active:font-bold"
          }`}
        >
          <p className="">show more</p>
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
