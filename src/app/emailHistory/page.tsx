"use client";
import { useEffect, useState } from "react";
import EmailHistoryCardLoading from "@/app/ui/skeleton/email-history-card-skeleton";
import { ChevronRight, ChevronLeft } from "lucide-react";
import EmailHistoryCard from "../ui/email-history-card";
import RotatingLoaderAnimation from "../ui/rotating-loader-animation";

interface AttachmentFilesType {
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

interface SpreadsheetFileType {
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

interface TemplateFileType {
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

interface SenderType {
  user_id: string;
  email: string;
  username: string;
}

interface DataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  attachment_files: AttachmentFilesType[];
  recipient_source: "DIRECT" | "SPREADSHEET";
  created_at: string;
  sender_local_part: string;
  spreadsheet_file_id: string | null;
  created_year_month: string;
  recipients: Array<{ email: string; template_variables: Record<string, any> }>;
  attachment_file_ids: string[];
  is_generate_certificate: boolean;
  spreadsheet_file: SpreadsheetFileType | null;
  display_name: string;
  sender_id: string | null;
  sender: SenderType;
  template_file_id: string;
  success_email_count: number;
  expected_email_send_count: number;
  reply_to: string;
  template_file: TemplateFileType;
  created_year_month_day: string;
  created_year: string;
}

export default function Page() {
  const [data, setData] = useState<DataType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<string | null>(null);
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<string | null>(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles(10, null);
  }, []);

  const fetchFiles = async (limit: number, lastEvaluatedKey: string | null) => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 15000; // 15 seconds in milliseconds

    const attemptFetch = async (): Promise<any> => {
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

        return await response.json();
      } catch (error: any) {
        if (retryCount < maxRetries) {
          retryCount++;

          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return attemptFetch();
        } else {
          throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
        }
      }
    };

    try {
      setIsLoading(true);
      const result = await attemptFetch();
      setIsLoading(false);
      setData(result.data);
      setPreviousLastEvaluatedKey(result.previous_last_evaluated_key);
      setCurrentLastEvaluatedKey(result.current_last_evaluated_key);
      setNextLastEvaluatedKey(result.next_last_evaluated_key);
    } catch (error: any) {
      setIsLoading(false);
      alert(
        `Failed to load data: ${error.message}\n\nPlease try again or contact TPET Team member if the problem persists.`
      );
    }
  };

  return (
    <div>
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
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-4">
              <RotatingLoaderAnimation
                size={32}
                color="#4b5563"
                text="Loading email history..."
                className="my-4"
              />
            </div>
          )}

          {isLoading ? <EmailHistoryCardLoading /> : <EmailHistoryCard data={data} />}

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
