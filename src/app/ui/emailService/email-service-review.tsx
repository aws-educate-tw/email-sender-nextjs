import React, { useState } from "react";
import { Send, X, Check, Paperclip, User, FileText, Table, Download } from "lucide-react";
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
    label: React.ReactNode;
    value: React.ReactNode;
  }) => (
    <div className="flex w-full gap-3 items-center p-3 rounded-lg">
      {icon && <div className="text-sky-950 bg-gray-200 p-2 rounded-lg">{icon}</div>}
      <div className="flex flex-col w-full">
        <div className="underline">{label}</div>
        <div className="text-slate-900 font-medium break-words">
          {value ? (
            <span className="text-slate-400">{value}</span>
          ) : (
            <span className="italic text-slate-400">Not set</span>
          )}
        </div>
      </div>
    </div>
  );

  // const AttachmentItem = ({ name, type }: { name: string; type: "file" | "certificate" }) => (
  //   <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded text-sm mb-2">
  //     {type === "certificate" ? (
  //       <Check className="w-4 h-4 text-green-500" />
  //     ) : (
  //       <Paperclip className="w-4 h-4 text-slate-500" />
  //     )}
  //     <span className="font-medium text-slate-700">{name}</span>
  //   </div>
  // );

  return (
    <>
      <div className="flex flex-col gap-4 border-2 border-gray-100 rounded-lg p-6 pb-10 mb-4">
        {/* Header */}
        <div>
          <h1
            className={`text-3xl font-bold ${emailData.subject ? "" : "text-red-500 italic underline"}`}
          >
            {emailData.subject || "Subject is missing!"}
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <div className="p-1 bg-sky-950 rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="font-semibold">{emailData.senderName}</div>
            <div className="text-gray-500">{`${emailData.localPart || "aws"}@aws-educate.tw`}</div>
          </div>
        </div>

        <hr className="border-t border-gray-200 my-4" />

        {/* Template and Spreadsheet */}
        <div>
          <p className="text-xl font-bold">Selected Template and Spreadsheet</p>
        </div>
        <div className="flex w-full gap-4 mb-6">
          <div className="bg-blue-50 flex w-full justify-between items-center border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Template</div>
                <div
                  className={
                    emailData.templateFileName ? "text-gray-500" : "text-red-500 italic underline"
                  }
                >
                  {emailData.templateFileName || "No template selected"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="bg-white shadow-md hover:shadow-lg text-blue-500 hover:text-blue-600 font-semibold border border-gray-200 px-4 py-1 rounded-full"
            >
              view
            </button>
          </div>
          <div className="bg-green-50 flex w-full justify-between items-center border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div>
                <Table className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">Spreadsheet</div>
                <div
                  className={
                    emailData.spreadsheetFileName
                      ? "text-gray-500"
                      : "text-red-500 italic underline"
                  }
                >
                  {emailData.spreadsheetFileName || "No spreadsheet selected"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSpreadsheetModal(true)}
              className="bg-white shadow-md hover:shadow-lg text-green-500 hover:text-green-600 font-semibold border border-gray-200 px-4 py-1 rounded-full"
            >
              view
            </button>
          </div>
        </div>

        {/* Settings */}
        <div>
          <p className="text-xl font-bold">Settings</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="flex flex-col gap-4 w-full">
            <div className="font-semibold">Reply To</div>
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-2">
                <div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-950 text-white font-bold text-xl uppercase">
                    {emailData.replyTo ? emailData.replyTo.split("@")[0].split(".")[0][0] : "A"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">
                    {emailData.replyTo || "awseducate.cloudambassador@gmail.com"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="font-semibold">BCC</div>
            <div className="flex w-full items-start">
              <div className="flex flex-col items-start">
                <div className="flex flex-col gap-2">
                  {emailData.bcc && Array.isArray(emailData.bcc) && emailData.bcc.length > 0 ? (
                    emailData.bcc.map((bcc: string, idx: number) => (
                      <div className="flex items-center gap-2" key={idx}>
                        <div
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-950 text-white text-xl font-bold uppercase"
                          title={bcc}
                        >
                          {bcc.split("@")[0].split(".")[0][0] || "N"}
                        </div>
                        <p className="text-gray-500">{bcc}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 opacity-30">
                      <User className="w-8 h-8 p-1 flex items-center justify-center rounded-full bg-sky-950 text-white text-xl font-bold" />
                      <p className="text-gray-500">No BCC</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div className="font-semibold">CC</div>
            <div className="flex w-full items-start">
              <div className="flex flex-col items-start">
                <div className="flex flex-col gap-2">
                  {emailData.cc && Array.isArray(emailData.cc) && emailData.cc.length > 0 ? (
                    emailData.cc.map((cc: string, idx: number) => (
                      <div className="flex items-center gap-2" key={idx}>
                        <div
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-950 text-white text-xl font-bold uppercase"
                          title={cc}
                        >
                          {cc.split("@")[0].split(".")[0][0] || "N"}
                        </div>
                        <p className="text-gray-500">{cc}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 opacity-30">
                      <User className="w-8 h-8 p-1 flex items-center justify-center rounded-full bg-sky-950 text-white text-xl font-bold" />
                      <p className="text-gray-500">No CC</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div>
          <p className="text-xl font-bold">Attachments</p>
        </div>
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          {emailData.attachments && emailData.attachments.length > 0 ? (
            emailData.attachments.map((attachment, idx) => (
              <button
                key={idx}
                className="flex items-center justify-between gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = attachment.file_url;
                  link.download = attachment.file_name || "attachment";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <div className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-sky-950" />
                  <span className="text-gray-700">{attachment.file_name}</span>
                </div>
                <Download className="w-5 h-5 text-sky-950" />
              </button>
            ))
          ) : (
            <div className="text-gray-500 italic">No attachments</div>
          )}
        </div>

        {/* Certification */}
        <div>
          <p className="text-xl font-bold">Certification</p>
        </div>
        <div>
          <div className="flex items-center gap-2 rounded-lg opacity-60">
            <div
              className={`p-1 rounded-full ${emailData.provideCertification === "yes" ? "bg-green-500" : "bg-red-500"}`}
            >
              {emailData.provideCertification === "yes" ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <X className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="">
              {emailData.provideCertification === "yes"
                ? "Certification will be generated for recipients."
                : "No certification will be generated."}
            </div>
          </div>
        </div>

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

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          className={`px-4 py-2.5 rounded-lg text-white font-medium flex items-center ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-sky-950 hover:bg-sky-900"} ${isSubmitting ? "opacity-80" : ""}`}
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
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send
            </div>
          )}
        </button>
      </div>
    </>
  );
}
