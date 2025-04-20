"use client";
import EmailDetailsTable from "@/app/ui/email-details-table";
import EmailDetailsTableSkeleton from "@/app/ui/skeleton/email-details-table-skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import EmailDetailsDropdown from "@/app/ui/email-details-dropdown";

interface PageProps {
  params: {
    runId: string;
  };
}

interface RowDataType {
  [key: string]: string;
}

interface EmailSummaryDataType {
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

interface EmailDetailedDataType {
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

export default function Page({ params }: PageProps) {
  const [emailSummaryData, setData] = useState<EmailSummaryDataType[]>([]);
  const [emailDetailedData, setDetailedData] = useState<EmailDetailedDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<string | null>(null);
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<string | null>(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchDetailedFiles = useCallback(async (limit: number, lastEvaluatedKey: string | null) => {
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
      setDetailedData(result.data[0] || null);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    }
  }, []); // make dependencies empty to avoid infinite loop

  const fetchFiles = useCallback(
    async (limit: number, status: string | null, lastEvaluatedKey: string | null) => {
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
        setPreviousLastEvaluatedKey(result.previous_last_evaluated_key);
        setCurrentLastEvaluatedKey(result.current_last_evaluated_key);
        setNextLastEvaluatedKey(result.next_last_evaluated_key);
      } catch (error: any) {
        alert("Failed to fetch files: " + error.message);
      }
    },
    [params.runId]
  );

  // Fetch the detailed data when component mounts
  useEffect(() => {
    fetchDetailedFiles(1, null);
  }, [fetchDetailedFiles]);

  // Fetch the files when the component mounts or when selectedStatus changes
  useEffect(() => {
    setIsLoading(true);
    fetchFiles(10, selectedStatus, null);
  }, [fetchFiles, selectedStatus]);

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Email Sending Details</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Details of <strong>one of the runs</strong> is shown here.
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <div className="border rounded-md shadow-md bg-white p-4 w-full mx-auto mb-6">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="border rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Email Information</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        {isOpen && (
          <div className="mt-4 space-y-2">
            {emailDetailedData ? <EmailDetailsDropdown data={emailDetailedData} /> : <p> </p>}
          </div>
        )}
      </div>

      <div className="">
        {isLoading ? (
          <EmailDetailsTableSkeleton />
        ) : (
          <EmailDetailsTable
            data={emailSummaryData}
            selectedStatus={selectedStatus}
            onStatusChange={status => setSelectedStatus(status)}
          />
        )}
        <div className="flex justify-end gap-8 pt-3 pb-1 px-2">
          <button
            className={`flex items-center gap-1 ${
              !currentLastEvaluatedKey
                ? "cursor-default text-gray-400"
                : "hover:text-gray-600 hover:underline"
            }`}
            onClick={() => {
              fetchFiles(10, selectedStatus, previousLastEvaluatedKey);
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
                fetchFiles(10, selectedStatus, nextLastEvaluatedKey);
              }
            }}
            disabled={!nextLastEvaluatedKey}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
