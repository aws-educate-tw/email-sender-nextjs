"use client";
import { useEffect, useState, useCallback } from "react";
import WebhookRecordsSkeleton from "@/app/ui/skeleton/webhook-records-skeleton";
import { HiClipboard } from "react-icons/hi";
import { Link2, Mail, Webhook, Save, Edit, ChevronDown, ChevronUp, Search } from "lucide-react";
import SelectDropdown from "@/app/ui/select-dropdown";
import AttachDropdown from "@/app/ui/attach-dropdown";
import IframePreview from "@/app/ui/iframe-preview";
import EmailInput from "@/app/ui/email-input";
import EmailDetailsTable from "@/app/ui/email-details-table";
import EmailDetailsTableSkeleton from "@/app/ui/skeleton/email-details-table-skeleton";

interface PageProps {
  params: {
    webhookId: string;
  };
}

interface RowDataType {
  [key: string]: string;
}

interface EmailDataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  created_at: string;
  recipient_name: string;
  recipient_email: string;
  sender_local_part: string;
  status: string;
  spreadsheet_file_id: string;
  row_data: RowDataType;
  attachment_file_ids: string[];
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

interface WebhookDetails {
  webhook_id: string;
  webhook_url: string;
  subject: string;
  display_name: string;
  template_file_id: string;
  template_file_url: string;
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
  webhook_type: string;
  run_id?: string; // Add run_id if it's available from webhook details
}

interface EmailsResponse {
  data: EmailDataType[];
  pagination?: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}

export default function Page({ params }: PageProps) {
  const [data, setData] = useState<WebhookDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [templateFileError, setTemplateFileError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<WebhookDetails | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [HtmlPreviewLink, setHtmlPreviewLink] = useState<string | null>("");
  const [previewTemplate, setPreviewTemplate] = useState<boolean>(false);

  // Toggle states for collapsible sections
  const [isWebhookInfoOpen, setIsWebhookInfoOpen] = useState(false);
  const [isEmailListOpen, setIsEmailListOpen] = useState(true);

  // Email-related states (following emailHistory pattern)
  const [allEmails, setAllEmails] = useState<EmailDataType[]>([]);
  const [isEmailLoading, setIsEmailLoading] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedEmailNum, setSelectedEmailNum] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<any[]>([]);
  const [webhookRunId, setWebhookRunId] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhookDetails(params.webhookId);
    // Try to fetch webhook emails initially
    fetchWebhookEmails(params.webhookId);
  }, [params.webhookId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Initialize form data when webhook details are loaded
    if (data) {
      setFormData({ ...data });
      // If webhook details contain run_id, use it for fetching emails
      if (data.run_id) {
        setWebhookRunId(data.run_id);
      }
    }
  }, [data]);

  // Update selected email count (following emailHistory pattern)
  useEffect(() => {
    const selectedCount = Object.keys(selectedRows).length;
    setSelectedEmailNum(selectedCount);
  }, [selectedRows]);

  // Fetch emails when status changes (following emailHistory pattern)
  useEffect(() => {
    // Always call fetchAllEmails, it will handle the null webhookRunId case
    fetchAllEmails(selectedStatus);
    // Clear previous selection state
    setSelectedRows({});
  }, [selectedStatus, webhookRunId]); // eslint-disable-line react-hooks/exhaustive-deps

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

      if (response.ok) {
        // If response is successful, set the data directly
        setData(result);
      } else {
        setError(result.message || "Failed to fetch webhook details");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmails = useCallback(
    async (
      runId: string,
      limit: string | number,
      page: number,
      status: string | null = null,
      access_token: string
    ): Promise<EmailsResponse> => {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/runs/${runId}/emails`);

      url.searchParams.append("page", page.toString());

      if (limit) {
        url.searchParams.append("limit", limit.toString());
      }

      if (status) {
        url.searchParams.append("status", status);
      }

      let retries = 0;
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second delay between retries

      while (retries < maxRetries) {
        try {
          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Request failed: ${response.status} - ${response.statusText}`);
          }

          return await response.json();
        } catch (error) {
          retries++;
          console.error(`Attempt ${retries}/${maxRetries} failed:`, error);

          if (retries >= maxRetries) {
            console.error("All retry attempts failed");
            throw error;
          }

          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
      throw new Error("Failed to fetch emails after maximum retry attempts");
    },
    []
  );

  // Fetch all emails (following emailHistory pattern)
  const fetchAllEmails = useCallback(
    async (status: string | null = null) => {
      if (!webhookRunId) {
        // If no run_id, set empty array and show user-friendly message
        setAllEmails([]);
        setIsEmailLoading(false);
        setEmailError(
          "No emails have been sent by this webhook yet (Run ID has not been generated)"
        );
        return;
      }

      setIsEmailLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        // Fetch emails using the same pattern as emailHistory
        const result = await fetchEmails(webhookRunId, "ALL", 0, status, token);
        setAllEmails(result.data);
        setIsEmailLoading(false);
      } catch (error: any) {
        setIsEmailLoading(false);
        setEmailError("Failed to load emails. Please try again later");
        console.error("Failed to fetch emails:", error.message);
      }
    },
    [webhookRunId, fetchEmails]
  );

  const fetchWebhookEmails = useCallback(
    async (webhookId: string) => {
      setIsEmailLoading(true);
      setEmailError(null);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        // First, we need to get the run_id associated with this webhook
        // This could come from the webhook details API or a separate endpoint
        // For now, let's try to get it from webhook runs endpoint
        const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
        const runsUrl = new URL(`${base_url}/webhooks/${webhookId}/runs`);

        const runsResponse = await fetch(runsUrl.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!runsResponse.ok) {
          // If webhook runs endpoint doesn't exist, try alternative approach
          if (runsResponse.status === 404) {
            console.log("Webhook runs endpoint not found (404) - webhook has no runs yet");

            // If webhook details already contains run_id, use it
            if (data?.run_id) {
              setWebhookRunId(data.run_id);
              return;
            }

            // Otherwise, set null run_id and let fetchAllEmails handle the message
            setWebhookRunId(null);
            return;
          }
          // Only throw error for non-404 status codes
          throw new Error(`Failed to fetch webhook runs: ${runsResponse.status}`);
        }

        const runsResult = await runsResponse.json();

        // If we have runs, get emails for the most recent run
        if (runsResult.data && runsResult.data.length > 0) {
          const latestRun = runsResult.data[0]; // Assuming the first one is the latest
          const runId = latestRun.run_id;
          setWebhookRunId(runId);
        } else {
          // No runs found for this webhook - let fetchAllEmails handle the message
          setWebhookRunId(null);
        }
      } catch (error: any) {
        // Only set error for unexpected failures
        console.error("Failed to fetch webhook emails:", error);
        setWebhookRunId(null);
      }
      // Note: Don't set setIsEmailLoading(false) here, let fetchAllEmails handle it
    },
    [data]
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Email table handlers
  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleSelectedRowsChange = (count: number) => {
    setSelectedEmailNum(count);
  };

  const handleRowSelectionChange = useCallback((newSelectedRows: Record<string, boolean>) => {
    setSelectedRows(newSelectedRows);
    const selectedCount = Object.values(newSelectedRows).filter(Boolean).length;
    setSelectedEmailNum(selectedCount);
  }, []);

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };

  const handleSortingChange = (newSorting: any[]) => {
    setSorting(newSorting);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;

    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // If canceling edit mode, reset form data to current data
      setFormData({ ...data! });
    }
    setIsEditMode(!isEditMode);
    setSuccessMessage(null); // Clear any success message
  };

  const handleHtmlSelect = (file_id: string, file_url: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      template_file_id: file_id,
      template_file_url: file_url,
    });

    // Clear any previous error
    setTemplateFileError(null);
    setHtmlPreviewLink(file_url);
  };

  const handleAttachSelect = (selectedFiles: { file_id: string; file_url: string }[]) => {
    if (!formData) return;

    setFormData({
      ...formData,
      attachment_file_ids: selectedFiles.map(file => file.file_id),
    });
  };

  const handleReplyToChange = (emails: string[]) => {
    if (!formData) return;

    setFormData({
      ...formData,
      reply_to: emails[0],
    });
  };

  const handleCCEmailsChange = (emails: string[]) => {
    if (!formData) return;

    setFormData({
      ...formData,
      cc: emails,
    });
  };

  const handleBCCEmailsChange = (emails: string[]) => {
    if (!formData) return;

    setFormData({
      ...formData,
      bcc: emails,
    });
  };

  const saveWebhook = async () => {
    if (!formData) return;

    // Validate required fields
    if (!formData.template_file_id) {
      setTemplateFileError("Template file is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setTemplateFileError(null);
    setSuccessMessage(null);

    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/webhooks/${params.webhookId}`);

      const token = localStorage.getItem("access_token");
      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: formData.subject,
          display_name: formData.display_name,
          template_file_id: formData.template_file_id,
          is_generate_certificate: formData.is_generate_certificate,
          reply_to: formData.reply_to,
          sender_local_part: formData.sender_local_part,
          attachment_file_ids: formData.attachment_file_ids,
          bcc: formData.bcc,
          cc: formData.cc,
          surveycake_link: formData.surveycake_link,
          hash_key: formData.hash_key,
          iv_key: formData.iv_key,
          webhook_name: formData.webhook_name,
          webhook_type: formData.webhook_type || "surveycake",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // For successful responses (200 OK), the API returns the updated webhook directly
        // without a status field, so we check if response.ok is true
        setData(result);
        setFormData(result);
        setSuccessMessage("Webhook successfully updated!");
        setIsEditMode(false);
      } else {
        setError(result.message || "Failed to update webhook");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSaving(false);
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

      {successMessage && (
        <div className="mb-4">
          <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
            {successMessage}
          </div>
        </div>
      )}

      {isLoading ? (
        <WebhookRecordsSkeleton />
      ) : error ? (
        <div className="p-6">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
        </div>
      ) : !data || !formData ? (
        <div className="p-6">
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
            No webhook details found
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Webhook Information Section */}
          <div className="border rounded-md shadow-md bg-white w-full mx-auto">
            <div
              onClick={() => setIsWebhookInfoOpen(!isWebhookInfoOpen)}
              className="border rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900 text-lg">Webhook Information</span>
              {isWebhookInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {isWebhookInfoOpen && (
              <div className="p-4 md:p-6 bg-neutral-100">
                {/* Basic Information */}
                <div className="flex flex-col gap-4 mb-6">
                  <div className="rounded-lg flex w-full items-center gap-2">
                    <h2 className="py-2 rounded-lg w-full text-start text-2xl font-semibold text-sky-950">
                      Basic Information
                    </h2>
                    {!isLoading && !error && data && (
                      <div className="flex gap-2 rounded-lg">
                        {isEditMode ? (
                          <>
                            <button
                              onClick={saveWebhook}
                              disabled={isSaving}
                              className="h-full bg-sky-950 hover:bg-sky-800 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
                            >
                              <Save size={16} />
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={toggleEditMode}
                              className="hover:bg-gray-300 text-black p-2 rounded-md flex items-center gap-2"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={toggleEditMode}
                            className="hover:bg-neutral-300 text-white p-2 rounded-md flex items-center gap-2"
                          >
                            <Edit size={20} className="text-black" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Webhook size={20} className="text-sky-950 shrink-0" />
                        <span className="font-medium">Webhook Name:</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="webhook_name"
                          value={formData.webhook_name}
                          onChange={handleInputChange}
                          className="border border-neutral-300 rounded-lg p-2 w-full"
                        />
                      ) : (
                        <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                          {data.webhook_name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Mail size={20} className="text-sky-950 shrink-0" />
                        <span className="font-medium">Display Name:</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          name="display_name"
                          value={formData.display_name}
                          onChange={handleInputChange}
                          className="border border-gray-300 rounded-md p-2 w-full"
                        />
                      ) : (
                        <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                          {data.display_name}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Link2 size={20} className="text-sky-950 shrink-0" />
                        <span className="font-medium">Webhook URL:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="break-all font-bold bg-white underline p-2 rounded-lg w-full">
                          {data.webhook_url}
                        </span>

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
                            <span className="flex items-center gap-1 text-gray-700 whitespace-nowrap animate-bounce">
                              <HiClipboard size={20} />
                              <span className="hidden sm:inline">Copy</span>
                            </span>
                          )}
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
                        {isEditMode ? (
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.subject}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span> Reply To:</span>
                        {isEditMode ? (
                          <EmailInput
                            allowMultiple={false}
                            onEmailsChange={handleReplyToChange}
                            initialEmails={formData.reply_to}
                          />
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.reply_to}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ">
                        <span className="font-medium">Sender:</span>
                        {isEditMode ? (
                          <div className="flex items-center bg-neutral-300 rounded-lg">
                            <input
                              type="text"
                              name="sender_local_part"
                              value={formData.sender_local_part}
                              onChange={handleInputChange}
                              className="border border-gray-300 w-full outline-2 rounded-l-lg"
                            />
                            <span className="w-44 text-center text-sm">@aws-educate.tw</span>
                          </div>
                        ) : (
                          <span className="bg-white p-2 rounded-lg border border-neutral-300 opacity-40 text-wrap">
                            {data.sender_local_part}@aws-educate.tw
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-medium">CC:</span>
                        {isEditMode ? (
                          <EmailInput
                            allowMultiple={true}
                            onEmailsChange={handleCCEmailsChange}
                            initialEmails={formData.cc}
                          />
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.cc.length > 0 ? data.cc.join(", ") : "None"}
                          </span>
                        )}

                        <div className="flex flex-col gap-2">
                          <span className="font-medium">BCC:</span>
                          {isEditMode ? (
                            <EmailInput
                              allowMultiple={true}
                              onEmailsChange={handleBCCEmailsChange}
                              initialEmails={formData.bcc}
                            />
                          ) : (
                            <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                              {data.bcc.length > 0 ? data.bcc.join(", ") : "None"}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-start gap-2">
                          <span className="font-medium">Generate Certificate:</span>
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.is_generate_certificate ? "Yes" : "No"}
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
                        {isEditMode ? (
                          <div className="flex">
                            <SelectDropdown
                              onSelect={handleHtmlSelect}
                              fileExtension="html"
                              error={templateFileError || undefined}
                            />
                            {templateFileError && (
                              <p className="text-sm text-red-500 mt-1">{templateFileError}</p>
                            )}
                            <button
                              type="button"
                              onClick={() => setPreviewTemplate(true)}
                              className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                            >
                              preview
                            </button>
                          </div>
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.template_file_id}
                          </span>
                        )}
                        {previewTemplate && (
                          <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 p-20">
                            <div className="bg-yellow-400 rounded-lg shadow-2xl p-8 pb-12 w-full h-full relative">
                              <button
                                onClick={() => setPreviewTemplate(false)}
                                className="absolute top-8 right-8 text-white"
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                                  />
                                </svg>
                              </button>
                              <div className="w-full h-full p-2 flex flex-col">
                                <p className="text-2xl text-white">Preview Template</p>
                                {HtmlPreviewLink ? (
                                  <IframePreview
                                    src={HtmlPreviewLink}
                                    title="Template Preview"
                                    width="100%"
                                    height="100%"
                                  />
                                ) : (
                                  <div className="flex w-full h-full justify-center items-center">
                                    <p className="text-white">No preview available</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-medium">Surveycake Link:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            name="surveycake_link"
                            value={formData.surveycake_link}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.surveycake_link || "None"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-medium">Attachments:</span>
                        {isEditMode ? (
                          <AttachDropdown onSelect={handleAttachSelect} />
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.attachment_file_ids.length} file(s)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-medium">Hash Key:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            name="hash_key"
                            value={formData.hash_key}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.hash_key}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-medium">IV Key:</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            name="iv_key"
                            value={formData.iv_key}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.iv_key}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-medium">Webhook Type: </span>
                        {isEditMode ? (
                          <select
                            name="webhook_type"
                            value={formData.webhook_type}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          >
                            <option value="surveycake">Surveycake</option>
                            <option value="custom">Custom</option>
                          </select>
                        ) : (
                          <span className="break-all bg-white p-2 rounded-lg border border-neutral-300 opacity-40">
                            {data.webhook_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Email List Section */}
          <div className="border rounded-md shadow-md bg-white w-full mx-auto">
            <div
              onClick={() => setIsEmailListOpen(!isEmailListOpen)}
              className="border rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900 text-lg">Email List</span>
              {isEmailListOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {isEmailListOpen && (
              <div className="p-4 md:p-6">
                <div className="flex justify-between py-2 px-0 mb-4">
                  {/* Selected emails summary could go here if needed */}
                  <div className="flex-grow">
                    {!isEmailLoading && webhookRunId !== null && allEmails.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Total: {allEmails.length} emails
                        {selectedEmailNum > 0 && `, Selected: ${selectedEmailNum}`}
                      </div>
                    )}
                  </div>
                  {/* Search input */}
                  <div
                    className={`flex rounded-md border border-gray-300 shadow shadow-sm w-full max-w-52
                      ${isEmailLoading || webhookRunId === null ? "bg-gray-100" : ""}`}
                  >
                    <div className="flex items-center pl-3">
                      <Search
                        className={`h-4 w-4 ${isEmailLoading || webhookRunId === null ? "text-gray-300" : "text-gray-400"}`}
                      />
                    </div>
                    <input
                      className={`rounded-md border-transparent shadow-sm w-full
                        focus:border-transparent focus:ring-transparent
                        disabled:cursor-wait disabled:bg-gray-100 disabled:placeholder-gray-300`}
                      placeholder="Search emails..."
                      type="text"
                      value={globalFilter ?? ""}
                      disabled={isEmailLoading || webhookRunId === null}
                      onChange={e => setGlobalFilter(e.target.value)}
                    />
                  </div>
                </div>

                {emailError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    Error loading emails: {emailError}
                  </div>
                )}

                {isEmailLoading ? (
                  <EmailDetailsTableSkeleton />
                ) : (
                  <EmailDetailsTable
                    data={allEmails}
                    selectedStatus={selectedStatus}
                    onStatusChange={handleStatusChange}
                    selectedRows={selectedRows}
                    onSelectedRowsChange={handleSelectedRowsChange}
                    onRowSelectionChange={handleRowSelectionChange}
                    selectedEmailNum={selectedEmailNum}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={handleGlobalFilterChange}
                    sorting={sorting}
                    onSortingChange={handleSortingChange}
                  />
                )}

                {!isEmailLoading && allEmails.length === 0 && !emailError && (
                  <div className="text-center py-8 text-gray-500">
                    {webhookRunId === null ? (
                      <div>
                        <p className="text-lg mb-2">目前尚未有 Email</p>
                        <p className="text-sm">此 Webhook 尚未執行任何郵件發送</p>
                      </div>
                    ) : (
                      "No emails found for this webhook."
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
