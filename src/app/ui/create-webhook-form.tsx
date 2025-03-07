"use client";
import React, { useRef, useState, FormEvent } from "react";
import { submitWebhookForm } from "@/lib/actions";
import HelpTip from "@/app/ui/help-tip";
import SelectDropdown from "@/app/ui/select-dropdown";
import AttachDropdown from "./attach-dropdown";
import WebhookTypeDropdown from "@/app/ui/webhook-type-dropdown";
import FileUpload from "@/app/ui/file-upload";
import IframePreview from "@/app/ui/iframe-preview";
import EmailInput from "@/app/ui/email-input";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiClipboard } from "react-icons/hi";
import { GoAlert } from "react-icons/go";

interface SubmitResponse {
  status: string;
  message: string;
  data?: { webhook_id: string; webhook_url: string };
  errors?: { path: string; message: string }[];
}

export default function CreateWebhookForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedHTML, setSelectedHtmlFile] = useState<string | null>("");
  const [HtmlPreviewLink, setHtmlPreviewLink] = useState<string | null>("");
  const [showTemplateUpload, setShowTemplateUpload] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<boolean>(false);
  const [replyToEmail, setReplyToEmail] = useState<string>("");
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [localPart, setLocalPart] = useState<string>("");
  // 首先加入 state
  const [showAttachUpload, setShowAttachUpload] = useState<boolean>(false);
  const [attachment_file_ids, setAttachment_file_ids] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailedToast, setShowFailedToast] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookType, setWebhookType] = useState<string>("surveycake");

  const router = useRouter();

  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem("token_expiry_time");
    if (!expiryTime) return true;
    return new Date().getTime() > parseInt(expiryTime);
  };

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token || isTokenExpired()) {
      router.push("/login");
    }
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!ref.current) return;

    // Extract form data
    const formData: any = {
      subject: (ref.current.querySelector("[id='subject']") as HTMLInputElement).value,
      display_name: (ref.current.querySelector("[id='display_name']") as HTMLInputElement).value,
      template_file_id: selectedHTML,
      surveycake_link: (ref.current.querySelector("[id='surveycake_link']") as HTMLInputElement)
        .value,
      hash_key: (ref.current.querySelector("[id='hash_key']") as HTMLInputElement).value,
      iv_key: (ref.current.querySelector("[id='iv_key']") as HTMLInputElement).value,
      webhook_type: webhookType,
    };

    if ((ref.current.querySelector("[id='webhook_name']") as HTMLInputElement).value) {
      formData.webhook_name = (
        ref.current.querySelector("[id='webhook_name']") as HTMLInputElement
      ).value;
    }
    if (localPart) formData.sender_local_part = localPart;
    if (replyToEmail) formData.reply_to = replyToEmail;
    if (bccEmails.length > 0) formData.bcc = bccEmails;
    if (ccEmails.length > 0) formData.cc = ccEmails;
    if (attachment_file_ids.length > 0) formData.attachment_file_ids = attachment_file_ids;

    try {
      const response = await submitWebhookForm(
        JSON.stringify(formData),
        localStorage.getItem("access_token") || ""
      );

      handleResponse(response);
    } catch (error: any) {
      console.error("Unexpected error:", error);
      showToast("error", "Unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to handle the response
  const handleResponse = (response: SubmitResponse) => {
    if (response.status === "error") {
      if (response.errors) {
        // Handle validation errors
        const newErrors: { [key: string]: string } = {};
        response.errors.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        showToast("error", "Validation failed. Please fix the errors.");
      } else {
        // Handle general API errors
        showToast("error", response.message || "Failed to create webhook.");
      }
      return;
    }

    // Success case
    setWebhookUrl(response.data?.webhook_url || "");
    setIsCopied(false);
    showToast("success", "Webhook created successfully!");
  };

  // Helper function for showing toast notifications
  const showToast = (status: "success" | "error", message: string) => {
    if (status === "success") {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 10000);
    } else {
      setShowFailedToast(true);
      setTimeout(() => setShowFailedToast(false), 3000);
    }
    console.log(`[${status.toUpperCase()}] ${message}`);
  };

  const handleHtmlSelect = (file_id: string | null, file_url: string | null) => {
    setSelectedHtmlFile(file_id);
    setHtmlPreviewLink(file_url);
  };

  const handleReplyToEmailChange = (emails: string[]) => {
    setReplyToEmail(emails[0] || "");
  };

  const handleBccEmailsChange = (emails: string[]) => {
    setBccEmails(emails);
  };

  const handleCcEmailsChange = (emails: string[]) => {
    setCcEmails(emails);
  };

  const handleAttachSelect = (selectedFiles: any) => {
    const selected_ids = selectedFiles.map((file: any) => file.file_id);
    setAttachment_file_ids(selected_ids);
  };

  const handleAttachOpenUpload = () => {
    setShowAttachUpload(true);
  };

  const handleAttachCloseUpload = () => {
    setShowAttachUpload(false);
  };

  const handleWebhookTypeChange = (webhook_type: string) => {
    setWebhookType(webhook_type);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Create Webhook</p>
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-500 italic">Configure your webhook settings.</p>
          <div className="h-10"></div>
        </div>
      </div>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <form onSubmit={onSubmit} ref={ref}>
        <p className="text-2xl font-bold py-2">Required</p>
        <div className="rounded-md bg-neutral-100 p-4">
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Subject:
              <HelpTip message="Enter the subject that recipients will see.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter the subject"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.subject ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Display Name:
              <HelpTip message="Enter the name that will be displayed to recipients.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Enter display name"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.display_name ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.display_name && <p className="text-red-500 text-sm">{errors.display_name}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Select template file:
              <HelpTip message="Choose or upload template file for the webhook.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex items-center gap-2">
              <SelectDropdown
                onSelect={handleHtmlSelect}
                fileExtension="html"
                error={errors.template_file_id}
              />
              <button
                type="button"
                onClick={() => setPreviewTemplate(true)}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                preview
              </button>
              <button
                type="button"
                onClick={() => setShowTemplateUpload(true)}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                upload
              </button>
            </div>
            {errors.template_file_id && (
              <p className="text-red-500 text-sm">{errors.template_file_id}</p>
            )}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Surveycake Link:
              <HelpTip message="Enter the Surveycake form URL if applicable.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="surveycake_link"
              name="surveycake_link"
              type="text"
              placeholder="Enter Surveycake link"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.surveycake_link ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.surveycake_link && (
              <p className="text-red-500 text-sm">{errors.surveycake_link}</p>
            )}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Hash Key:
              <HelpTip message="Enter the hash key for webhook security.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="hash_key"
              name="hash_key"
              type="text"
              placeholder="Enter hash key"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.hash_key ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.hash_key && <p className="text-red-500 text-sm">{errors.hash_key}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              IV Key:
              <HelpTip message="Enter the initialization vector key.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="iv_key"
              name="iv_key"
              type="text"
              placeholder="Enter IV key"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.iv_key ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.iv_key && <p className="text-red-500 text-sm">{errors.iv_key}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Webhook Type:
              <HelpTip message="Select the webhook type.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <WebhookTypeDropdown onSelect={handleWebhookTypeChange} />
          </div>
        </div>
        <p className="text-2xl font-bold py-2 flex items-center gap-1">
          Optional
          {/* <ChevronDown size={24} /> */}
        </p>
        <div className="rounded-md bg-neutral-100 p-4">
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Webhook Name:
              <HelpTip message="Enter a name to identify your webhook.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="webhook_name"
              name="webhook_name"
              type="text"
              placeholder="Enter webhook name"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.webhook_name ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.webhook_name && <p className="text-red-500 text-sm">{errors.webhook_name}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Sender Local Part:
              <HelpTip message="Enter the prefix for your email address. Example: if you enter 'john.doe', the email will be 'john.doe@aws-educate.tw'">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex items-center bg-neutral-300 rounded-md">
              <input
                id="sender_local_part"
                name="sender_local_part"
                type="text"
                value={localPart}
                onChange={e => setLocalPart(e.target.value)}
                placeholder="Enter the local part of email"
                disabled={isSubmitting}
                className={`rounded-l-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                  errors.sender_local_part ? "border-red-500" : "border-gray-200"
                }`}
              />
              <div className="w-44 text-center text-sm">@aws-educate.tw</div>
            </div>
            {errors.sender_local_part && (
              <p className="text-red-500 text-sm">{errors.sender_local_part}</p>
            )}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Reply To:
              <HelpTip message="Enter the email address where replies will be sent.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <EmailInput allowMultiple={false} onEmailsChange={handleReplyToEmailChange} />
            {errors.reply_to && <p className="text-red-500 text-sm">{errors.reply_to}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              BCC:
              <HelpTip message="Enter email addresses for BCC recipients.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <EmailInput allowMultiple={true} onEmailsChange={handleBccEmailsChange} />
            {errors.bcc && <p className="text-red-500 text-sm">{errors.bcc}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              CC:
              <HelpTip message="Enter email addresses for CC recipients.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <EmailInput allowMultiple={true} onEmailsChange={handleCcEmailsChange} />
            {errors.cc && <p className="text-red-500 text-sm">{errors.cc}</p>}
          </div>

          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Attach files:
              <HelpTip message="Attach any files you want to include with the email. Note: It is recommended that the total size of attachments does not exceed 5MB.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex items-center gap-2">
              <AttachDropdown onSelect={handleAttachSelect} />
              <button
                type="button"
                onClick={handleAttachOpenUpload}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                upload
              </button>
              {showAttachUpload && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-2xl p-8 pb-20 w-full max-w-screen-lg relative">
                    <button
                      onClick={handleAttachCloseUpload}
                      className="absolute top-8 right-8 text-black"
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
                    <FileUpload OnFileExtension="all" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end my-3 gap-3">
          {isSubmitting ? (
            <button
              type="button"
              className="flex h-10 items-center rounded-lg bg-gray-500 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              disabled
            >
              Creating...
            </button>
          ) : (
            <button
              type="submit"
              className="flex h-10 items-center rounded-lg bg-sky-950 hover:bg-sky-800 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
            >
              Create Webhook
            </button>
          )}
        </div>
      </form>

      {showTemplateUpload && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-screen-lg relative">
            <button
              onClick={() => setShowTemplateUpload(false)}
              className="absolute top-4 right-4 text-black"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
            <FileUpload OnFileExtension=".html" />
          </div>
        </div>
      )}

      {previewTemplate && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 p-20">
          <div className="bg-yellow-400 rounded-lg shadow-2xl p-8 pb-12 w-full h-full relative">
            <button
              onClick={() => setPreviewTemplate(false)}
              className="absolute top-8 right-8 text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

      {/* 建立成功的 Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            className={`${isCopied ? "bg-blue-400" : "bg-green-400"} drop-shadow-lg transition-all`}
          >
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                  <HiCheck className="h-5 w-5" />
                </div>
                {isCopied ? (
                  <p className="font-medium text-white">URL copied to clipboard !</p>
                ) : (
                  <p className="font-medium text-white">Webhook created successfully !</p>
                )}
                {/* <p className="font-medium text-white">Webhook created successfully!</p> */}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <p className="text-sm break-all">{webhookUrl}</p>
                  <button
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <HiClipboard className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </Toast>
        </div>
      )}
      {showFailedToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast className="bg-red-500 drop-shadow-lg transition-all">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                  <GoAlert className="h-5 w-5" />
                </div>
                <p className="font-medium text-white">Failed to create the Webhook Url !</p>
                {/* <p className="font-medium text-white">Webhook created successfully!</p> */}
              </div>
            </div>
          </Toast>
        </div>
      )}
    </>
  );
}
