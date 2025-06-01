"use client";
import EmailDetailsDropdown from "@/app/ui/email-details-dropdown";
import EmailDetailsTable from "@/app/ui/email-details-table";
import EmailDetailsTableSkeleton from "@/app/ui/skeleton/email-details-table-skeleton";
import EmailTotalSummary from "@/app/ui/email-total-summary";
import { fetchEmails, fetchRunDetails, storeAllEmails } from "@/lib/actions";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [, setTotalItems] = useState(0);
  const [, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [emailAllData, setAllData] = useState<EmailSummaryDataType[]>([]);
  const [filteredData, setFilteredData] = useState<EmailSummaryDataType[]>([]);
  const [sliceFilteredData, setSliceFilteredData] = useState<EmailSummaryDataType[]>([]);
  const [sliceIndex, setSliceIndex] = useState([0, 10]);
  const [, setIsCalculatingRunSummary] = useState(false);
  const [selectedEmailNum, setSelectedEmailNum] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const [runSummary, setRunSummary] = useState(() => {
    return {
      totalEmailNum: 0,
      successEmailNum: 0,
      failedEmailNum: 0,
    };
  });

  const handleRowSelectionChange = useCallback((newSelectedRows: Record<string, boolean>) => {
    setSelectedRows(newSelectedRows);
    const selectedCount = Object.values(newSelectedRows).filter(Boolean).length;
    setSelectedEmailNum(selectedCount);
  }, []);

  const fetchDetailedFiles = useCallback(async (limit: number) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/runs`);

      url.searchParams.append("limit", limit.toString());

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
    async (limit: number, status: string | null, page: number) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const result = await fetchEmails(params.runId, limit, page, status, token);

        setIsLoading(false);
        setData(result.data);
        setPage(result.pagination.page);
        setLimit(result.pagination.limit);
        setTotalItems(result.pagination.total_items);
        setTotalPages(result.pagination.total_pages);
        setHasNextPage(result.pagination.has_next_page);
        setHasPreviousPage(result.pagination.has_previous_page);
      } catch (error: any) {
        alert("Failed to fetch files: " + error.message);
      }
    },
    [params.runId]
  );

  const fetchRunSummary = useCallback(async () => {
    setIsCalculatingRunSummary(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const result = await fetchRunDetails(params.runId, token);

      setRunSummary({
        successEmailNum: result.success_email_count || 0,
        failedEmailNum: result.failed_email_count || 0,
        totalEmailNum: result.success_email_count + result.failed_email_count || 0,
      });
    } catch (error: any) {
      console.error("Failed to fetch run summary: " + error.message);
    }
  }, [params.runId]);

  // Click Next button
  const handleNext = () => {
    if (searchTerm) {
      setSliceIndex([sliceIndex[0] + 10, sliceIndex[1] + 10]);
    } else if (hasNextPage) {
      fetchFiles(limit, selectedStatus, page + 1);
    }
  };

  // Click Previous button
  const handlePrevious = () => {
    if (searchTerm) {
      setSliceIndex([Math.max(sliceIndex[0] - 10, 0), Math.max(sliceIndex[1] - 10, 10)]);
    } else if (hasPreviousPage) {
      fetchFiles(limit, selectedStatus, page - 1);
    }
  };

  const isNextDisabled = () => {
    return searchTerm ? sliceIndex[1] >= filteredData.length : !hasNextPage;
  };

  const isPreviousDisabled = () => {
    return searchTerm ? sliceIndex[0] <= 0 : !hasPreviousPage;
  };

  // Fetch the files when the component mounts or when selectedStatus changes
  useEffect(() => {
    setIsLoading(true);
    fetchFiles(10, selectedStatus, page);
  }, [fetchFiles, selectedStatus, page]);

  useEffect(() => {
    setIsDisabled(true); // Prevent user from typing until all data is loaded
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const allData = await storeAllEmails(params.runId, selectedStatus, token);
        setAllData(allData);
        setIsDisabled(false);
      } catch (error) {
        console.error("Error fetching all emails:", error);
        setIsDisabled(false);
      }
    };

    fetchData();
    setSearchTerm("");
  }, [selectedStatus, params.runId]);

  // filter data with searchTerm
  useEffect(() => {
    if (emailAllData) {
      setFilteredData(
        emailAllData.filter(
          data =>
            data.recipient_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            data.bcc.some(bcc => bcc.toLowerCase().includes(searchTerm.toLowerCase())) ||
            data.cc.some(cc => cc.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
      setSliceIndex([0, 10]);
    }
  }, [emailAllData, searchTerm]);

  // filteredData pagination
  useEffect(() => {
    setSliceFilteredData(filteredData.slice(sliceIndex[0], sliceIndex[1]));
  }, [filteredData, sliceIndex]);

  // Fetch the detailed data when component mounts
  useEffect(() => {
    fetchDetailedFiles(1);
  }, [fetchDetailedFiles]);

  // Fetch the run summary when component mounts
  useEffect(() => {
    fetchRunSummary();
  }, [fetchRunSummary]);

  const handleSelectedEmailsChange = useCallback((count: number) => {
    setSelectedEmailNum(count);
  }, []);

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
        <div className="flex justify-between py-6 px-4">
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
            className={`flex rounded-md border border-gray-300 shadow shadow-sm w-full max-w-52
              ${isDisabled ? "bg-gray-100" : ""}`}
          >
            <div className="flex items-center pl-3">
              <Search className={`h-4 w-4 ${isDisabled ? "text-gray-300" : "text-gray-400"}`} />
            </div>
            <input
              className={`rounded-md border-transparent shadow-sm w-full
                focus:border-transparent focus:ring-transparent
                disabled:cursor-wait disabled:bg-gray-100 disabled:placeholder-gray-300`}
              placeholder="Search recipients..."
              type="text"
              value={searchTerm}
              disabled={isDisabled}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="">
          {isLoading ? (
            <EmailDetailsTableSkeleton />
          ) : (
            <EmailDetailsTable
              data={searchTerm ? sliceFilteredData : emailSummaryData}
              selectedStatus={selectedStatus}
              onStatusChange={status => setSelectedStatus(status)}
              onSelectedRowsChange={handleSelectedEmailsChange}
              allEmailIds={emailAllData.map(email => email.email_id)}
              isDisabled={isDisabled}
              selectedRows={selectedRows}
              onRowSelectionChange={handleRowSelectionChange}
            />
          )}
          <div className="flex justify-end gap-8 pt-3 pb-4 px-2">
            <button
              className={`flex items-center gap-1 ${
                isPreviousDisabled()
                  ? "cursor-default text-gray-400"
                  : "hover:text-gray-600 hover:underline"
              }`}
              onClick={handlePrevious}
              disabled={isPreviousDisabled()}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              className={`flex items-center gap-1 ${
                isNextDisabled()
                  ? "cursor-default text-gray-400"
                  : "hover:text-gray-600 hover:underline"
              }`}
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
