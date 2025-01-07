"use client";
import { useEffect, useState } from "react";
import WebhookDetailsLoading from "@/app/ui/skeleton/webhook-records-skeleton";
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
        const {
          webhook_id,
          webhook_url,
          subject,
          display_name,
          template_file_id,
          is_generate_certificate,
          reply_to,
          sender_local_part,
          attachment_file_ids,
          bcc,
          cc,
          surveycake_link,
          hash_key,
          iv_key,
          webhook_name
        } = result;

        setData({
          webhook_id,
          webhook_url,
          subject,
          display_name,
          template_file_id,
          is_generate_certificate,
          reply_to,
          sender_local_part,
          attachment_file_ids,
          bcc,
          cc,
          surveycake_link,
          hash_key,
          iv_key,
          webhook_name
        });
      } else {
        setError(result.message || "Failed to fetch webhook details");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <WebhookDetailsLoading />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          No webhook details found
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string, setCopied: (state: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 秒後恢復按鈕狀態
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Webhook Details</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Details of your <strong>webhook</strong> are displayed here.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-sky-950">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Webhook className="text-sky-950" />
              <span className="font-medium">Webhook Name:</span>
              <span>{data.webhook_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="text-sky-950" />
              <span className="font-medium">Display Name:</span>
              <span>{data.display_name}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Link2 className="text-sky-950" />
              <span className="font-medium">Webhook URL:</span>
              <span className="break-all">{data.webhook_url}</span>
              <button
              onClick={() => copyToClipboard(data.webhook_url, setIsCopied)}
              className={`p-1 rounded transition-colors ${
                isCopied ? "bg-green-200" : "hover:bg-gray-200"
              }`}
              >
              {isCopied ? (
              <span className="flex items-center gap-1 text-green-700">
                <HiClipboard className="h-5 w-5" />
                Copied
              </span>
              ) : (
              <span className="flex items-center gap-1 text-gray-700">
                <HiClipboard className="h-5 w-5" />
                Copy
              </span>
              )}
            </button>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-sky-950">Email Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2">
                <span className="font-medium">Subject:</span> {data.subject}
              </p>
              <p className="mb-2">
                <span className="font-medium">Reply To:</span> {data.reply_to}
              </p>
              <p>
                <span className="font-medium">Sender:</span>{" "}
                {data.sender_local_part}@aws-educate.tw
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-medium">CC:</span>{" "}
                {data.cc.length > 0 ? data.cc.join(", ") : "None"}
              </p>
              <p className="mb-2">
                <span className="font-medium">BCC:</span>{" "}
                {data.bcc.length > 0 ? data.bcc.join(", ") : "None"}
              </p>
              <p>
                <span className="font-medium">Generate Certificate:</span>{" "}
                {data.is_generate_certificate ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-sky-950">Additional Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-2">
                <span className="font-medium">Template File ID:</span>{" "}
                {data.template_file_id}
              </p>
              <p>
                <span className="font-medium">Surveycake Link:</span>{" "}
                {data.surveycake_link || "None"}
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-medium">Attachments:</span>{" "}
                {data.attachment_file_ids.length} file(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}