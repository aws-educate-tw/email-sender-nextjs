import React, { useState } from "react";
import {
  Send,
  Mail,
  X,
  Check,
  AlertCircle,
  Paperclip,
  CornerDownRight,
  Users,
  FileText,
  Database,
  Table,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { submitForm } from "@/lib/actions";
import Modal from "@/app/ui/emailService/modal";
import SpreadsheetPreview from "@/app/ui/emailService/spreadsheet-preview";
import TemplatePreview from "@/app/ui/emailService/template-preview";
import { EmailDataType } from "@/app/emailService/page";

interface ReviewProps {
  emailData: EmailDataType;
  onSubmit: () => void;
}

export default function EmailServiceReview({ emailData, onSubmit }: ReviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);

  const handleSend = async () => {
    setIsSubmitting(true);
    setIsSuccess(false);

    const formData: any = {
      subject: emailData.subject,
      display_name: emailData.senderName,
      template_file_id: emailData.templateFileId,
      spreadsheet_file_id: emailData.spreadsheetFileId,
      recipient_source: "SPREADSHEET",
      is_generate_certificate: emailData.provideCertification === "yes",
    };

    if (emailData.localPart?.trim()) formData.sender_local_part = emailData.localPart.trim();
    if (emailData.replyTo?.trim()) formData.reply_to = emailData.replyTo.trim();
    if (emailData.cc?.length) formData.cc = emailData.cc;
    if (emailData.bcc?.length) formData.bcc = emailData.bcc;
    if (emailData.attachments?.length)
      formData.attachment_file_ids = emailData.attachments.map(f => f.file_id);

    try {
      const token = localStorage.getItem("access_token") || "";
      const res = await submitForm(JSON.stringify(formData), token);

      if (res.status === "error" && res.errors) {
        const newErrors: { [key: string]: string } = {};
        res.errors.forEach((e: any) => (newErrors[e.path] = e.message));
        setFormErrors(newErrors);
        setError(res.message || "Error submitting form");
      } else {
        setIsSuccess(true);
        setFormErrors({});
        setTimeout(() => onSubmit(), 2000);
      }
    } catch (err: any) {
      setError("Submission failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex gap-3 items-start p-3 rounded-lg hover:bg-slate-50">
      {icon && <div className="text-slate-500 mt-0.5">{icon}</div>}
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <div className="text-slate-900 font-medium break-words">
          {value || <span className="italic text-slate-400">Not set</span>}
        </div>
      </div>
    </div>
  );

  const AttachmentItem = ({ name, type }: { name: string; type: "file" | "certificate" }) => (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded text-sm mb-2">
      {type === "certificate" ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Paperclip className="w-4 h-4 text-slate-500" />
      )}
      <span className="font-medium text-slate-700">{name}</span>
    </div>
  );

  return (
    <div className="flex">
      <Card className="border border-slate-200 shadow-lg">
        {/* Header */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              Email Preview
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="space-y-2 bg-gray-100">
              <InfoRow
                icon={<FileText className="w-5 h-5" />}
                label="Subject"
                value={emailData.subject}
              />
              <InfoRow
                icon={<Mail className="w-5 h-5" />}
                label="Sender Name and Local Part"
                value={
                  <span>
                    {emailData.senderName} &lt;{emailData.localPart || "aws"}@aws-educate.tw&gt;
                  </span>
                }
              />
              <InfoRow
                icon={<CornerDownRight className="w-5 h-5" />}
                label="Reply To"
                value={emailData.replyTo || "noreply"}
              />
            </div>
            <div className="space-y-2">
              <InfoRow
                icon={<FileText className="w-5 h-5" />}
                label="Template Name"
                value={
                  <div className="flex justify-between items-center">
                    <span>{emailData.templateFileName}</span>
                    {emailData.templateFileUrl && (
                      <button
                        onClick={() => setShowTemplateModal(true)}
                        className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    )}
                  </div>
                }
              />
              <InfoRow
                icon={<Database className="w-5 h-5" />}
                label="Spreadsheet Name"
                value={
                  <div className="flex justify-between items-center">
                    <span>{emailData.spreadsheetFileName}</span>
                    {emailData.spreadsheetFileUrl && (
                      <button
                        onClick={() => setShowSpreadsheetModal(true)}
                        className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    )}
                  </div>
                }
              />
              <InfoRow
                icon={<Users className="w-5 h-5" />}
                label="CC"
                value={emailData.cc?.join(", ") || null}
              />
              <InfoRow
                icon={<Users className="w-5 h-5" />}
                label="BCC"
                value={emailData.bcc?.join(", ") || null}
              />
            </div>
            <div className="space-y-2">
              <InfoRow
                icon={<Paperclip className="w-5 h-5" />}
                label="Attachments"
                value={
                  emailData.attachments?.length ? (
                    <div className="space-y-1">
                      {emailData.attachments.map((f, i) => (
                        <div key={i} className="text-sm py-1">
                          {f.file_id}
                        </div>
                      ))}
                    </div>
                  ) : null
                }
              />
              <InfoRow
                icon={<Check className="w-5 h-5" />}
                label="Certificate"
                value={
                  <span
                    className={
                      emailData.provideCertification === "yes" ? "text-green-600" : "text-slate-500"
                    }
                  >
                    {emailData.provideCertification === "yes" ? "Will be provided" : "Not provided"}
                  </span>
                }
              />
            </div>
          </div>
          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              className="border border-slate-300 px-5 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium flex items-center"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </button>
            <button
              className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} ${isSubmitting ? "opacity-80" : ""}`}
              onClick={handleSend}
              disabled={isSubmitting || isSuccess}
            >
              {isSubmitting ? (
                <>
                  <span className="loader mr-2" /> Sending...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" /> Sent
                </>
              ) : (
                <>
                  Send Email <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={showSpreadsheetModal}
        onClose={() => setShowSpreadsheetModal(false)}
        title="Spreadsheet Preview"
      >
        {emailData.spreadsheetFileUrl ? (
          <SpreadsheetPreview fileUrl={emailData.spreadsheetFileUrl} readOnly />
        ) : (
          <p className="italic text-center text-slate-500">No spreadsheet available</p>
        )}
      </Modal>
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Template Preview"
      >
        {emailData.templateFileUrl ? (
          <TemplatePreview fileUrl={emailData.templateFileUrl} />
        ) : (
          <p className="italic text-center text-slate-500">No template available</p>
        )}
      </Modal>
    </div>
  );
}
