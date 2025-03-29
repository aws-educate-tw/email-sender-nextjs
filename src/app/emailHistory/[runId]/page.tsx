"use client";
<<<<<<< HEAD
import EmailDetailsTable from "@/app/ui/email-details-table";
import EmailDetailsTableSkeleton from "@/app/ui/skeleton/email-details-table-skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
=======
import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import EmailDetailsDropdown from "@/app/ui/email-details-dropdown";
import { DataType } from "../page";
>>>>>>> 8cb01cc (feat: drop-down Email Sanding Details | SCRUM-271)

export interface PageProps {
  params: {
    runId: string;
  };
}

export default function Page({ params }: PageProps) {
  const [data, setData] = useState<DataType[]>([]);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previousLastEvaluatedKey, setPreviousLastEvaluatedKey] = useState<string | null>(null);
  const [currentLastEvaluatedKey, setCurrentLastEvaluatedKey] = useState<string | null>(null);
  const [nextLastEvaluatedKey, setNextLastEvaluatedKey] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
=======
  const [isOpen, setIsOpen] = useState(false);
>>>>>>> 8cb01cc (feat: drop-down Email Sanding Details | SCRUM-271)

  const fetchFiles = useCallback(
    async (limit: number, status: string | null, lastEvaluatedKey: string | null) => {
      try {
        const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const url = new URL(`${base_url}/runs`);
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
        setData(result.data);
      } catch (error: any) {
        alert("Failed to fetch files: " + error.message);
      }
    },
    [params.runId]
  );

  useEffect(() => {
// <<<<<<< HEAD
    setIsLoading(true);
    fetchFiles(10, selectedStatus, null);
  }, [fetchFiles, selectedStatus]);
// =======
  //   fetchFiles(1, null, null);
  // }, [fetchFiles]);
// >>>>>>> 8cb01cc (feat: drop-down Email Sanding Details | SCRUM-271)

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
{/* <<<<<<< HEAD */}
      <div className="">
        {isLoading ? (
          <EmailDetailsTableSkeleton />
        ) : (
          <EmailDetailsTable
            data={data}
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
{/* ======= */}
      {/* <div className="border rounded-md shadow-md bg-white p-4 w-full mx-auto mb-6">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="border rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        >
          <span className="font-medium text-gray-900">Email Information</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />} */}
{/* >>>>>>> 8cb01cc (feat: drop-down Email Sanding Details | SCRUM-271) */}
        </div>
        {isOpen && (
          <div className="mt-4 space-y-2">
            {data ? <EmailDetailsDropdown data={data[0]} /> : <p> </p>}
          </div>
        )}
      </div>
    </>
  );
}
