"use client";
import { useState, useEffect, useRef } from "react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { ChevronRight, ChevronLeft, CalendarClock } from "lucide-react";

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

interface TemplateDropdownProps {
  onSelect: (file_id: string, file_url: string) => void;
}

export default function TemplateDropdown({ onSelect }: TemplateDropdownProps) {
  const fileExtension = "html";
  const [options, setOptions] = useState<FileDataType[] | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("Recent Templates");
  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<string | null>(null);
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<string | null>(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, [dropdownRef]);

  const fetchFiles = async (
    file_extension: string,
    limit: number,
    lastEvaluatedKey: string | null
  ) => {
    try {
      setIsLoading(true);
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/files`);
      url.searchParams.append("file_extension", file_extension);
      url.searchParams.append("limit", limit.toString());
      if (lastEvaluatedKey) {
        url.searchParams.append("last_evaluated_key", lastEvaluatedKey);
      }

      const token = localStorage.getItem("access_token");
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorMessage = `Request failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setOptions(result.data);
      setPreviousLastEvaluatedKey(result.previous_last_evaluated_key);
      setCurrentLastEvaluatedKey(result.current_last_evaluated_key);
      setNextLastEvaluatedKey(result.next_last_evaluated_key);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchFiles(fileExtension, 5, null);
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (
    file_id: string | null,
    file_url: string | null,
    file_name: string | null
  ) => {
    if (!file_id || !file_url || !file_name) {
      onSelect("", "");
      setSelectedFileName(`Recent Templates`);
      setIsOpen(false);
      return;
    }
    onSelect(file_id, file_url);
    setSelectedFileName(file_name);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="options-menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <CalendarClock width={20} className="mr-2" />
          {selectedFileName}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="z-50 p-3 origin-top-right absolute w-full mt-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 min-w-80 md:min-w-max right-0 border border-neutral-300"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="flex flex-col items-center rounded-md text-lg font-semibold mb-2 p-2">
            <p className="">Recently Updated Templates</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-4 w-96">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.497-1.32A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p>Loading...</p>
            </div>
          ) : options && options.length > 0 ? (
            <div className="flex flex-col gap-2">
              {options.map(option => (
                <div key={option.file_id}>
                  <div
                    className="flex gap-4 justify-between items-center py-2 px-4 bg-neutral-100 hover:bg-gray-200 cursor-pointer active:bg-gray-300 rounded-md"
                    onClick={() => handleSelect(option.file_id, option.file_url, option.file_name)}
                  >
                    {option.file_name}
                  </div>
                  <p className="flex w-full justify-end text-xs text-gray-500 p-1">
                    Created at&nbsp;
                    <strong className="underline">{convertToTaipeiTime(option.created_at)}</strong>
                  </p>
                </div>
              ))}

              <div className="flex justify-end gap-8 pt-3 pb-1 px-2">
                <button
                  className={`flex items-center gap-1 ${
                    !currentLastEvaluatedKey
                      ? "cursor-default text-gray-400"
                      : "hover:text-gray-600 hover:underline"
                  }`}
                  onClick={() => {
                    fetchFiles(fileExtension, 5, previousLastEvaluatedKey);
                  }}
                  disabled={!currentLastEvaluatedKey}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                <button
                  className={`flex items-center gap-1 ${
                    !nextLastEvaluatedKey
                      ? "cursor-default text-gray-400"
                      : "hover:text-gray-600 hover:underline"
                  }`}
                  onClick={() => {
                    if (nextLastEvaluatedKey) {
                      fetchFiles(fileExtension, 5, nextLastEvaluatedKey);
                    }
                  }}
                  disabled={!nextLastEvaluatedKey}
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <table className="w-full bg-white">
                <thead>
                  <tr className="bg-neutral-100 rounded-t-md">
                    <th className="py-2 px-4 border-b border-gray-200 rounded-tl-md">File Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-200" colSpan={3}>
                      No files found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
