"use client";
import { useState } from "react";
import { json } from "stream/consumers";

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
  user_name: string;
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
  expected_email_count: number;
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
  const [runs, setRuns] = useState<responseType[] | null>(null);

  const fetchFiles = async (
    file_extension: string,
    limit: number,
    lastEvaluatedKey: string | null
  ) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/runs`);
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
      // console.log(result);
      setRuns(result);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    } finally {
      // setLoading
    }
  };
  const handleALlFiles = async () => {
    fetchFiles("all", 10, null);
  };

  return (
    <div>
      <button className="bg-blue-300" onClick={handleALlFiles}>
        button
      </button>
      <div>{runs ? JSON.stringify(runs) : "No data"}</div>
    </div>
  );
}
