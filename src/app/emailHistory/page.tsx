"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EmailHistoryCardLoading from "@/app/ui/skeleton/email-history-card-skeleton";
import { ChevronRight, ChevronLeft } from "lucide-react";
import EmailHistoryCard from "@/app/ui/email-history-card";
import RotatingLoaderAnimation from "@/app/ui/rotating-loader-animation";
import EventLabel from "@/app/ui/emailService/email-service-event-label";
import { getCampaignServiceBaseUrl } from "@/app/ui/campaignService/utils";

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
  campaign_id?: string | null;
  campaign_name?: string | null;
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

function EmailHistoryPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const campaignId = searchParams.get("campaign_id") || "";
  const campaignName = searchParams.get("campaign_name") || "";
  const [resolvedCampaignName, setResolvedCampaignName] = useState<string>("");

  useEffect(() => {
    if (!campaignId && campaignName) {
      router.replace("/emailHistory");
      return;
    }
    setResolvedCampaignName("");
    if (campaignId) {
      const fetchCampaignName = async () => {
        try {
          const campaignServiceBaseUrl = getCampaignServiceBaseUrl();
          const token = localStorage.getItem("access_token");
          const res = await fetch(`${campaignServiceBaseUrl}/campaigns/${campaignId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.campaign_name) {
              setResolvedCampaignName(data.campaign_name);
            }
          } else {
            if (res.status === 401 || res.status === 403) {
              throw new Error("Unauthorized: your session may have expired. Please login again.");
            }
            throw new Error("Failed to fetch campaigns");
          }
        } catch (error) {
          console.error("Failed to fetch campaign name for campaign ID:", campaignId, error);
        }
      };
      fetchCampaignName();
    }
  }, [campaignId, campaignName, router]);

  const [data, setData] = useState<DataType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);

  useEffect(() => {
    fetchFiles(10, 1, campaignId);
  }, [campaignId]);

  const fetchFiles = async (limit: number, page: number, targetCampaignId?: string) => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 15000; // 15 seconds in milliseconds

    const attemptFetch = async (): Promise<any> => {
      try {
        const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const url = new URL(`${base_url}/runs`);
        if (targetCampaignId) {
          url.searchParams.append("campaign_id", targetCampaignId);
          url.searchParams.append("run_type", "RSVP");
        }
        url.searchParams.append("limit", limit.toString());
        url.searchParams.append("page", page.toString());

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
      setCurrentPage(result.pagination.page);
      setHasNextPage(result.pagination.has_next_page);
      setHasPreviousPage(result.pagination.has_previous_page);
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
          <div className="flex flex-col items-start gap-1">
            <p className="text-gray-500 italic">
              Emails you <strong>have sent</strong> are displayed here.
            </p>
            {campaignId && (
              <EventLabel campaignId={campaignId} campaignName={resolvedCampaignName} />
            )}
          </div>
          <div className="h-10"></div>
        </div>
      </div>
      <div>
        <div className="w-full p-3 flex flex-col gap-3 bg-neutral-100 shadow-md rounded-md">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-4">
              <RotatingLoaderAnimation />
            </div>
          )}

          {isLoading ? (
            <EmailHistoryCardLoading />
          ) : (
            <EmailHistoryCard
              data={data}
              campaignFilterLabel={campaignId ? resolvedCampaignName : undefined}
            />
          )}

          <div className="flex justify-end gap-8 pb-1 px-2">
            <button
              className={`flex items-center gap-1 ${
                !hasPreviousPage
                  ? "cursor-default text-gray-400"
                  : "hover:text-gray-600 hover:underline"
              }`}
              onClick={() => {
                if (hasPreviousPage) {
                  fetchFiles(10, currentPage - 1, campaignId);
                }
              }}
              disabled={!hasPreviousPage}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              className={`flex items-center gap-1 ${
                !hasNextPage
                  ? "cursor-default text-gray-400"
                  : "hover:text-gray-600 hover:underline"
              }`}
              onClick={() => {
                if (hasNextPage) {
                  fetchFiles(10, currentPage + 1, campaignId);
                }
              }}
              disabled={!hasNextPage}
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

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-8">
          <RotatingLoaderAnimation />
        </div>
      }
    >
      <EmailHistoryPageContent />
    </Suspense>
  );
}
