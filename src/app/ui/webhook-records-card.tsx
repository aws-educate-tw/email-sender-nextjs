import { CalendarDays, Mail, Link2, Webhook } from "lucide-react";
import { convertToTaipeiTime } from "@/lib/utils/dataUtils";
import { HiClipboard } from "react-icons/hi";
import { useState } from "react";
import Link from "next/link";

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
}

interface Props {
  data: WebhookData[];
}

export default function WebhookRecordsCard({ data }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, webhookId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(webhookId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      {data?.map(item => (
        <Link
          key={item.webhook_id}
          href={`/webhookRecords/${item.webhook_id}`}
          className="w-full hover:shadow-xl transition bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="">
            <div className="p-8">
              <div className="flex flex-col">
                <div className="uppercase tracking-wide text-lg text-black font-semibold mb-1">
                  {item.webhook_name}
                </div>
                <hr />
                <div className="flex flex-col lg:flex-row justify-between">
                  {/* First Column */}
                  <div className="flex-1 flex py-2 gap-2 items-center">
                    <div className="bg-sky-900 rounded-full p-1 border-2 border-sky-900">
                      <Mail className="" size={32} color="white" />
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-md font-medium text-black">Display Name</p>
                      <p className="text-sm font-medium text-neutral-500">{item.display_name}</p>
                    </div>
                  </div>
                  {/* Second Column */}
                  <div className="flex-1 flex py-2 gap-2 items-center">
                    <div className="bg-sky-800 rounded-full p-1 border-2 border-sky-800">
                      <Link2 className="" size={32} color="white" />
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-md font-medium text-black">Webhook URL</p>
                      <div className="flex items-center gap-2">
                        <p
                          className="text-sm font-medium text-neutral-500 truncate max-w-[180px]"
                          title={item.webhook_url}
                        >
                          {item.webhook_url}
                        </p>
                        <button
                          onClick={e => {
                            e.preventDefault();
                            copyToClipboard(item.webhook_url, item.webhook_id);
                          }}
                          className={`inline-flex items-center px-2 py-1 rounded transition-colors ${
                            copiedId === item.webhook_id
                              ? "bg-green-200 text-green-700"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <HiClipboard className="h-4 w-4 mr-1" />
                          {copiedId === item.webhook_id ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Third Column */}
                  <div className="flex-1 flex py-2 gap-2 items-center">
                    <div className="bg-sky-700 rounded-full p-1 border-2 border-sky-700">
                      <Webhook className="" size={32} color="white" />
                    </div>
                    <div className="flex flex-col justify-start">
                      <p className="text-md font-medium text-black">Webhook Type</p>
                      <p className="text-sm font-medium text-neutral-500 capitalize">
                        {item.webhook_type.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end pt-2 pl-3 gap-2 lg:flex-row lg:pt-8 lg:gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={20} />
                    <p>Created at</p>
                  </div>
                  <strong>{convertToTaipeiTime(item.created_at)}</strong>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
