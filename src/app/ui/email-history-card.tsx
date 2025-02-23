import { CalendarDays, User, FileText, Clock, Send, Sheet, Mail } from "lucide-react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import Link from "next/link";

interface FileType {
  file_url: string;
  uploaded_id: string | null;
  updated_at: string;
  file_name: string;
  file_id: string;
  s3_object_key: string;
  created_at: string;
  file_extension: string;
  file_size: number;
}

interface SenderType {
  user_id: string;
  email: string;
  username: string;
  message?: string;
}

interface DataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  attachment_files: FileType[];
  recipient_source: "DIRECT" | "SPREADSHEET";
  created_at: string;
  sender_local_part: string;
  spreadsheet_file_id: string | null;
  created_year_month: string;
  recipients: Array<{ email: string; template_variables: Record<string, any> }>;
  attachment_file_ids: string[];
  is_generate_certificate: boolean;
  spreadsheet_file: FileType | null;
  display_name: string;
  sender_id: string | null;
  sender: SenderType;
  template_file_id: string;
  success_email_count: number;
  expected_email_send_count: number;
  reply_to: string;
  template_file: FileType;
  created_year_month_day: string;
  created_year: string;
}

interface PropsType {
  data: DataType[] | null;
}

export default function EmailHistoryCard({ data }: PropsType) {
  // Early return for empty or undefined data
  if (!data || data.length === 0) {
    return <div className="w-full p-8 text-center text-gray-500">No email history found</div>;
  }

  const renderRecipientInfo = (item: DataType) => {
    const isDirect = item.recipient_source === "DIRECT";

    return (
      <div className="flex-1 flex py-2 gap-2 items-center">
        <div
          className={`rounded-full p-1 border-2 ${
            isDirect ? "bg-purple-700 border-purple-700" : "bg-sky-800 border-sky-800"
          }`}
        >
          {isDirect ? <Mail size={32} color="white" /> : <Sheet size={32} color="white" />}
        </div>
        <div className="flex flex-col justify-start">
          <div className="flex items-center gap-2">
            <p className="text-md font-medium text-black">Recipients Source</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isDirect ? "bg-purple-100 text-purple-700" : "bg-sky-100 text-sky-800"
              }`}
            >
              {isDirect ? "Direct" : "Spreadsheet"}
            </span>
          </div>
          <p className="text-sm font-medium text-neutral-500">
            {isDirect ? (
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {`${item.recipients?.length || 0} recipients`}
              </span>
            ) : item.spreadsheet_file ? (
              <span className="flex items-center gap-1">
                <Sheet className="w-4 h-4" />
                {item.spreadsheet_file.file_name}
              </span>
            ) : (
              "No spreadsheet file"
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {data.map(item => (
        <Link
          key={item.run_id}
          href={`/emailHistory/${item.run_id}`}
          className="w-full hover:shadow-xl transition bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-8">
            <div className="flex flex-col">
              <div className="uppercase tracking-wide text-lg text-black font-semibold mb-1">
                {item.subject}
              </div>
              <hr />
              <div className="flex flex-col lg:flex-row justify-between">
                {/* Sender Info */}
                <div className="flex-1 flex py-2 gap-2 items-center">
                  <div className="bg-sky-900 rounded-full p-1 border-2 border-sky-900">
                    <User className="" size={32} color="white" />
                  </div>
                  <div className="flex flex-col justify-start">
                    <p className="text-md font-medium text-black">{item.display_name}</p>
                    <p className="text-sm font-medium text-neutral-500">
                      {item.sender_local_part}@aws-educate.tw
                    </p>
                  </div>
                </div>

                {/* Recipient Source Info */}
                {renderRecipientInfo(item)}

                {/* Template File Info */}
                <div className="flex-1 flex py-2 gap-2 items-center">
                  <div className="bg-sky-700 rounded-full p-1 border-2 border-sky-700">
                    <FileText size={32} color="white" />
                  </div>
                  <div className="flex flex-col justify-start">
                    <p className="text-md font-medium text-black">Template File</p>
                    <p className="text-sm font-medium text-neutral-500">
                      {item.template_file.file_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex flex-col justify-end pt-2 pl-3 gap-2 lg:flex-row lg:pt-8 lg:gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={20} />
                    <p>Send at</p>
                  </div>
                  <strong>{convertToTaipeiTime(item.created_at)}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Send size={20} />
                    <p>Sender</p>
                  </div>
                  <strong>{item.sender?.username || "Unknown"}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <p>Status</p>
                  </div>
                  <strong
                    className={
                      item.success_email_count < item.expected_email_send_count
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {item.success_email_count}/{item.expected_email_send_count}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
