import { Webhook, Mail, Link2 } from "lucide-react";
import { HiClipboard } from "react-icons/hi";

export default function WebhookDetailsSkeleton() {
  return (
    <div className="bg-neutral-100 rounded-lg p-4 md:p-6">
      {/* Basic Information */}
      <div className="flex flex-col gap-4">
        <div className="rounded-lg flex w-full items-center gap-2">
          <h2 className="py-2 rounded-lg w-full text-start text-2xl font-semibold text-sky-950">
            Basic Information
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Webhook size={20} className="text-sky-950 shrink-0" />
              <span className="font-medium">Webhook Name:</span>
            </div>
            <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse">
              <div className="h-6"></div>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-sky-950 shrink-0" />
              <span className="font-medium">Display Name:</span>
            </div>
            <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse">
              <div className="h-6"></div>
            </span>
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Link2 size={20} className="text-sky-950 shrink-0" />
              <span className="font-medium">Webhook URL:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>

              <button className="p-2 rounded transition-colors shrink-0">
                <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap">
                  <HiClipboard size={20} />
                  <span className="hidden sm:inline">Copy</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-2 border-neutral-300 mb-6 mt-8 mx-2"></div>

      {/* Email Settings */}
      <div className="flex flex-col gap-4">
        <h2 className="py-2 rounded-lg w-full text-start text-2xl font-semibold text-sky-950">
          Email Settings
        </h2>
        <div className="gap-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="font-medium">Subject:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span> Reply To:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>

            <div className="flex flex-col gap-2 ">
              <span className="font-medium">Sender:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium">CC:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>

              <div className="flex flex-col gap-2">
                <span className="font-medium">BCC:</span>
                <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                  <div className="h-6"></div>
                </span>
              </div>

              <div className="flex flex-col items-start gap-2">
                <span className="font-medium">Generate Certificate:</span>
                <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                  <div className="h-6"></div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-2 border-neutral-300 mb-6 mt-8 mx-2"></div>

      {/* Additional Settings */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-4 text-sky-950">Additional Settings</h2>
        <div className="flex flex-col">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <span className="font-medium">Template File:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium">Surveycake Link:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium">Attachments:</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium">Hash Key:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium">IV Key:</span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-medium">Webhook Type: </span>
              <span className="break-all bg-slate-200 p-2 rounded-full animate-pulse w-full">
                <div className="h-6"></div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
