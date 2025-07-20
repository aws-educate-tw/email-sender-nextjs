import React, { useEffect, useState } from "react";
import { Send, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import IframePreview from "@/app/ui/iframe-preview";
import { submitForm } from "@/lib/actions";
import { EmailDataType } from "@/app/emailService/page";

interface ReviewProps {
  emailData: EmailDataType;
  onSubmit: () => void;
}

export default function EmailServiceReview({ emailData, onSubmit }: ReviewProps) {
  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleSendEmail = async () => {
    setIsSubmitting(true);

    const formData: any = {
      subject: emailData.subject,
      display_name: emailData.senderName,
      template_file_id: emailData.templateId,
      spreadsheet_file_id: emailData.sheetFileId,
      recipient_source: "SPREADSHEET",
    };

    if (emailData.localPart) formData.sender_local_part = emailData.localPart;
    if (emailData.replyTo) formData.reply_to = emailData.replyTo;
    if (emailData.bcc) formData.bcc = emailData.bcc.split(",").map(email => email.trim());
    if (emailData.cc) formData.cc = emailData.cc.split(",").map(email => email.trim());
    if (emailData.attachments.length > 0) {
      formData.attachment_file_ids = emailData.attachments.map(file =>
        "id" in file ? (file as any).id : file.name
      );
    }
    if (emailData.provideCertification === "yes") {
      formData.is_generate_certificate = true;
    }

    try {
      const response = await submitForm(
        JSON.stringify(formData),
        localStorage.getItem("access_token") ?? ""
      );

      if (response.status === "error" && response.errors) {
        const newErrors: { [key: string]: string } = {};
        response.errors.forEach(err => {
          newErrors[err.path] = err.message;
        });
        setFormErrors(newErrors);
        alert("Error: " + response.message);
      } else {
        alert(response.status + ": " + response.message);
        setFormErrors({});

        // if (onSubmit) onSubmit();
      }
    } catch (error: any) {
      alert("Failed to send email: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadTemplatePreview = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (emailData.templateContent) {
          setTemplatePreview(emailData.templateContent);
          setIsLoading(false);
          return;
        }

        if (emailData.templateUrl) {
          const response = await fetch(emailData.templateUrl);

          if (!response.ok) {
            throw new Error(`Failed to load template: ${response.status}`);
          }

          const content = await response.text();
          setTemplatePreview(content);
        } else if (emailData.templateId) {
          setError("Template content not available. Please select a template first.");
        } else {
          setError("No template selected.");
        }
      } catch (err: any) {
        console.error("Error loading template:", err);
        setError(`Error loading template: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplatePreview();
  }, [emailData.templateContent, emailData.templateUrl, emailData.templateId]);

  const getDisplayValue = (value: string | null | File[] | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return "No data provided";
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.map(file => file.name).join(", ") : "No files attached";
    }

    return value;
  };

  const handleCloseFullPreview = () => {
    setShowFullPreview(false);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail className="w-6 h-6" /> Email Details
      </h2>

      <div className="mb-8">
        <div className="space-y-4">
          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Subject:</p>
            <p className="text-gray-600">{emailData.subject || "No subject provided"}</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">From:</p>
            <p className="text-gray-600">
              {emailData.senderName} &lt;{emailData.localPart || "noreply"}@aws-educate.tw&gt;
            </p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">To:</p>
            <p className="text-gray-600">Recipients from sheet file</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Template:</p>
            <p className="text-gray-600">
              {emailData.templateName || getDisplayValue(emailData.templateId)}
            </p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Sheet file:</p>
            <p className="text-gray-600">{getDisplayValue(emailData.sheetFileName)}</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Local part:</p>
            <p className="text-gray-600">{emailData.localPart || "No local part provided"}</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Reply to:</p>
            <p className="text-gray-600">{emailData.replyTo || "No reply-to email provided"}</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">BCC:</p>
            <p className="text-gray-600">{emailData.bcc || "No BCC recipients"}</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">CC:</p>
            <p className="text-gray-600">{emailData.cc || "No CC recipients"}</p>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center">
            <p className="font-semibold text-gray-800">Attach files:</p>
            <p className="text-gray-600">
              {emailData.attachments.length > 0
                ? emailData.attachments.map(file => file.name).join(", ")
                : "No files attached"}
            </p>
          </div>

          <div className="flex items-start">
            <p className="font-semibold text-gray-800 min-w-[180px]">
              Provide a certification of participation?:
            </p>
            <p className="text-gray-600 ml-2">
              {emailData.provideCertification === "yes" ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 bg-[#f5f5f4] whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <svg
                  className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.497-1.32A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2 text-gray-500">Loading template preview...</span>
              </div>
            ) : error ? (
              <div className="text-red-500 p-4">
                <p>{error}</p>
              </div>
            ) : templatePreview ? (
              emailData.templateUrl ? (
                <IframePreview
                  src={emailData.templateUrl}
                  title="Email Template Preview"
                  width="100%"
                  height="350px"
                />
              ) : (
                <IframePreview
                  src={`data:text/html;charset=utf-8,${encodeURIComponent(templatePreview)}`}
                  title="Email Template Preview"
                  width="100%"
                  height="350px"
                />
              )
            ) : (
              <p className="text-gray-500 italic">No template preview available</p>
            )}
          </div>
        </div>
      </div>

      {showFullPreview && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 p-20">
          <div className="bg-yellow-400 rounded-lg shadow-2xl p-8 pb-12 w-full h-full relative">
            <button onClick={handleCloseFullPreview} className="absolute top-8 right-8 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
            <div className="w-full h-full p-2 flex flex-col">
              <p className="text-2xl text-white">Preview Html</p>
              {emailData.templateUrl ? (
                <IframePreview
                  src={emailData.templateUrl}
                  title="Email Template Preview"
                  width="100%"
                  height="100%"
                />
              ) : templatePreview ? (
                <IframePreview
                  src={`data:text/html;charset=utf-8,${encodeURIComponent(templatePreview)}`}
                  title="Email Template Preview"
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

      <div className="flex justify-end mt-8">
        <button
          className="px-6 py-2 bg-[#1a2f4a] text-white rounded flex items-center hover:bg-[#1a2f4a]/90"
          onClick={handleSendEmail}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Sending...
              <svg
                className="animate-spin ml-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.497-1.32A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </>
          ) : (
            <>
              Send Email <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
