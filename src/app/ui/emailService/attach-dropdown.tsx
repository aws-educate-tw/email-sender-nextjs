"use client";
import { useState, useEffect, useRef } from "react";
import { convertToTaipeiTime, formatFileSize } from "@/lib/utils/dataUtils";

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

interface AttachDropdownProps {
  onEmailsChange: (
    selectedFiles: { file_name: string; file_id: string; file_url: string }[]
  ) => void;
}

export default function AttachDropdown({ onEmailsChange }: AttachDropdownProps) {
  const [options, setOptions] = useState<FileDataType[] | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<FileDataType[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileDataType[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options) {
      setFilteredOptions(
        options.filter(option => option.file_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }, [searchTerm, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchFiles = async (limit: number, lastEvaluatedKey: string | null) => {
    try {
      setIsLoading(true);
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/files`);
      url.searchParams.append("limit", limit.toString());
      if (lastEvaluatedKey) {
        url.searchParams.append("last_evaluated_key", lastEvaluatedKey);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok)
        throw new Error(`Request failed: ${response.status} - ${response.statusText}`);

      const result = await response.json();
      setOptions(result.data);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) fetchFiles(5, null);
    setIsOpen(!isOpen);
  };

  const handleSelect = (file: FileDataType | null) => {
    if (!file) {
      setSelectedFiles([]);
      onEmailsChange([]);
      setIsOpen(false);
      return;
    }

    const alreadySelected = selectedFiles.some(f => f.file_id === file.file_id);
    const updated = alreadySelected
      ? selectedFiles.filter(f => f.file_id !== file.file_id)
      : [...selectedFiles, file];

    setSelectedFiles(updated);
    onEmailsChange(
      updated.map(({ file_name, file_id, file_url }) => ({ file_name, file_id, file_url }))
    );
  };

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        className="text-start inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleDropdown}
      >
        {selectedFiles.length > 0
          ? selectedFiles.map(file => file.file_name).join(", ")
          : "Attach your files"}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="z-50 p-3 origin-top-right absolute w-full mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="flex justify-between items-center mb-2 pl-4">
            <p className="font-medium">ATTACH FILES</p>
            <input
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Search a file name..."
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : filteredOptions && filteredOptions.length > 0 ? (
            <table className="w-full text-sm">
              <tbody>
                <tr className="hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect(null)}>
                  <td className="py-2 px-4 text-gray-500 italic" colSpan={3}>
                    Clear Selection
                  </td>
                </tr>
                {filteredOptions.map(file => (
                  <tr
                    key={file.file_id}
                    className={`hover:bg-gray-100 cursor-pointer ${
                      selectedFiles.some(f => f.file_id === file.file_id) ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleSelect(file)}
                  >
                    <td className="py-2 px-4">{file.file_name}</td>
                    <td className="py-2 px-4">{convertToTaipeiTime(file.created_at)}</td>
                    <td className="py-2 px-4">{formatFileSize(file.file_size)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-2 px-4 text-gray-500">No files found.</div>
          )}
        </div>
      )}
    </div>
  );
}
