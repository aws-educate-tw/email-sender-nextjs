"use client";
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
      template_file_id: emailData.templateFileId,
      spreadsheet_file_id: emailData.spreadsheetFileId,
      recipient_source: "SPREADSHEET",
      is_generate_certificate: emailData.provideCertification === "yes",
    };

    if (emailData.localPart?.trim()) {
      formData.sender_local_part = emailData.localPart.trim();
    }

    if (emailData.replyTo?.trim()) {
      formData.reply_to = emailData.replyTo.trim();
    }

    if (emailData.bcc?.length > 0) {
      formData.bcc = emailData.bcc;
    }

    if (emailData.cc?.length > 0) {
      formData.cc = emailData.cc;
    }

    if (emailData.attachments?.length > 0) {
      formData.attachment_file_ids = emailData.attachments.map(file => file.file_id);
    }

    try {
      console.log("Submitting form data:", formData);
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
        onSubmit(); // ✅ success callback
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
        if (emailData.templateFileUrl) {
          const response = await fetch(emailData.templateFileUrl);
          if (!response.ok) {
            throw new Error(`Failed to load template: ${response.status}`);
          }
          const content = await response.text();
          setTemplatePreview(content);
        } else {
          setError("No template URL provided.");
        }
      } catch (err: any) {
        console.error("Error loading template:", err);
        setError(`Error loading template: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplatePreview();
  }, [emailData.templateFileUrl]);

  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-[180px_1fr] items-start">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-gray-600 break-words">{value || "—"}</p>
    </div>
  );

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Mail className="w-6 h-6" /> Email Details
      </h2>

      <div className="space-y-4 mb-8">
        <InfoRow label="Subject:" value={emailData.subject} />
        <InfoRow
          label="From:"
          value={`${emailData.senderName} <${emailData.localPart || "noreply"}@aws-educate.tw>`}
        />
        <InfoRow label="To:" value="Recipients from sheet file" />
        <InfoRow label="Template Name:" value={emailData.templateFileName} />
        <InfoRow label="Template File ID:" value={emailData.templateFileId} />
        <InfoRow label="Sheet File Name:" value={emailData.spreadsheetFileName} />
        <InfoRow label="Sheet File ID:" value={emailData.spreadsheetFileId} />
        <InfoRow label="Reply To:" value={emailData.replyTo} />
        <InfoRow label="BCC:" value={emailData.bcc?.join(", ") || "None"} />
        <InfoRow label="CC:" value={emailData.cc?.join(", ") || "None"} />
        <InfoRow
          label="Attachments:"
          value={
            emailData.attachments?.length
              ? emailData.attachments.map(file => file.file_id).join(", ")
              : "None"
          }
        />
        <InfoRow
          label="Certificate of Participation:"
          value={emailData.provideCertification === "yes" ? "Yes" : "No"}
        />
      </div>

      <div className="mb-6">
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 bg-[#f5f5f4] min-h-[300px] max-h-[400px] overflow-auto">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading template preview...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : templatePreview ? (
              <IframePreview
                src={`data:text/html;charset=utf-8,${encodeURIComponent(templatePreview)}`}
                title="Email Template Preview"
                width="100%"
                height="350px"
              />
            ) : (
              <p className="text-gray-500 italic">No template preview available</p>
            )}
          </div>
        </div>
      </div>

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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.497-1.32A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
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
