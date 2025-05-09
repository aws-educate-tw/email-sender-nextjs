import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { useEffect, useRef, useState, useMemo } from "react";
import { StatusDropdown } from "./status-dropdown";
import EmailTotalSummary from "./email-total-summary";

interface RowDataType {
  [key: string]: string;
}

interface DataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  created_at: string;
  recipient_email: string;
  sender_local_part: string;
  status: string;
  spreadsheet_file_id: string;
  row_data: RowDataType;
  atatachment_file_ids: string[];
  is_generated_certficate: boolean;
  sender_username: string;
  display_name: string;
  sender_id: string;
  updated_at: string;
  sent_at: string;
  template_file_id: string;
  reply_to: string;
  email_id: string;
}

export default function EmailDetailsTable({
  data,
  selectedStatus,
  onStatusChange,
  runDetails,
}: {
  data: DataType[];
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  runId?: string;
  runDetails?: {
    totalEmailNum: number;
    successEmailNum: number;
    failedEmailNum: number;
  };
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const statusOption = ["All", "Success", "Failed"];

  // Calculate summary information
  const summaryInfo = useMemo(() => {
    const totalEmailNum = data.length;
    const successEmailNum = data.filter(item => item.status === "SUCCESS").length;
    const failedEmailNum = data.filter(item => item.status === "FAILED").length;
    const selectedEmailNum = Object.values(selectedRows).filter(Boolean).length;
    
    return {
      selectedEmailNum,
      totalEmailNum,
      successEmailNum,
      failedEmailNum
    };
  }, [data, selectedRows]);

  const handleSelectStatus = (status: string) => {
    status === "All" ? onStatusChange(null) : onStatusChange(status.toUpperCase());
  };

  // Handle individual row selection
  const handleSelectRow = (index: string) => {
    const newSelectedRows = { ...selectedRows };
    newSelectedRows[index] = !selectedRows[index];
    setSelectedRows(newSelectedRows);
  };

  // close dropdown when click another place
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".status-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="overflow-x-auto border-b border-gray-200">
        <thead></thead>
      {/* Email Summary Component */}      
      <div className="px-6 pt-6 pb-4">
        <EmailTotalSummary 
          selectedEmailNum={summaryInfo.selectedEmailNum}
          runDetails={runDetails}
        />
      </div>

      {/* Email Table */}
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 w-10"></th>
            <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              Recipient Email
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              BCC
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              CC
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              <div className="relative group status-dropdown-container z-50" ref={triggerRef}>
                <div
                  className="flex items-center gap-2 hover:cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>Status</span>
                  <span className="text-xs">{isDropdownOpen ? "▲" : "▼"}</span>
                </div>
              </div>
            </th>
            <th className="py-2 px-4 bg-gray-200 text-left text-md font-medium text-gray-700 tracking-wider">
              Sent At
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: DataType, index: number) => (
            <tr key={index} className={`${index !== 0 ? "border-t border-gray-200" : ""}`}>
              {/* Selected box */}
              <td className="py-2 px-4 text-center">
              <div className="relative">
                  <input 
                    type="checkbox" 
                    id={`checkbox-${index}`}
                    checked={selectedRows[index] || false}
                    onChange={() => handleSelectRow(index)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor={`checkbox-${index}`} 
                    className={`flex items-center justify-center w-5 h-5 rounded border cursor-pointer ${
                      selectedRows[index] 
                        ? 'bg-gray-800 border-gray-800' 
                        : 'border-gray-400 hover:border-gray-500'
                    }`}
                  >
                    {selectedRows[index] && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3 text-white" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    )}
                  </label>
                </div>
              </td>
              <td className="py-2 px-4 text-sm text-gray-700 font-bold">{item.recipient_email}</td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {item.bcc.length === 0 ? (
                  <div className="flex flex-col justify-start text-gray-300">NO BCC</div>
                ) : (
                  <div className="flex flex-col justify-start">
                    {item.bcc.map((email, idx) => (
                      <div
                        className={`py-1 ${
                          idx !== 0 ? "border-dashed border-t-2 border-gray-200" : ""
                        }`}
                        key={idx}
                      >
                        {email}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {item.cc.length === 0 ? (
                  <div className="flex flex-col justify-start text-gray-300">NO CC</div>
                ) : (
                  <div className="flex flex-col justify-start">
                    {item.cc.map((email, idx) => (
                      <div
                        className={`py-1 ${
                          idx !== 0 ? "border-dashed border-t-2 border-gray-200" : ""
                        }`}
                        key={idx}
                      >
                        {email}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-2 px-4 text-gray-700">
                {item.status === "SUCCESS" ? (
                  <div className="bg-green-500 text-white text-sm p-1 rounded-full text-center">
                    {item.status}
                  </div>
                ) : item.status === "FAILED" ? (
                  <div className="bg-red-500 text-white text-sm p-1 rounded-full text-center">
                    {item.status}
                  </div>
                ) : (
                  <div className="bg-yellow-200 text-black text-sm p-1 rounded-full text-center">
                    {item.status}
                  </div>
                )}
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {item.status === "SUCCESS" && item.sent_at ? (
                  convertToTaipeiTime(item.sent_at)
                ) : item.status === "FAILED" ? (
                  <p className="text-red-500">This email is not sent.</p>
                ) : (
                  <p className="text-yellow-400">This email is on its way.</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="p-6 text-center text-gray-400">No matching recipients found</div>
      )}

      <StatusDropdown
        isOpen={isDropdownOpen}
        anchorRef={triggerRef}
        options={statusOption}
        selectedStatus={selectedStatus}
        onSelect={handleSelectStatus}
        onClose={() => setIsDropdownOpen(false)}
      />
    </div>
    </div>
  );
}
