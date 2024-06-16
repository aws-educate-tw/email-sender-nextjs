import { useState, useEffect, useRef } from "react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { formatFileSize } from "@/lib/utils/dataUtils";

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

interface SelectDropdownProps {
  onSelect: (file_id: string) => void;
}

export default function SelectDropdown({ onSelect }: SelectDropdownProps) {
  const [templateOptions, setTemplateOptions] = useState<fileDataType[] | null>(
    null
  );
  const [filteredOptions, setFilteredOptions] = useState<fileDataType[] | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] =
    useState("Select a HTML file");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (templateOptions) {
      setFilteredOptions(
        templateOptions.filter((option) =>
          option.file_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, templateOptions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const fetchFiles = async (file_extension: string, limit: number) => {
    try {
      const base_url =
        "https://8um2zizr80.execute-api.ap-northeast-1.amazonaws.com/dev";
      const url = new URL(`${base_url}/files`);
      url.searchParams.append("file_extension", file_extension);
      url.searchParams.append("limit", limit.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        const errorMessage = `Request failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setTemplateOptions(result.data);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchFiles("html", 5);
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (file_id: string, file_name: string) => {
    onSelect(file_id);
    setSelectedFileName(file_name);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="options-menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
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
          className="p-3 origin-top-right absolute w-full mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="flex justify-between items-center mb-2 pl-4">
            <p className="font-medium">SELECT A FILE</p>
            <input
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Search a file name..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredOptions && filteredOptions.length > 0 ? (
            <div>
              <table className="w-full bg-white">
                <thead>
                  <tr className="bg-neutral-100 rounded-t-md">
                    <th className="py-2 px-4 border-b border-gray-200 rounded-tl-md">
                      File Name
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200">
                      Created At
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 rounded-tr-md">
                      File Size
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOptions.map((option) => (
                    <tr
                      key={option.file_id}
                      className="hover:bg-gray-200 cursor-pointer"
                      onClick={() =>
                        handleSelect(option.file_id, option.file_name)
                      }
                    >
                      <td className="py-2 px-4 border-b border-gray-200">
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
            </div>
          ) : (
            <p className="text-sm text-gray-500">No files found.</p>
          )}
        </div>
      )}
    </div>
  );
}
