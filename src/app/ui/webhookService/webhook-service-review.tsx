import React, { useState } from "react";
import {
  Send,
  Mail,
  User,
  Webhook,
  Link2,
  Hash,
  Key,
  Award,
  Paperclip,
  Users,
  Reply,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { WebhookDataType } from "@/app/ui/webhookService/type";
import { submitWebhookForm } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface WebhookServiceReviewProps {
  webhookData: WebhookDataType;
}

interface SubmitResponse {
  status: string;
  message: string;
  data?: { webhook_id: string; webhook_url: string };
  errors?: { path: string; message: string }[];
}

export default function WebhookServiceReview({ webhookData }: WebhookServiceReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    status: "success" | "error" | null;
    message: string;
    webhookUrl?: string;
  }>({ status: null, message: "" });
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formData = {
        subject: webhookData.subject,
        display_name: webhookData.senderName,
        template_file_id: webhookData.templateFileId,
        surveycake_link: webhookData.surveycakeLink,
        hash_key: webhookData.hashKey,
        iv_key: webhookData.ivKey,
        webhook_type: webhookData.webhookType,
        ...(webhookData.webhookName && { webhook_name: webhookData.webhookName }),
        ...(webhookData.localPart && { sender_local_part: webhookData.localPart }),
        ...(webhookData.replyTo && { reply_to: webhookData.replyTo }),
        ...(webhookData.bcc.length > 0 && { bcc: webhookData.bcc }),
        ...(webhookData.cc.length > 0 && { cc: webhookData.cc }),
        ...(webhookData.attachments.length > 0 && {
          attachment_file_ids: webhookData.attachments.map(att => att.file_id),
        }),
        is_generate_certificate: webhookData.provideCertification === "yes",
      };

      const response = await submitWebhookForm(
        JSON.stringify(formData),
        localStorage.getItem("access_token") || ""
      );

      if (response.status === "success") {
        setSubmitResult({
          status: "success",
          message: "Webhook created successfully!",
          webhookUrl: response.data?.webhook_url,
        });
      } else {
        setSubmitResult({
          status: "error",
          message: response.message || "Failed to create webhook",
        });
      }
    } catch (error: any) {
      setSubmitResult({
        status: "error",
        message: "Unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitResult.status === "success") {
    return (
      <div className="flex flex-col gap-4 border-2 border-green-200 rounded-lg p-6 pb-10 mb-4 bg-green-50 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Webhook Created Successfully!</h2>
        <p className="text-gray-600 mb-6 text-center">{submitResult.message}</p>
        {submitResult.webhookUrl && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Webhook URL:</p>
            <p className="text-sm text-gray-600 break-all">{submitResult.webhookUrl}</p>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/webhookRecords")}
            className="px-6 py-3 bg-[#1a2f4a] text-white rounded-lg hover:bg-[#152238] transition-colors font-medium"
          >
            View Webhooks
          </button>
          <button
            onClick={() => router.push("/webhookService?step=start-option")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  if (submitResult.status === "error") {
    return (
      <div className="flex flex-col gap-4 border-2 border-red-200 rounded-lg p-6 pb-10 mb-4 bg-red-50 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Failed to Create Webhook</h2>
        <p className="text-gray-600 mb-6 text-center">{submitResult.message}</p>
        <div className="flex justify-center">
          <button
            onClick={() => setSubmitResult({ status: null, message: "" })}
            className="px-6 py-3 bg-[#1a2f4a] text-white rounded-lg hover:bg-[#152238] transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border-2 border-gray-100 rounded-lg p-6 pb-10 mb-4 bg-white shadow-lg">
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold ${webhookData.subject ? "" : "text-red-500 italic underline"}`}
        >
          {webhookData.subject || "Subject is missing!"}
        </h1>
      </div>
      <div className="flex gap-2 items-center">
        <div className="p-1 bg-sky-950 rounded-full">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <div
            className={`font-semibold ${webhookData.senderName ? "" : "text-red-500 italic underline"}`}
          >
            {webhookData.senderName || "Sender Name is missing"}
          </div>
          <div className="text-gray-500">{`${webhookData.localPart || "cloudambassador"}@aws-educate.tw`}</div>
        </div>
      </div>

      <hr className="border-t border-gray-200 my-4" />

      {/* Template and Webhook Configuration */}
      <div>
        <p className="text-xl font-bold">Webhook Configuration</p>
      </div>
      <div className="flex flex-wrap w-full gap-4 mb-6">
        <div className="bg-purple-50 flex flex-col md:flex-row justify-between items-start md:items-center border-2 border-gray-200 rounded-lg p-4 md:p-6 w-full">
          <div className="flex gap-4 items-center">
            <Webhook className="w-8 h-8 text-purple-600" />
            <div>
              <div className="font-semibold">Webhook Type</div>
              <div className="text-gray-500 capitalize">
                {webhookData.webhookType || "Not specified"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 flex flex-col md:flex-row justify-between items-start md:items-center border-2 border-gray-200 rounded-lg p-4 md:p-6 w-full">
          <div className="flex gap-4 items-center">
            <Link2 className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold">Surveycake Link</div>
              <div className="text-gray-500 break-all">
                {webhookData.surveycakeLink || "Not specified"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Keys */}
      <div>
        <p className="text-xl font-bold">Authentication Keys</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2 mb-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="font-semibold flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Hash Key
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-950 text-white font-bold text-xl">
                H
              </div>
              <div className="text-gray-500 font-mono text-sm">
                {webhookData.hashKey ? `${webhookData.hashKey.slice(0, 20)}...` : "Not specified"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="font-semibold flex items-center gap-2">
            <Key className="w-4 h-4" />
            IV Key
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-950 text-white font-bold text-xl">
                I
              </div>
              <div className="text-gray-500 font-mono text-sm">
                {webhookData.ivKey ? `${webhookData.ivKey.slice(0, 20)}...` : "Not specified"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div>
        <p className="text-xl font-bold">Email Settings</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3 mb-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="font-semibold">Reply To</div>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-950 text-white font-bold text-xl uppercase">
                {webhookData.replyTo ? webhookData.replyTo.split("@")[0].split(".")[0][0] : "A"}
              </div>
              <div className="text-gray-500">
                {webhookData.replyTo || "awseducate.cloudambassador@gmail.com"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="font-semibold">BCC</div>
          <div className="flex w-full items-start">
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-2">
                {webhookData.bcc && Array.isArray(webhookData.bcc) && webhookData.bcc.length > 0 ? (
                  webhookData.bcc.map((bcc: string, idx: number) => (
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
                {webhookData.cc && Array.isArray(webhookData.cc) && webhookData.cc.length > 0 ? (
                  webhookData.cc.map((cc: string, idx: number) => (
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

        <div className="flex flex-col gap-4 w-full">
          <div className="font-semibold">Generate Certificate</div>
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-950 text-white font-bold text-xl">
                {webhookData.provideCertification === "yes" ? <Award className="w-4 h-4" /> : "N"}
              </div>
              <div className="text-gray-500 capitalize">
                {webhookData.provideCertification || "no"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments */}
      {webhookData.attachments && webhookData.attachments.length > 0 && (
        <>
          <div>
            <p className="text-xl font-bold">Attachments</p>
          </div>
          <div className="flex flex-col gap-2 mb-6">
            {webhookData.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Paperclip className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{attachment.file_name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center px-8 py-3 bg-[#1a2f4a] text-white rounded-lg hover:bg-[#152238] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              Creating...
            </>
          ) : (
            <>
              Create Webhook
              <Send className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
