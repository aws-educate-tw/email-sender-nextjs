import { Webhook, Mail, Link2 } from "lucide-react";
import { HiClipboard } from "react-icons/hi";

export default function WebhookDetailsSkeleton() {
  return (
    <div>
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
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 min-w-max">
                <Mail size={20} className="text-sky-950 shrink-0" />
                <span className="font-medium">Display Name:</span>
              </div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 min-w-max">
                <Link2 size={20} className="text-sky-950 shrink-0" />
                <span className="font-medium">Webhook URL:</span>
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <div className="h-5 w-96 max-w-full bg-gray-200 rounded animate-pulse"></div>
                <button className="p-2 rounded hover:bg-gray-200 shrink-0">
                  <span className="flex items-center gap-1 text-gray-700">
                    <HiClipboard size={20} />
                    <span className="hidden sm:inline">Copy</span>
                  </span>
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
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-medium min-w-max">Reply To:</span>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-medium min-w-max">Sender:</span>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="font-medium min-w-max">CC:</span>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-medium min-w-max">BCC:</span>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-medium min-w-max">Generate Certificate:</span>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
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
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="font-medium min-w-max">Surveycake Link:</span>
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="font-medium min-w-max">Attachments:</span>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
