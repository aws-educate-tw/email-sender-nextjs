"use client";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    runId: string;
  };
}

interface rowDataType {
  [key: string]: string;
}

interface dataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  created_at: string;
  recipient_email: string;
  sender_local_part: string;
  status: string;
  spreadsheet_file_id: string;
  row_data: rowDataType;
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

export default function Page({ params }: PageProps) {
  const [data, setData] = useState<dataType[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    fetchFiles(10, null, null);
  }, []);

  const fetchFiles = async (
    limit: number,
    status: string | null,
    lastEvaluatedKey: string | null
  ) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/runs/${params.runId}/emails`);
      url.searchParams.append("limit", limit.toString());
      if (status) {
        url.searchParams.append("status", status);
      }
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
      setIsLoading(false);
      setData(result.data);
      console.log(result.data);
      setPreviousLastEvaluatedKey(result.previous_last_evaluated_key);
      setCurrentLastEvaluatedKey(result.current_last_evaluated_key);
      setNextLastEvaluatedKey(result.next_last_evaluated_key);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    } finally {
      // setLoading
    }
  };

  return (
    <div>
      {data?.map((item, index) => (
        <div key={index}>
          <p>{item.bcc}</p>
          <p>----</p>
          <p>{item.subject}</p>
          <p>----</p>
          <p>{item.cc}</p>
        </div>
      ))}
    </div>
  );
}
