import React, { useState, useEffect, use } from "react";
import { ArrowRight, Info, ChevronDown } from "lucide-react";
import HelpTip from "@/app/ui/help-tip";
import EmailInput from "@/app/ui/email-input";

interface SettingProps {
  onNext: () => void;
  templateFileName?: string | null;
  templateFileId?: string | null;
  templateFileUrl?: string | null;
  spreadsheetFileName?: string | null;
  spreadsheetFileId?: string | null;
  spreadsheetFileUrl?: string | null;
}

export default function EmailServiceSetting({
  onNext,
  templateFileName,
  templateFileId,
  templateFileUrl,
  spreadsheetFileName,
  spreadsheetFileId,
  spreadsheetFileUrl,
}: SettingProps) {
  const [emailData, setEmailData] = useState({
    subject: "",
    senderName: "",
    templateFileName: templateFileName || null,
    templateFileId: templateFileId || null,
    templateFileUrl: templateFileUrl || null,
    spreadsheetFileName: spreadsheetFileName || null,
    spreadsheetFileId: spreadsheetFileId || null,
    spreadsheetFileUrl: spreadsheetFileUrl || null,
    localPart: "",
    replyTo: "",
    bcc: [] as string[],
    cc: [] as string[],
    provideCertification: "no",
  });

  const updateEmailData = (newData: Partial<typeof emailData>) => {
    setEmailData(prevData => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-2">
      <div className="p-6 pb-4">
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Required</h3>

          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div>
              <label className="mb-2 flex items-center text-gray-700">
                Subject of the email
                <HelpTip message="Enter the email subject that recipients will see.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                placeholder="Enter the subject"
                value={emailData.subject}
                onChange={e => updateEmailData({ subject: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center text-gray-700">
                Name of the sender
                <HelpTip message="Enter the sender's name as it will appear to recipients.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                placeholder="Enter the name"
                value={emailData.senderName}
                onChange={e => updateEmailData({ senderName: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Optional</h3>

          <div className="space-y-6">
            <div>
              <label className="mb-2 flex items-center text-gray-700">
                Sender Local Part
                <HelpTip message="Enter the prefix for your email address (e.g., if you enter john.doe, the email will be john.doe@aws-educate.tw). This setting will affect the forwarding rules.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-grow p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                  placeholder="Enter the local part of email"
                  value={emailData.localPart}
                  onChange={e => updateEmailData({ localPart: e.target.value })}
                />
                <div className="bg-gray-100 p-3 border border-l-0 border-gray-300 rounded-r text-gray-500">
                  @aws-educate.tw
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center text-gray-700">
                Reply To
                <HelpTip message="The email address where replies from recipients will be sent.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <EmailInput
                allowMultiple={false}
                initialEmails={emailData.replyTo}
                onEmailsChange={emails => updateEmailData({ replyTo: emails[0] || "" })}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center text-gray-700">
                BCC
                <HelpTip message="Add email addresses to send blind carbon copies.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <EmailInput
                allowMultiple={true}
                initialEmails={emailData.bcc}
                onEmailsChange={emails => updateEmailData({ bcc: emails })}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center text-gray-700">
                CC
                <HelpTip message="Add email addresses to send carbon copies. Recipients will see these addresses.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <EmailInput
                allowMultiple={true}
                initialEmails={emailData.cc}
                onEmailsChange={emails => updateEmailData({ cc: emails })}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center text-gray-700">
                Provide a certification of participation?{" "}
                <HelpTip message="Select Yes or No if you want to provide a certification. Note: If you select Yes, the Excel file must include two columns: Name and Certificate Text.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="certification"
                    value="yes"
                    checked={emailData.provideCertification === "yes"}
                    onChange={() => updateEmailData({ provideCertification: "yes" })}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="certification"
                    value="no"
                    checked={emailData.provideCertification === "no"}
                    onChange={() => updateEmailData({ provideCertification: "no" })}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end p-6">
        <button
          className="px-6 py-2 bg-[#1a2f4a] text-white rounded flex items-center hover:bg-[#2c4a72]"
          onClick={onNext}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
