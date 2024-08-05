import { CalendarDays, User, FileText, Clock, Send, Sheet } from "lucide-react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import Link from "next/link";

interface attachmentFilesType {
  file_url: string;
  uploaded_id: string;
  updated_at: string;
  file_name: string;
  file_id: string;
  s3_object_key: string;
  created_at: string;
  file_extension: string;
  file_size: number;
}

interface spreadsheetFileType {
  file_url: string;
  uploaded_id: string;
  updated_at: string;
  file_name: string;
  file_id: string;
  s3_object_key: string;
  created_at: string;
  file_extension: string;
  file_size: number;
}

interface templateFileType {
  file_url: string;
  uploaded_id: string;
  updated_at: string;
  file_name: string;
  file_id: string;
  s3_object_key: string;
  created_at: string;
  file_extension: string;
  file_size: number;
}

interface senderType {
  user_id: string;
  email: string;
  username: string;
}

interface dataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  attachment_files: attachmentFilesType[];
  created_at: string;
  sender_local_part: string;
  spreadsheet_id: string;
  created_year_month: string;
  attachment_file_ids: string[];
  is_generated_certficate: boolean;
  spreadsheet_file: spreadsheetFileType;
  display_name: string;
  sender_id: string;
  sender: senderType;
  template_file_id: string;
  success_email_count: number;
  expected_email_send_count: number;
  reply_to: string;
  template_file: templateFileType;
  created_year_month_day: string;
  created_year: string;
}

interface props {
  data: dataType[] | null;
}

export default function EmailHistoryCard({ data }: props) {
  return (
    <>
      {data?.map((item) => (
        <Link
          key={item.run_id}
          href={`/emailHistory/${item.run_id}`}
          className="w-full hover:shadow-xl transition bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="">
            <div className="p-8">
              <div className="flex flex-col">
                <div className="uppercase tracking-wide text-lg text-black font-semibold mb-1">
                  {item.subject}
                </div>
                <hr />
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex-1 flex py-2 gap-2 items-center">
                    <div className="bg-sky-900 rounded-full p-1 border-2 border-sky-900">
                      <User className="" size={32} color="white" />
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-md font-medium text-black">
                        {item.display_name}
                      </p>
                      <p className="text-sm font-medium text-neutral-500">
                        {item.sender_local_part}@aws-educate.tw
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex py-2 gap-2 items-center">
                    <div className="bg-sky-800 rounded-full p-1 border-2 border-sky-800">
                      <Sheet size={32} color="white" />
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-md font-medium text-black">
                        Spreadsheet file
                      </p>
                      <p className="text-sm font-medium text-neutral-500">
                        {item.spreadsheet_file.file_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex py-2 gap-2 items-center">
                    <div className="bg-sky-700 rounded-full p-1 border-2 border-sky-700">
                      <FileText size={32} color="white" />
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-md font-medium text-black">
                        template file
                      </p>
                      <p className="text-sm font-medium text-neutral-500">
                        {item.template_file.file_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end pt-2 pl-3 gap-2 lg:flex-row  lg:pt-8  lg:gap-8">
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
                  <strong>{item.sender.username}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <p>Status</p>
                  </div>
                  <strong className="text-red-500">
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
