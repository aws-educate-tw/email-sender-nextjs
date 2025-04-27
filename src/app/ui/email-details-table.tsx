import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { useEffect, useRef, useState } from "react";
import { StatusDropdown } from "./status-dropdown";

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
}: {
  data: DataType[];
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const statusOption = ["All", "Success", "Failed"];

  const handleSelectStatus = (status: string) => {
    status === "All" ? onStatusChange(null) : onStatusChange(status.toUpperCase());
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
      <table className="w-full bg-white">
        <thead>
          <tr>
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
  );
}
