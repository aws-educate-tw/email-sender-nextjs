import React, { useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { useEmailContext } from "@/app/context/EmailContext";
import SelectDropdown from "@/app/ui/select-dropdown";
import IframePreview from "@/app/ui/iframe-preview";

interface SettingProps {
  onNext: () => void;
}

export const EmailServiceSetting: React.FC<SettingProps> = ({ onNext }) => {
  const { emailData, updateEmailData } = useEmailContext();
  const [showXlsxUpload, setShowXlsxUpload] = useState<boolean>(false);
  const [previewXlsx, setPreviewXlsx] = useState<boolean>(false);
  const [xlsxPreviewLink, setXlsxPreviewLink] = useState<string | null>("");

  // const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const filesArray = Array.from(e.target.files);
  //     updateEmailData({ attachments: [...emailData.attachments, ...filesArray] });
  //   }
  // };

  const handleXlsxSelect = (file_id: string, file_url: string) => {
    updateEmailData({ sheetFile: file_id });
    setXlsxPreviewLink(file_url);
  };

  const handlePreviewXlsx = () => {
    if (!xlsxPreviewLink) return;
    setPreviewXlsx(true);
  };

  const handlePreviewXlsxClose = () => {
    setPreviewXlsx(false);
  };

  const handleXlsxOpenUpload = () => {
    setShowXlsxUpload(true);
  };

  const handleXlsxCloseUpload = () => {
    setShowXlsxUpload(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-2">
      <div className="p-6 pb-4">
        <h2 className="font-bold mb-4">Enter your subject and display name</h2>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Required</h3>

          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Subject of the email <Info size={16} className="ml-1 text-gray-400" />
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
                Name of the sender <Info size={16} className="ml-1 text-gray-400" />
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
                Select your template file <Info size={16} className="ml-1 text-gray-400" />
              </label>
              <div className="flex gap-2">
                <SelectDropdown
                  onSelect={fileId => updateEmailData({ templateFile: fileId })}
                  fileExtension="html"
                  error=""
                />
                <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  preview
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  upload
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Select your sheet file <Info size={16} className="ml-1 text-gray-400" />
              </label>
              <div className="flex gap-2">
                <SelectDropdown onSelect={handleXlsxSelect} fileExtension="xlsx" error="" />
                <button
                  type="button"
                  onClick={handlePreviewXlsx}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  preview
                </button>
                <button
                  type="button"
                  onClick={handleXlsxOpenUpload}
                  className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                  upload
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Optional</h3>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Sender Local Part <Info size={16} className="ml-1 text-gray-400" />
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
                Reply To <Info size={16} className="ml-1 text-gray-400" />
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
                BCC <Info size={16} className="ml-1 text-gray-400" />
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
                CC <Info size={16} className="ml-1 text-gray-400" />
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                placeholder="Type an email and press tab"
                value={emailData.cc}
                onChange={e => updateEmailData({ cc: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Attach files <Info size={16} className="ml-1 text-gray-400" />
              </label>
              <div className="flex gap-2">
                <SelectDropdown
                  onSelect={fileId => updateEmailData({ templateFile: fileId })}
                  fileExtension="html"
                  error=""
                />
                <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
                  upload
                </button>
              </div>
              {/* <div className="flex gap-2">
                <div className="relative flex-grow">
                  <select className="w-full p-3 border border-gray-300 rounded appearance-none bg-white pr-8 focus:outline-none focus:ring-gray-400 focus:border-gray-400">
                    <option>Attach your files</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded">
                  upload
                </button>
              </div> */}
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Provide a certification of participation?{" "}
                <Info size={16} className="ml-1 text-gray-400" />
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

      <div className="flex justify-end p-6 border-gray-200">
        <button
          className="px-6 py-2 bg-[#1a2f4a] text-white rounded flex items-center hover:bg-[#2c4a72]"
          onClick={onNext}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
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

      {/* 上傳 xlsx 的模態視窗 - 這裡需要引入 FileUpload 組件 */}
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
            {/* 這裡需要引入 FileUpload 組件 */}
            {/* <FileUpload OnFileExtension=".xlsx" /> */}
            <p className="text-gray-500 mt-4">
              Note: Import the FileUpload component and add it here
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
