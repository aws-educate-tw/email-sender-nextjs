"use client";
import { useEffect, useState } from "react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { useEditor } from "@tiptap/react";

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

interface responseType {
  data: dateType[];
  previous_last_evaluated_key: string;
  current_last_evaluated_key: string;
  next_last_evaluated_key: string;
}

export default function Page() {
  const [data, setData] = useState<dateType[] | null>(null);

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
      <div>
        <table className="w-full bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-neutral-100 rounded-t-md">
              <th className="py-2 px-4 border-b border-gray-200 rounded-tl-md">
                Subject
              </th>
              <th className="py-2 px-4 border-b border-gray-200">
                Display name
              </th>
              <th className="py-2 px-4 border-b border-gray-200 rounded-tr-md">
                Sender
              </th>
              <th className="py-2 px-4 border-b border-gray-200 rounded-tr-md">
                template_file
              </th>
              <th className="py-2 px-4 border-b border-gray-200 rounded-tr-md">
                Created at
              </th>
              <th className="py-2 px-4 border-b border-gray-200 rounded-tr-md">
                status
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {data?.map((item) => (
              <tr key={item.run_id}>
                <td>{item.subject}</td>
                <td>{item.sender.email}</td>
                <td>{item.created_at}</td>
              </tr>
            ))} */}
            {data?.map((item) => (
              <tr
                key={item.run_id}
                className="hover:bg-gray-200 cursor-pointer active:bg-gray-300"
              >
                <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                  {item.subject}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                  {item.display_name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                  {item.sender.username}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                  {item.template_file.file_name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                  {convertToTaipeiTime(item.created_at)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 max-w-96 break-words">
                  {item.success_email_count}/{item.expected_email_send_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
