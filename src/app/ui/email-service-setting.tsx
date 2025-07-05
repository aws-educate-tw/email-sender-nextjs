import React, { useState, useEffect } from "react";
import { ArrowRight, Info, ChevronDown } from "lucide-react";
import { useEmailContext } from "@/app/context/EmailContext";
import IframePreview from "@/app/ui/iframe-preview";
import HelpTip from "@/app/ui/help-tip";

interface SettingProps {
  onNext: () => void;
}

export const EmailServiceSetting: React.FC<SettingProps> = ({ onNext }) => {
  const { emailData, updateEmailData } = useEmailContext();
  const [showXlsxUpload, setShowXlsxUpload] = useState<boolean>(false);
  const [previewXlsx, setPreviewXlsx] = useState<boolean>(false);
  const [xlsxPreviewLink, setXlsxPreviewLink] = useState<string | null>("");
  const [selectedTemplateFile, setSelectedTemplateFile] = useState<string | null>(null);
  const [selectedSheetFile, setSelectedSheetFile] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<boolean>(false);
  const [templatePreviewLink, setTemplatePreviewLink] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSheetFile(emailData.sheetFileName || null);
    setSelectedTemplateFile(emailData.templateName);
    setTemplatePreviewLink(emailData.templateUrl || null);
    setXlsxPreviewLink(emailData.sheetFileUrl || null);
  }, [
    emailData.templateId,
    emailData.sheetFileId,
    emailData.templateName,
    emailData.sheetFileName,
    emailData.templateUrl,
    emailData.sheetFileUrl,
  ]);

  const handlePreviewTemplate = () => {
    console.log("嘗試預覽模板:", {
      selectedTemplateFile,
      templatePreviewLink,
    });
    setPreviewHtml(true);
  };

  const handlePreviewTemplateClose = () => {
    setPreviewHtml(false);
  };

  const handlePreviewXlsx = () => {
    if (!xlsxPreviewLink) return;
    setPreviewXlsx(true);
  };

  const handlePreviewXlsxClose = () => {
    setPreviewXlsx(false);
  };

  // const handleXlsxOpenUpload = () => {
  //   setShowXlsxUpload(true);
  // };

  const handleXlsxCloseUpload = () => {
    setShowXlsxUpload(false);
  };

  const DisabledSelect = ({
    value,
    placeholder,
    isActive,
  }: {
    value?: string | null;
    placeholder: string;
    isActive: boolean;
  }) => (
    <div
      className={`flex-1 flex items-center justify-between p-3 border rounded cursor-not-allowed bg-gray-50 ${
        isActive ? "text-gray-400 border-gray-300" : "text-gray-400 border-gray-300"
      }`}
      title={!isActive ? "Please upload in previous step" : ""}
    >
      <span>{value || placeholder}</span>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-2">
      <div className="p-6 pb-4">
        <h2 className="font-bold mb-4">Enter your subject and display name</h2>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Required</h3>

          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div>
              <label className="block mb-2 flex items-center text-gray-700">
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
              <label className="block mb-2 flex items-center text-gray-700">
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

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Select your template file
                <HelpTip message="Choose or upload a .html file that contains the email content.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <div className="flex gap-2">
                <DisabledSelect
                  value={emailData.templateName || selectedTemplateFile}
                  placeholder="Please upload in previous step"
                  isActive={!!(emailData.templateName || selectedTemplateFile)}
                />
                <button
                  onClick={handlePreviewTemplate}
                  className={`px-4 py-2 border rounded ${
                    emailData.templateName || selectedTemplateFile
                      ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!(emailData.templateName || selectedTemplateFile)} // 只檢查模板名稱，不檢查預覽鏈接
                  title={
                    !(emailData.templateName || selectedTemplateFile)
                      ? "Template file not selected"
                      : "Preview template"
                  }
                >
                  preview
                </button>
              </div>
              {!selectedTemplateFile && (
                <p className="text-gray-500 text-sm mt-1 flex items-center">
                  <Info size={12} className="mr-1" /> Template uploaded in previous step
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Select your sheet file
                <HelpTip message="Choose or upload a .xlsx file containing the list of recipients.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <div className="flex gap-2">
                <DisabledSelect
                  value={selectedSheetFile}
                  placeholder="Please upload in previous step"
                  isActive={!!selectedSheetFile}
                />
                <button
                  type="button"
                  onClick={handlePreviewXlsx}
                  className={`px-4 py-2 border rounded ${
                    selectedSheetFile && xlsxPreviewLink
                      ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!selectedSheetFile || !xlsxPreviewLink}
                  title={!selectedSheetFile ? "Sheet file not selected" : "Preview sheet"}
                >
                  preview
                </button>
              </div>
              {!selectedSheetFile && (
                <p className="text-gray-500 text-sm mt-1 flex items-center">
                  <Info size={12} className="mr-1" /> Recipients uploaded in previous step
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Optional</h3>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 flex items-center text-gray-700">
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
              <label className="block mb-2 flex items-center text-gray-700">
                Reply To
                <HelpTip message="The email address where replies from recipients will be sent. You can set this to match the Sender Local Part or customize it.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                placeholder="Type an email and press tab"
                value={emailData.replyTo}
                onChange={e => updateEmailData({ replyTo: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                BCC
                <HelpTip message="Add email addresses to send blind carbon copies.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                placeholder="Type an email and press tab"
                value={emailData.bcc}
                onChange={e => updateEmailData({ bcc: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                CC
                <HelpTip message="Add email addresses to send carbon copies. Recipients will see these addresses.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                placeholder="Type an email and press tab"
                value={emailData.cc}
                onChange={e => updateEmailData({ cc: e.target.value })}
              />
            </div>
            {/* 
            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Attach files
                <HelpTip message="Attach any files you want to include with the email. Note: It is recommended that the total size of attachments does not exceed 5MB.">
                  <Info size={16} className="ml-1 text-gray-400" />
                </HelpTip>
              </label>
              <div className="flex gap-2">
                <SelectDropdown
                  onSelect={(fileId, fileUrl, fileName) =>
                    updateEmailData({ attachments: [...(emailData.attachments || []), fileId] })
                  }
                  fileExtension="*"
                  error=""
                />
                <button className="px-4 py-2 bg-white border-gray-300 rounded hover:bg-gray-50">
                  upload
                </button>
              </div>
            </div> */}

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
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

      {/* Template Preview Modal */}
      {previewHtml && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 p-20">
          <div className="bg-yellow-400 rounded-lg shadow-2xl p-8 pb-12 w-full h-full relative">
            <button
              onClick={handlePreviewTemplateClose}
              className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
            <div className="w-full h-full p-2 flex flex-col">
              <p className="text-2xl text-white font-medium mb-4">Preview Template</p>
              {templatePreviewLink ? (
                <IframePreview
                  src={templatePreviewLink}
                  title="Template Preview"
                  width="100%"
                  height="100%"
                />
              ) : (
                <div className="flex w-full h-full justify-center items-center bg-gray-100 rounded">
                  <p className="text-gray-500">No preview available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Excel Preview Modal */}
      {previewXlsx && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 p-20">
          <div className="bg-green-700 rounded-lg shadow-2xl p-8 pb-12 w-full h-full relative">
            <button onClick={handlePreviewXlsxClose} className="absolute top-8 right-8 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
            <div className="w-full h-full p-2 flex flex-col">
              <p className="text-2xl text-white">Preview xlsx</p>
              {xlsxPreviewLink ? (
                <IframePreview
                  src={`https://view.officeapps.live.com/op/view.aspx?src=${xlsxPreviewLink}`}
                  title="Participants Sheet Preview"
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

      {/* Upload Excel Modal */}
      {showXlsxUpload && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 pb-20 w-full max-w-screen-lg relative">
            <button onClick={handleXlsxCloseUpload} className="absolute top-8 right-8 text-black">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
            <div className="text-2xl font-bold mb-6">Upload Excel File</div>
            <p className="mb-8">Please upload your .xlsx file containing recipient information.</p>
            {/* Import the FileUpload component here */}
            <p className="text-gray-500 mt-4">
              Note: Import the FileUpload component and add it here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
