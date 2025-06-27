import React, { useState } from "react";
import { ArrowRight, Info } from "lucide-react";

interface SettingProps {
  onNext: () => void;
}

export const EmailServiceSetting: React.FC<SettingProps> = ({ onNext }) => {
  const [subject, setSubject] = useState("");
  const [senderName, setSenderName] = useState("");
  const [templateFile, setTemplateFile] = useState<string | null>(null);
  const [sheetFile, setSheetFile] = useState<string | null>(null);
  const [localPart, setLocalPart] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [bcc, setBcc] = useState("");
  const [cc, setCc] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [provideCertification, setProvideCertification] = useState<string | null>(null);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray]);
    }
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
                value={subject}
                onChange={e => setSubject(e.target.value)}
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
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Select your template file <Info size={16} className="ml-1 text-gray-400" />
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <select
                    className="w-full p-3 border border-gray-300 rounded appearance-none bg-white pr-8 focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                    value={templateFile || ""}
                    onChange={e => setTemplateFile(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a html file
                    </option>
                    <option value="template1.html">template1.html</option>
                    <option value="template2.html">template2.html</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded">
                  preview
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded">
                  upload
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Select your sheet file <Info size={16} className="ml-1 text-gray-400" />
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <select
                    className="w-full p-3 border border-gray-300 rounded appearance-none bg-white pr-8 focus:outline-none focus:ring-gray-400 focus:border-gray-400"
                    value={sheetFile || ""}
                    onChange={e => setSheetFile(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a xlsx file
                    </option>
                    <option value="recipients.xlsx">recipients.xlsx</option>
                    <option value="contacts.xlsx">contacts.xlsx</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current text-gray-500" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded">
                  preview
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded">
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
                  value={localPart}
                  onChange={e => setLocalPart(e.target.value)}
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
                value={replyTo}
                onChange={e => setReplyTo(e.target.value)}
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
                value={bcc}
                onChange={e => setBcc(e.target.value)}
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
                value={cc}
                onChange={e => setCc(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-2 flex items-center text-gray-700">
                Attach files <Info size={16} className="ml-1 text-gray-400" />
              </label>
              <div className="flex gap-2">
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
              </div>
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
                    checked={provideCertification === "yes"}
                    onChange={() => setProvideCertification("yes")}
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="certification"
                    value="no"
                    checked={provideCertification === "no"}
                    onChange={() => setProvideCertification("no")}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end p-6 border-t border-gray-200">
        <button
          className="px-6 py-2 bg-[#1a2f4a] text-white rounded flex items-center hover:bg-[#2c4a72]"
          onClick={onNext}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
