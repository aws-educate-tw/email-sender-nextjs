import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Upload,
  Mail,
  User,
  Reply,
  Users,
  Award,
  Paperclip,
  X,
} from "lucide-react";
import HelpTip from "@/app/ui/help-tip";
import EmailInput from "@/app/ui/emailService/email-input";
import AttachDropdown from "@/app/ui/emailService/attach-dropdown";
import { WebhookDataType } from "@/app/ui/webhookService/type";
import FileUpload from "@/app/ui/emailService/file-upload";

interface WebhookServiceSettingsProps {
  onNext: () => void;
  webhookData: WebhookDataType;
  onWebhookDataChange: (data: WebhookDataType) => void;
}

export default function WebhookServiceSettings({
  onNext,
  webhookData,
  onWebhookDataChange,
}: WebhookServiceSettingsProps) {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showOptionalSection, setShowOptionalSection] = useState(false);

  useEffect(() => {
    const hasOptionalValue =
      (webhookData.attachments && webhookData.attachments.length > 0) ||
      webhookData.localPart ||
      webhookData.replyTo ||
      (webhookData.bcc && webhookData.bcc.length > 0) ||
      (webhookData.cc && webhookData.cc.length > 0) ||
      webhookData.provideCertification === "yes";

    if (hasOptionalValue) {
      setShowOptionalSection(true);
    }
  }, [webhookData]);

  return (
    <div className="space-y-6">
      {/* Required Section */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <div className="w-1 h-6 bg-[#1a2f4a] rounded-full mr-3"></div>
          Required
        </h3>

        <div className="space-y-3">
          <label className="flex items-center text-gray-700 font-medium text-sm">
            <Mail size={18} className="mr-2 text-[#1a2f4a]" />
            Subject of the email
            <HelpTip message="Enter the email subject that recipients will see.">
              <Info
                size={16}
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
              />
            </HelpTip>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent transition-all duration-200"
            placeholder="Enter the subject"
            value={webhookData.subject}
            onChange={e => onWebhookDataChange({ ...webhookData, subject: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center text-gray-700 font-medium text-sm">
            <User size={18} className="mr-2 text-[#1a2f4a]" />
            Name of the sender
            <HelpTip message="Enter the sender's name as it will appear to recipients.">
              <Info
                size={16}
                className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
              />
            </HelpTip>
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent transition-all duration-200"
            placeholder="Enter the name"
            value={webhookData.senderName}
            onChange={e => onWebhookDataChange({ ...webhookData, senderName: e.target.value })}
          />
        </div>
      </div>

      {/* Optional Section */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-between">
          <div className="flex justify-start items-center">
            <div className="w-1 h-6 bg-gray-400 rounded-full mr-3"></div>
            <p className="text-gray-500">Optional</p>
            <button
              onClick={() => setShowOptionalSection(!showOptionalSection)}
              className="flex items-center gap-2 text-gray-500 p-2 hover:text-gray-800"
            >
              {showOptionalSection ? (
                <>
                  <ChevronUp size={20} />
                </>
              ) : (
                <>
                  <ChevronDown size={20} />
                </>
              )}
            </button>
          </div>
        </h3>
        {showOptionalSection && (
          <div className="space-y-6">
            {/* File attachments */}
            <label className="flex items-center text-gray-700 font-medium text-sm">
              <Paperclip size={18} className="mr-2 text-gray-600" />
              Attachments
              <HelpTip message="Upload files with the button on the right and select them from the dropdown.">
                <Info
                  size={16}
                  className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
                />
              </HelpTip>
            </label>
            <div className="flex items-center gap-3">
              <AttachDropdown
                value={webhookData.attachments}
                onChange={attachments => {
                  onWebhookDataChange({ ...webhookData, attachments });
                }}
              />
              <button
                type="button"
                onClick={() => setShowFileUpload(true)}
                className="inline-flex gap-2 items-center px-2 py-1 text-sky-950 rounded-lg hover:text-gray-400 transition-all duration-200 font-medium"
              >
                <Upload size={18} />
                Upload
              </button>
            </div>

            {/* Sender Local Part */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-sm">
                <Mail size={18} className="mr-2 text-gray-600" />
                Sender Local Part
                <HelpTip message="Enter the prefix for your email address (e.g., if you enter john.doe, the email will be john.doe@aws-educate.tw). This setting will affect the forwarding rules.">
                  <Info
                    size={16}
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
                  />
                </HelpTip>
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow px-4 py-3 border border-gray-200 border-r-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#1a2f4a] focus:border-transparent focus:z-10 transition-all duration-200"
                  placeholder="Enter the local part of email"
                  value={webhookData.localPart}
                  onChange={e => onWebhookDataChange({ ...webhookData, localPart: e.target.value })}
                />
                <div className="bg-gray-100 px-4 py-3 border border-gray-200 rounded-r-lg text-gray-500 font-medium">
                  @aws-educate.tw
                </div>
              </div>
            </div>

            {/* Reply To */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-sm">
                <Reply size={18} className="mr-2 text-gray-600" />
                Reply To
                <HelpTip message="The email address where replies from recipients will be sent.">
                  <Info
                    size={16}
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
                  />
                </HelpTip>
              </label>
              <EmailInput
                allowMultiple={false}
                value={webhookData.replyTo ? [webhookData.replyTo] : []}
                onEmailsChange={emails =>
                  onWebhookDataChange({ ...webhookData, replyTo: emails[0] || "" })
                }
              />
            </div>

            {/* BCC */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-sm">
                <Users size={18} className="mr-2 text-gray-600" />
                BCC
                <HelpTip message="Add email addresses to send blind carbon copies.">
                  <Info
                    size={16}
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
                  />
                </HelpTip>
              </label>
              <EmailInput
                allowMultiple
                value={webhookData.bcc}
                onEmailsChange={emails => onWebhookDataChange({ ...webhookData, bcc: emails })}
              />
            </div>

            {/* CC */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-sm">
                <Users size={18} className="mr-2 text-gray-600" />
                CC
                <HelpTip message="Add email addresses to send carbon copies. Recipients will see these addresses.">
                  <Info
                    size={16}
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
                  />
                </HelpTip>
              </label>
              <EmailInput
                allowMultiple
                value={webhookData.cc}
                onEmailsChange={emails => onWebhookDataChange({ ...webhookData, cc: emails })}
              />
            </div>

            {/* Certification */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-sm">
                <Award size={18} className="mr-2 text-gray-600" />
                Provide a certification of participation?
                <HelpTip message="Select Yes or No if you want to provide a certification. Note: If you select Yes, the Excel file must include two columns: Name and Certificate Text.">
                  <Info
                    size={16}
                    className="ml-2 text-gray-400 hover:text-gray-600 cursor-help transition-colors"
                  />
                </HelpTip>
              </label>
              <div className="flex gap-6">
                <label className="inline-flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    className="w-4 h-4 text-[#1a2f4a] border-gray-300 focus:ring-[#1a2f4a] focus:ring-2"
                    name="certification"
                    value="yes"
                    checked={webhookData.provideCertification === "yes"}
                    onChange={() =>
                      onWebhookDataChange({ ...webhookData, provideCertification: "yes" })
                    }
                  />
                  <span className="ml-2 font-medium text-gray-700 group-hover:text-gray-900">
                    Yes
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    className="w-4 h-4 text-[#1a2f4a] border-gray-300 focus:ring-[#1a2f4a] focus:ring-2"
                    name="certification"
                    value="no"
                    checked={webhookData.provideCertification === "no"}
                    onChange={() =>
                      onWebhookDataChange({
                        ...webhookData,
                        provideCertification: "no",
                      })
                    }
                  />
                  <span className="ml-2 font-medium text-gray-700 group-hover:text-gray-900">
                    No
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          className="px-4 py-3 bg-[#1a2f4a] text-white rounded-lg flex items-center gap-2 hover:bg-[#2c4a72] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          onClick={() => {
            onWebhookDataChange?.(webhookData);
            onNext();
          }}
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-5xl relative">
            <button
              onClick={() => setShowFileUpload(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <FileUpload OnFileExtension="any" />
          </div>
        </div>
      )}
    </div>
  );
}
