"use client";
import { useEffect, useState } from "react";
import WebhookRecordsSkeleton from "@/app/ui/skeleton/webhook-records-skeleton";
import { HiClipboard } from "react-icons/hi";
import { Link2, Mail, Webhook } from "lucide-react";

interface PageProps {
  params: {
    webhookId: string;
  };
}

interface WebhookDetails {
  webhook_id: string;
  webhook_url: string;
  subject: string;
  display_name: string;
  template_file_id: string;
  is_generate_certificate: boolean;
  reply_to: string;
  sender_local_part: string;
  attachment_file_ids: string[];
  bcc: string[];
  cc: string[];
  surveycake_link: string;
  hash_key: string;
  iv_key: string;
  webhook_name: string;
}

export default function Page({ params }: PageProps) {
  const [data, setData] = useState<WebhookDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchWebhookDetails(params.webhookId);
  }, [params.webhookId]);

  const fetchWebhookDetails = async (webhookId: string) => {
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/webhooks/${webhookId}`);

      const token = localStorage.getItem("access_token");
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "SUCCESS") {
        setData(result as WebhookDetails);
      } else {
        setError(result.message || "Failed to fetch webhook details");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <div className="text-4xl font-bold pt-2">Webhook Details</div>
        <div className="flex justify-between items-center w-full pb-4">
          <div className="text-gray-500 italic">
            Details of your <strong>webhook</strong> are displayed here.
          </div>
        </div>
      </div>

      {isLoading ? (
        <WebhookRecordsSkeleton />
      ) : error ? (
        <div className="p-6">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">Error: {error}</div>
        </div>
      ) : !data ? (
        <div className="p-6">
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
            No webhook details found
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-950">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 min-w-max">
                  <Webhook size={20} className="text-sky-950 shrink-0" />
                  <span className="font-medium">Webhook Name:</span>
                </div>
                <span className="break-all">{data.webhook_name}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 min-w-max">
                  <Mail size={20} className="text-sky-950 shrink-0" />
                  <span className="font-medium">Display Name:</span>
                </div>
                <span className="break-all">{data.display_name}</span>
              </div>

              <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 min-w-max">
                  <Link2 size={20} className="text-sky-950 shrink-0" />
                  <span className="font-medium">Webhook URL:</span>
                </div>
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="break-all">{data.webhook_url}</span>
                  <button
                    onClick={() => copyToClipboard(data.webhook_url)}
                    className={`p-2 rounded transition-colors shrink-0 ${
                      isCopied ? "bg-green-200" : "hover:bg-gray-200"
                    }`}
                  >
                    {isCopied ? (
                      <span className="flex items-center gap-1 text-green-700 whitespace-nowrap">
                        <HiClipboard size={20} />
                        <span className="hidden sm:inline">Copied</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                        <HiClipboard size={20} />
                        <span className="hidden sm:inline">Copy</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-950">Email Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">Subject:</span>
                  <span className="break-all">{data.subject}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">Reply To:</span>
                  <span className="break-all">{data.reply_to}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">Sender:</span>
                  <span className="break-all">{data.sender_local_part}@aws-educate.tw</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">CC:</span>
                  <span className="break-all">
                    {data.cc.length > 0 ? data.cc.join(", ") : "None"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">BCC:</span>
                  <span className="break-all">
                    {data.bcc.length > 0 ? data.bcc.join(", ") : "None"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">Generate Certificate:</span>
                  <span>{data.is_generate_certificate ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-950">Additional Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">Template File ID:</span>
                  <span className="break-all">{data.template_file_id}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">Surveycake Link:</span>
                  <span className="break-all">{data.surveycake_link || "None"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium min-w-max">Attachments:</span>
                  <span>{data.attachment_file_ids.length} file(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
