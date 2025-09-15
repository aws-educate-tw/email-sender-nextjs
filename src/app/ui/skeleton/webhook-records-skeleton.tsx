import { Webhook, Mail, Link2, ChevronDown, Search } from "lucide-react";
import { HiClipboard } from "react-icons/hi";
import EmailDetailsTableSkeleton from "./email-details-table-skeleton";

export default function WebhookDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Webhook Information Section */}
      <div className="border rounded-md shadow-md bg-white w-full mx-auto">
        <div className="border rounded-lg px-4 py-3 flex justify-between items-center">
          <span className="font-medium text-gray-900 text-lg">Webhook Information</span>
          <ChevronDown size={20} />
        </div>
        <div className="p-4 md:p-6 bg-neutral-100">
          {/* Basic Information */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="rounded-lg flex w-full items-center gap-2">
              <h2 className="py-2 rounded-lg w-full text-start text-2xl font-semibold text-sky-950">
                Basic Information
              </h2>
              <div className="flex gap-2 rounded-lg">
                <div className="bg-slate-200 h-10 w-16 rounded-md animate-pulse"></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Webhook size={20} className="text-sky-950 shrink-0" />
                  <span className="font-medium">Webhook Name:</span>
                </div>
                <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Mail size={20} className="text-sky-950 shrink-0" />
                  <span className="font-medium">Display Name:</span>
                </div>
                <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link2 size={20} className="text-sky-950 shrink-0" />
                  <span className="font-medium">Webhook URL:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-200 h-10 rounded-lg w-full animate-pulse"></div>
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
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span>Reply To:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">Sender:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">CC:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>

                  <div className="flex flex-col gap-2">
                    <span className="font-medium">BCC:</span>
                    <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <span className="font-medium">Generate Certificate:</span>
                    <div className="bg-slate-200 h-10 rounded-lg animate-pulse w-full"></div>
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
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">Surveycake Link:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">Attachments:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">Hash Key:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">IV Key:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">Webhook Type:</span>
                  <div className="bg-slate-200 h-10 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email List Section */}
      <div className="border rounded-md shadow-md bg-white w-full mx-auto">
        <div className="border rounded-lg px-4 py-3 flex justify-between items-center">
          <span className="font-medium text-gray-900 text-lg">Email List</span>
          <ChevronDown size={20} />
        </div>
        <div className="p-4 md:p-6">
          <div className="flex justify-between py-2 px-0 mb-4">
            <div className="flex-grow">
              <div className="bg-slate-200 h-5 w-32 rounded animate-pulse"></div>
            </div>
            {/* Search input skeleton */}
            <div className="flex rounded-md border border-gray-300 shadow shadow-sm w-full max-w-52 bg-gray-100">
              <div className="flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-300" />
              </div>
              <div className="bg-slate-200 h-10 rounded-md w-full animate-pulse"></div>
            </div>
          </div>

          {/* Email table skeleton */}
          <EmailDetailsTableSkeleton />
        </div>
      </div>
    </div>
  );
}
