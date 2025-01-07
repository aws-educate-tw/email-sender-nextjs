"use client";
import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import WebhookRecordsCardSkeleton from "@/app/ui/skeleton/webhook-records-card-skeleton";
import WebhookRecordsCard from "../ui/webhook-records-card";

interface WebhookData {
  webhook_id: string;
  webhook_name: string;
  webhook_type: "surveycake" | "slack";
  webhook_url: string;
  created_at: string;
  subject: string;
  display_name: string;
  sender_local_part: string;
  sequence_number: number;
  surveycake_link: string;
  is_generate_certificate: boolean;
  template_file_id: string;
  reply_to: string;
  cc: string[];
  bcc: string[];
  attachment_file_ids: string[];
  iv_key: string;
  hash_key: string;
}

interface ApiResponse {
  data: WebhookData[];
  page: number;
  limit: number;
  total_count: number;
  sort_order: "ASC" | "DESC";
}

export default function Page() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchWebhooks(10, currentPage);
  }, [currentPage]);

  const fetchWebhooks = async (limit: number, page: number) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/webhooks`);

      // Add required parameters
      url.searchParams.append("webhook_type", "surveycake");
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("page", page.toString());
      url.searchParams.append("sort_order", "DESC"); // Newest first

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Request failed: ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Request failed: ${response.status}`);
        }
      }

      const result = await response.json();
      setIsLoading(false);
      setApiResponse(result);
    } catch (error: any) {
      setIsLoading(false);
      console.error("Failed to fetch webhooks:", error);
      alert("Failed to fetch webhooks: " + error.message);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (apiResponse && apiResponse.data.length >= apiResponse.limit) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const canGoNext = apiResponse?.data.length === apiResponse?.limit;
  const canGoPrevious = currentPage > 1;

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Webhooks Records</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Webhooks you <strong>have created</strong> are displayed here.
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <div>
        <div className="w-full p-3 flex flex-col gap-3 bg-neutral-100 shadow-md rounded-md">
          {isLoading ? (
            <WebhookRecordsCardSkeleton />
          ) : (
            <WebhookRecordsCard data={apiResponse?.data || []} />
          )}
          <div className="flex justify-end gap-8 pb-1 px-2">
            <button
              className={`flex items-center gap-1 ${
                !canGoPrevious
                  ? "cursor-default text-gray-400"
                  : "hover:text-gray-600 hover:underline"
              }`}
              onClick={handlePreviousPage}
              disabled={!canGoPrevious}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              className={`flex items-center gap-1 ${
                !canGoNext ? "cursor-default text-gray-400" : "hover:text-gray-600 hover:underline"
              }`}
              onClick={handleNextPage}
              disabled={!canGoNext}
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
