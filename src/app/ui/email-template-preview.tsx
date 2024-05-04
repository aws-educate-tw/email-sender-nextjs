import React from "react";

interface EmailTemplatePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export default function EmailTemplatePreview({
  isOpen,
  onClose,
  content,
}: EmailTemplatePreviewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-4/5 h-5/6">
        <div className="flex flex-col h-full">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold">Preview</h2>
            <button onClick={onClose} className="text-xl font-bold">
              &times;
            </button>
          </div>
          <div className="mt-4 overflow-hidden h-full">
            <iframe
              srcDoc={content}
              style={{ width: "100%", height: "100%" }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
