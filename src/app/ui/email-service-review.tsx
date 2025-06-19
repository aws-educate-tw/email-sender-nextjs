import React from "react";
import { Send } from "lucide-react";

interface ReviewProps {
  onSubmit: () => void;
}

export const EmailServiceReview: React.FC<ReviewProps> = ({ onSubmit }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">Email Details</h2>

      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Subject:</p>
              <p className="bg-gray-100 p-2 rounded">
                Welcome to AWS Educate Cloud Ambassador Program
              </p>
            </div>

            <div>
              <p className="font-semibold">From:</p>
              <p className="bg-gray-100 p-2 rounded">Bill Wu &lt;billwu0222@aws-educate.tw&gt;</p>
            </div>

            <div>
              <p className="font-semibold">To:</p>
              <p className="bg-gray-100 p-2 rounded">Recipients from sheet file</p>
            </div>

            <div>
              <p className="font-semibold">Template file:</p>
              <p className="bg-gray-100 p-2 rounded">welcome-template.html</p>
            </div>

            <div>
              <p className="font-semibold">Sheet file:</p>
              <p className="bg-gray-100 p-2 rounded">recipients-list.xlsx</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-semibold">Local part:</p>
              <p className="bg-gray-100 p-2 rounded">billwu0222</p>
            </div>

            <div>
              <p className="font-semibold">Reply to:</p>
              <p className="bg-gray-100 p-2 rounded">billwu0222@gmail.com</p>
            </div>

            <div>
              <p className="font-semibold">BCC:</p>
              <p className="bg-gray-100 p-2 rounded">No BCC recipients</p>
            </div>

            <div>
              <p className="font-semibold">CC:</p>
              <p className="bg-gray-100 p-2 rounded">No CC recipients</p>
            </div>

            <div>
              <p className="font-semibold">Attach files:</p>
              <p className="bg-gray-100 p-2 rounded">No files attached</p>
            </div>

            <div>
              <p className="font-semibold">Provide a certification of participation?:</p>
              <p className="bg-gray-100 p-2 rounded">No</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Template Preview</h3>
        <div className="border rounded p-6 bg-gray-50">
          <p className="text-gray-800">親愛的&#123;&#123;Name&#125;&#125; ·</p>
          {/* More template content would go here */}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700"
          onClick={onSubmit}
        >
          Send Email <Send className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
