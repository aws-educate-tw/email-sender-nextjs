import React, { useState } from "react";
import { FileText, Clock } from "lucide-react";

interface TemplateProps {
  onNext: () => void;
}

export const EmailServiceChooseTemplateChoose: React.FC<TemplateProps> = ({ onNext }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<"new" | "history" | null>(null);

  const handleNext = () => {
    if (selectedTemplate) {
      onNext();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div
          className={`bg-white p-8 rounded-lg flex flex-col items-center cursor-pointer transition-all ${
            selectedTemplate === "new"
              ? "border-2 border-[#1a2f4a] shadow-md"
              : "border border-gray-200 hover:shadow-md"
          }`}
          onClick={() => setSelectedTemplate("new")}
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-[#1a2f4a]" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Create a new one</h2>
          <p className="text-gray-600 text-center">Start from scratch with a new email template</p>
        </div>

        <div
          className={`bg-white p-8 rounded-lg flex flex-col items-center cursor-pointer transition-all ${
            selectedTemplate === "history"
              ? "border-2 border-[#1a2f4a] shadow-md"
              : "border border-gray-200 hover:shadow-md"
          }`}
          onClick={() => setSelectedTemplate("history")}
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-10 h-10 text-[#1a2f4a]" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Use history template</h2>
          <p className="text-gray-600 text-center">Choose from your previously created templates</p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          className={`px-6 py-2 rounded text-white ${
            selectedTemplate
              ? "bg-[#1a2f4a] hover:bg-[#48596e] cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!selectedTemplate}
        >
          Next
        </button>
      </div>
    </>
  );
};
