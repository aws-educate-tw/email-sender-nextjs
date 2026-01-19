"use client";
import EmailDetailsDropdown from "@/app/ui/email-details-dropdown";
import EmailDetailsTable from "@/app/ui/email-details-table";
import EmailDetailsTableSkeleton from "@/app/ui/skeleton/email-details-table-skeleton";
import EmailTotalSummary from "@/app/ui/email-total-summary";
import ExportConfirmationModal from "@/app/ui/export-confirmation-modal";
import { ChevronDown, ChevronUp, Search, Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";

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
  attachment_file_ids: string[];
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

interface FileType {
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
  failed_email_count: number;
  reply_to: string;
  template_file: FileType;
  created_year_month_day: string;
  created_year: string;
}

interface EmailsResponse {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}

export default function Page({ params }: PageProps) {
  const [allEmails, setAllEmails] = useState<EmailSummaryDataType[]>([]);
  const [emailDetailedData, setDetailedData] = useState<EmailDetailedDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedEmailNum, setSelectedEmailNum] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<any[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [runSummary, setRunSummary] = useState({
    totalEmailNum: 0,
    successEmailNum: 0,
    failedEmailNum: 0,
  });

  // 更新選中的 email 數量
  useEffect(() => {
    const selectedCount = Object.keys(selectedRows).length;
    setSelectedEmailNum(selectedCount);
  }, [selectedRows]);

  const fetchEmails = useCallback(
    async (
      runId: string,
      limit: string | number,
      page: number,
      status: string | null = null,
      access_token: string
    ): Promise<EmailsResponse> => {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/runs/${runId}/emails`);

      url.searchParams.append("page", page.toString());

      if (limit) {
        url.searchParams.append("limit", limit.toString());
      }

      if (status) {
        url.searchParams.append("status", status);
      }

      let retries = 0;
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second delay between retries

      while (retries < maxRetries) {
        try {
          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Request failed: ${response.status} - ${response.statusText}`);
          }

          return await response.json();
        } catch (error) {
          retries++;
          console.error(`Attempt ${retries}/${maxRetries} failed:`, error);

          if (retries >= maxRetries) {
            console.error("All retry attempts failed");
            throw error;
          }

          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
      throw new Error("Failed to fetch emails after maximum retry attempts");
    },
    []
  );

  async function fetchRunDetails(runId: string, access_token: string) {
    const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const url = new URL(`${base_url}/runs/${runId}`);

    return fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error("Failed to fetch run details:", error);
        throw error;
      });
  }

  // 獲取所有 emails 資料 - 根據狀態從後端獲取
  const fetchAllEmails = useCallback(
    async (status: string | null = null) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        // 每次都從後端獲取對應狀態的資料
        const result = await fetchEmails(params.runId, "ALL", 0, status, token);
        setAllEmails(result.data);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        console.error("Failed to fetch emails:", error.message);
      }
    },
    [params.runId, fetchEmails]
  );

  // 合併 fetchRunDetails 的呼叫，同時獲取詳細資料和統計
  const fetchRunDetailsAndSummary = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const result = await fetchRunDetails(params.runId, token);

      // 設定詳細資料
      setDetailedData(result);

      // 設定統計資料
      setRunSummary({
        successEmailNum: result.success_email_count || 0,
        failedEmailNum: result.failed_email_count || 0,
        totalEmailNum: (result.success_email_count || 0) + (result.failed_email_count || 0),
      });
    } catch (error: any) {
      console.error("Failed to fetch run details:", error.message);
    }
  }, [params.runId]);

  const handleRowSelectionChange = useCallback((newSelectedRows: Record<string, boolean>) => {
    setSelectedRows(newSelectedRows);
    const selectedCount = Object.values(newSelectedRows).filter(Boolean).length;
    setSelectedEmailNum(selectedCount);
  }, []);

  // 當狀態改變時重新從後端獲取對應狀態的資料
  useEffect(() => {
    fetchAllEmails(selectedStatus);
    // 清除之前的選擇狀態，因為資料已經改變
    setSelectedRows({});
  }, [fetchAllEmails, selectedStatus]);

  // 初始化時獲取詳細資料和統計
  useEffect(() => {
    fetchRunDetailsAndSummary();
  }, [fetchRunDetailsAndSummary]);

  const handleSelectedEmailsChange = useCallback((count: number) => {
    setSelectedEmailNum(count);
  }, []);

  const handleExportClick = useCallback(() => {
    if (selectedEmailNum === 0) {
      alert("Please select at least one row to export");
      return;
    }
    setIsExportModalOpen(true);
  }, [selectedEmailNum]);

  const handleExportConfirm = useCallback(() => {
    // Get selected email data
    const selectedEmailIds = Object.keys(selectedRows).filter(id => selectedRows[id]);
    const selectedEmailData = allEmails.filter(email => selectedEmailIds.includes(email.email_id));

    // Prepare data for export - only export columns shown in the table
    const exportData = selectedEmailData.map(email => ({
      Email: email.recipient_email,
      BCC: email.bcc && email.bcc.length > 0 ? email.bcc.join(", ") : "-",
      CC: email.cc && email.cc.length > 0 ? email.cc.join(", ") : "-",
      Status: email.status,
      "Sent At": email.sent_at ? new Date(email.sent_at).toLocaleString() : "-",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Email History");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
    const filename = `email-history-${params.runId}-${timestamp}.xlsx`;

    // Download file
    XLSX.writeFile(workbook, filename);

    // Close modal
    setIsExportModalOpen(false);
  }, [selectedRows, allEmails, params.runId]);

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

      <div className="flex flex-col border rounded-md shadow-md bg-white w-full mx-auto mb-6">
        <div className="flex justify-between items-center py-4 px-4 gap-4">
          {/* Selected recipients */}
          <div className="flex-grow">
            <EmailTotalSummary
              selectedEmailNum={selectedEmailNum}
              runSummary={{
                totalEmailNum: runSummary.totalEmailNum,
                successEmailNum: runSummary.successEmailNum,
                failedEmailNum: runSummary.failedEmailNum,
              }}
            />
          </div>
          {/* Search input */}
          <div
            className={`flex items-center rounded-md border border-gray-300 shadow shadow-sm w-full max-w-60 h-10
              ${isLoading ? "bg-gray-100" : ""}`}
          >
            <div className="flex items-center pl-3">
              <Search className={`h-4 w-4 ${isLoading ? "text-gray-300" : "text-gray-400"}`} />
            </div>
            <input
              className={`rounded-md border-transparent shadow-sm w-full h-full
                focus:border-transparent focus:ring-transparent
                disabled:cursor-wait disabled:bg-gray-100 disabled:placeholder-gray-300`}
              placeholder="Search recipients..."
              type="text"
              value={globalFilter ?? ""}
              disabled={isLoading}
              onChange={e => setGlobalFilter(e.target.value)}
            />
          </div>
          {/* Export button */}
          <button
            onClick={handleExportClick}
            disabled={selectedEmailNum === 0 || isLoading}
            title={selectedEmailNum === 0 ? "Please select at least one item to export." : ""}
            className={`flex items-center gap-2 px-4 h-10 text-sm font-medium rounded-md ${
              selectedEmailNum === 0 || isLoading
                ? "text-gray-400 bg-gray-100 border border-gray-300"
                : "text-white bg-sky-950 hover:bg-sky-800 border border-transparent"
            }`}
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="">
          {isLoading ? (
            <EmailDetailsTableSkeleton />
          ) : (
            <EmailDetailsTable
              data={allEmails}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedRows={selectedRows}
              onSelectedRowsChange={handleSelectedEmailsChange}
              onRowSelectionChange={handleRowSelectionChange}
              selectedEmailNum={selectedEmailNum}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          )}
        </div>
      </div>

      {/* Export Confirmation Modal */}
      <ExportConfirmationModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExportConfirm}
        selectedCount={selectedEmailNum}
      />
    </>
  );
}
