"use client";
import { useState, useEffect, useRef } from "react";
import { convertToTaipeiTime, formatFileSize } from "@/lib/utils/dataUtils";
import { ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";

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
  value: {
    file_name: string;
    file_id: string;
    file_url: string;
  }[];
  onChange: (selectedFiles: { file_name: string; file_id: string; file_url: string }[]) => void;
}

export default function AttachDropdown({ value, onChange }: AttachDropdownProps) {
  const [options, setOptions] = useState<FileDataType[] | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<FileDataType[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileDataType[]>([]);
  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<string | null>(null);
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<string | null>(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!options || value.length === 0) return;

    const matched = value
      .map(v => options.find(o => o.file_id === v.file_id))
      .filter((f): f is FileDataType => f !== undefined);

    setSelectedFiles(matched);
  }, [options, value]);

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
    if (!isOpen && !options) {
      fetchFiles(5, null); // ✅ 僅首次展開下拉時抓
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (file: FileDataType | null) => {
    if (!file) {
      setSelectedFiles([]);
      onChange([]);
      setIsOpen(false);
      return;
    }

    const alreadySelected = selectedFiles.some(f => f.file_id === file.file_id);
    const updated = alreadySelected
      ? selectedFiles.filter(f => f.file_id !== file.file_id)
      : [...selectedFiles, file];

    setSelectedFiles(updated);
    onChange(updated.map(({ file_name, file_id, file_url }) => ({ file_name, file_id, file_url })));
  };

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        className="text-start inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={toggleDropdown}
      >
        {value.length > 0 ? value.map(file => file.file_name).join(", ") : "Attach your files"}
        <ChevronDown className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="z-50 p-3 origin-top-right absolute w-full mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="flex justify-between items-center mb-2 pl-4">
            <p className="font-medium">Attachments Selection</p>
            <input
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Search a file name..."
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <p>Loading...</p>
            </div>
          ) : filteredOptions && filteredOptions.length > 0 ? (
            <div>
              <table className="w-full bg-white shadow-md rounded-md">
                <thead>
                  <tr className="bg-neutral-100 rounded-t-md">
                    <th className="py-2 px-4 border-b border-gray-200 rounded-tl-md">File Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Created At</th>
                    <th className="py-2 px-4 border-b border-gray-200 rounded-tr-md">File Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="hover:bg-gray-200 cursor-pointer active:bg-gray-300"
                    onClick={() => handleSelect(null)}
                  >
                    <td
                      className="py-2 px-4 border-b border-gray-200 text-start text-gray-400 italic"
                      colSpan={3}
                    >
                      Clear Selection
                    </td>
                  </tr>
                  {filteredOptions.map(option => (
                    <tr
                      key={option.file_id}
                      className={`hover:bg-gray-200 cursor-pointer active:bg-gray-300 ${
                        selectedFiles.some(file => file.file_id === option.file_id)
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                        {option.file_name}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {convertToTaipeiTime(option.created_at)}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        {formatFileSize(option.file_size)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end gap-8 pt-3 pb-1 px-2">
                <button
                  className={`flex items-center gap-1 ${
                    !currentLastEvaluatedKey
                      ? "cursor-default text-gray-400"
                      : "hover:text-gray-600 hover:underline"
                  }`}
                  onClick={() => {
                    fetchFiles(5, previousLastEvaluatedKey);
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
                      fetchFiles(5, nextLastEvaluatedKey);
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
                    <th className="py-2 px-4 border-b border-gray-200">Created At</th>
                    <th className="py-2 px-4 border-b border-gray-200 rounded-tr-md">File Size</th>
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
