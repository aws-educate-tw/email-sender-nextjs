"use client";
import { useEffect, useState } from "react";
import WebhookRecordsSkeleton from "@/app/ui/skeleton/webhook-records-skeleton";
import { HiClipboard } from "react-icons/hi";
import { Link2, Mail, Webhook, Save, Edit, X } from "lucide-react";
import SelectDropdown from "@/app/ui/select-dropdown";

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
  template_file_url?: string; // Add this to store the file URL
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

  useEffect(() => {
    fetchWebhookDetails(params.webhookId);
  }, [params.webhookId]);

  useEffect(() => {
    // Initialize form data when webhook details are loaded
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof WebhookDetails
  ) => {
    if (!formData) return;

    const value = e.target.value;
    // Split by commas and trim whitespace
    const arrayValues = value ? value.split(",").map(item => item.trim()) : [];

    setFormData({
      ...formData,
      [field]: arrayValues,
    });
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // If canceling edit mode, reset form data to current data
      setFormData({ ...data! });
    }
    setIsEditMode(!isEditMode);
    setSuccessMessage(null); // Clear any success message
  };

  const handleTemplateFileSelect = (file_id: string, file_url: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      template_file_id: file_id,
      template_file_url: file_url,
    });

    // Clear any previous error
    setTemplateFileError(null);
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
          {!isLoading && !error && data && (
            <div className="flex gap-2">
              {isEditMode ? (
                <>
                  <button
                    onClick={saveWebhook}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditMode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Webhook
                </button>
              )}
            </div>
          )}
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
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-950">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="border border-gray-300 rounded-md p-2 w-full"
                  />
                ) : (
                  <span className="break-all">{data.webhook_name}</span>
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
                  <span className="break-all">{data.display_name}</span>
                )}
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Link2 size={20} className="text-sky-950 shrink-0" />
                  <span className="font-medium">Webhook URL:</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      name="webhook_url"
                      value={formData.webhook_url}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 flex-1"
                      disabled
                    />
                  ) : (
                    <span className="break-all">{data.webhook_url}</span>
                  )}
                  {!isEditMode && (
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
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-sky-950">Email Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <span className="break-all">{data.subject}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">Reply To:</span>
                  {isEditMode ? (
                    <input
                      type="email"
                      name="reply_to"
                      value={formData.reply_to}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                  ) : (
                    <span className="break-all">{data.reply_to}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">Sender:</span>
                  {isEditMode ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        name="sender_local_part"
                        value={formData.sender_local_part}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                      <span className="ml-2">@aws-educate.tw</span>
                    </div>
                  ) : (
                    <span className="break-all">{data.sender_local_part}@aws-educate.tw</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">CC:</span>
                  {isEditMode ? (
                    <textarea
                      name="cc"
                      value={formData.cc.join(", ")}
                      onChange={e => handleArrayInputChange(e, "cc")}
                      className="border border-gray-300 rounded-md p-2 w-full min-h-24"
                      placeholder="Enter emails separated by commas"
                    />
                  ) : (
                    <span className="break-all">
                      {data.cc.length > 0 ? data.cc.join(", ") : "None"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-medium">BCC:</span>
                  {isEditMode ? (
                    <textarea
                      name="bcc"
                      value={formData.bcc.join(", ")}
                      onChange={e => handleArrayInputChange(e, "bcc")}
                      className="border border-gray-300 rounded-md p-2 w-full min-h-24"
                      placeholder="Enter emails separated by commas"
                    />
                  ) : (
                    <span className="break-all">
                      {data.bcc.length > 0 ? data.bcc.join(", ") : "None"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Generate Certificate:</span>
                  {isEditMode ? (
                    <input
                      type="checkbox"
                      name="is_generate_certificate"
                      checked={formData.is_generate_certificate}
                      onChange={handleInputChange}
                      className="h-5 w-5"
                    />
                  ) : (
                    <span>{data.is_generate_certificate ? "Yes" : "No"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-sky-950">Additional Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Template File:</span>
                  {isEditMode ? (
                    <div>
                      <SelectDropdown
                        onSelect={handleTemplateFileSelect}
                        fileExtension="html"
                        error={templateFileError || undefined}
                      />
                      {templateFileError && (
                        <p className="text-sm text-red-500 mt-1">{templateFileError}</p>
                      )}
                    </div>
                  ) : (
                    <span className="break-all">{data.template_file_id}</span>
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
                    <span className="break-all">{data.surveycake_link || "None"}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Attachments:</span>
                  {isEditMode ? (
                    <textarea
                      name="attachment_file_ids"
                      value={formData.attachment_file_ids.join(", ")}
                      onChange={e => handleArrayInputChange(e, "attachment_file_ids")}
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Enter file IDs separated by commas"
                    />
                  ) : (
                    <span>{data.attachment_file_ids.length} file(s)</span>
                  )}
                </div>

                {isEditMode && (
                  <>
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Hash Key:</span>
                      <input
                        type="text"
                        name="hash_key"
                        value={formData.hash_key}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="font-medium">IV Key:</span>
                      <input
                        type="text"
                        name="iv_key"
                        value={formData.iv_key}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Webhook Type:</span>
                      <select
                        name="webhook_type"
                        value={formData.webhook_type}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                      >
                        <option value="surveycake">Surveycake</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
