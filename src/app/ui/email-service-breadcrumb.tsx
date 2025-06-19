import React from "react";
import { ChevronRight, FileText, Users, Settings, Send } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

type Step = "template" | "recipients" | "setting" | "review";

interface EmailServiceBreadcrumbProps {
  items: BreadcrumbItem[];
  currentStep?: Step;
  onStepClick?: (step: Step) => void;
}

export default function EmailServiceBreadcrumb({
  currentStep = "template",
  onStepClick,
}: EmailServiceBreadcrumbProps) {
  const handleClick = (step: Step) => {
    if (onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-4 mb-8">
      <nav className="flex justify-between" aria-label="Process steps">
        <div className="flex items-center w-full space-x-2 md:space-x-4">
          <button
            onClick={() => handleClick("template")}
            className={`flex items-center group cursor-pointer bg-transparent border-none`}
          >
            <div className="flex items-center justify-center">
              <FileText
                strokeWidth={1.5}
                className={`w-6 h-6 mr-2 ${
                  currentStep === "template"
                    ? "text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              />
              <span
                className={`text-base md:text-lg ${
                  currentStep === "template"
                    ? "font-bold text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              >
                Choose Template
              </span>
            </div>
          </button>

          <ChevronRight className="w-5 h-5 text-[#1a2f4a] flex-shrink-0" />

          <button
            onClick={() => handleClick("recipients")}
            className={`flex items-center group cursor-pointer bg-transparent border-none`}
          >
            <div className="flex items-center justify-center">
              <Users
                strokeWidth={1.5}
                className={`w-6 h-6 mr-2 ${
                  currentStep === "recipients"
                    ? "text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              />
              <span
                className={`text-base md:text-lg ${
                  currentStep === "recipients"
                    ? "font-bold text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              >
                Recipients
              </span>
            </div>
          </button>

          <ChevronRight className="w-5 h-5 text-[#1a2f4a] flex-shrink-0" />

          <button
            onClick={() => handleClick("setting")}
            className={`flex items-center group cursor-pointer bg-transparent border-none`}
          >
            <div className="flex items-center justify-center">
              <Settings
                strokeWidth={1.5}
                className={`w-6 h-6 mr-2 ${
                  currentStep === "setting"
                    ? "text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              />
              <span
                className={`text-base md:text-lg ${
                  currentStep === "setting"
                    ? "font-bold text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              >
                Setting
              </span>
            </div>
          </button>

          <ChevronRight className="w-5 h-5 text-[#1a2f4a] flex-shrink-0" />

          <button
            onClick={() => handleClick("review")}
            className={`flex items-center group cursor-pointer bg-transparent border-none`}
          >
            <div className="flex items-center justify-center">
              <Send
                strokeWidth={1.5}
                className={`w-6 h-6 mr-2 ${
                  currentStep === "review"
                    ? "text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              />
              <span
                className={`text-base md:text-lg ${
                  currentStep === "review"
                    ? "font-bold text-[#1a2f4a]"
                    : "text-[#1a2f4a] group-hover:text-[#48596e]"
                }`}
              >
                Review and Send Email
              </span>
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
}
