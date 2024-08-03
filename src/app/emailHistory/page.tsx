"use client";
import { useEffect, useState } from "react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import {
  CalendarDays,
  User,
  FileText,
  Clock,
  Send,
  Sheet,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

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

interface dateType {
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

// interface responseType {
//   data: dateType[];
//   previous_last_evaluated_key: string;
//   current_last_evaluated_key: string;
//   next_last_evaluated_key: string;
// }

export default function Page() {
  const [data, setData] = useState<dateType[] | null>(null);
  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<
    string | null
  >(null);
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<
    string | null
  >(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchFiles(10, null);
  }, []);

  const fetchFiles = async (limit: number, lastEvaluatedKey: string | null) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/runs`);

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
      // console.log(result);
      setData(result.data);
      setPreviousLastEvaluatedKey(result.previous_last_evaluated_key);
      setCurrentLastEvaluatedKey(result.current_last_evaluated_key);
      setNextLastEvaluatedKey(result.next_last_evaluated_key);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    } finally {
      // setLoading
    }
  };
  // const handleALlFiles = async () => {
  //   fetchFiles("all", 10, null);
  // };

  return (
    <div>
      {/* <button className="bg-blue-300" onClick={handleALlFiles}>
        button
      </button> */}
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Emails history</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Emails you <strong>have sent</strong> are displayed here.
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <div>
        <div className="w-full p-3 flex flex-col gap-3 bg-neutral-100 shadow-md rounded-md">
          {data?.map((item) => (
            <div className="w-full hover:shadow-xl transition bg-white rounded-xl shadow-md overflow-hidden">
              <div className="">
                <div className="p-8">
                  <div className="flex flex-col">
                    <div className="uppercase tracking-wide text-lg text-black font-semibold mb-1">
                      {item.subject}
                    </div>
                    <hr />
                    <div className="flex justify-between">
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
                  <div className="flex justify-end gap-8 pt-8">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={20} />
                        <p>Send at</p>
                      </div>
                      <strong>{convertToTaipeiTime(item.created_at)}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Send size={20} />
                        <p>Sender</p>
                      </div>
                      <strong>{item.sender.username}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Clock size={20} />
                        <p>Status</p>
                      </div>
                      <strong className="text-red-500">
                        {item.success_email_count}/
                        {item.expected_email_send_count}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-8 pb-1 px-2">
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
      </div>
    </div>
  );
}
