"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight,
  Settings,
  Send,
  Layers3,
  PenLine,
  BookOpenCheck,
  Menu,
  X,
  Webhook,
} from "lucide-react";

interface StepInfo {
  step: string;
  label: string;
  icon: (className: string) => React.ReactNode;
}

interface WebhookServiceBreadcrumbProps {
  currentStep: string;
  steps: string[];
}

const stepLabelMap: Record<string, StepInfo> = {
  "start-option": {
    step: "start-option",
    label: "Start",
    icon: className => <Layers3 className={className} />,
  },
  "select-template": {
    step: "select-template",
    label: "Select Template",
    icon: className => <BookOpenCheck className={className} />,
  },
  "template-edit": {
    step: "template-edit",
    label: "Edit Template",
    icon: className => <PenLine className={className} />,
  },
  webhook: {
    step: "webhook",
    label: "Webhook",
    icon: className => <Webhook className={className} />,
  },
  settings: {
    step: "settings",
    label: "Settings",
    icon: className => <Settings className={className} />,
  },
  confirmation: {
    step: "confirmation",
    label: "Confirmation",
    icon: className => <Send className={className} />,
  },
};

export default function WebhookServiceBreadcrumb({
  currentStep,
  steps,
}: WebhookServiceBreadcrumbProps) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStepInfo = (step: string): StepInfo => {
    // For modify mode, change "select-template" to "Select Webhook"
    if (step === "select-template" && mode === "modify") {
      return {
        step: "select-template",
        label: "Select Webhook",
        icon: className => <Webhook className={className} />,
      };
    }
    return stepLabelMap[step];
  };

  const currentStepInfo = getStepInfo(currentStep);
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold pt-2">Webhook Service</h1>
        <div className="flex justify-between items-center w-full">
          <p className="text-sm sm:text-base text-gray-500 italic">
            You will be guided through the steps to create webhooks.
          </p>
          <div className="h-6 sm:h-8 md:h-10"></div>
        </div>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="w-full bg-white rounded-xl pt-2 pb-2">
        {/* Mobile View - Current Step Display */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {currentStepInfo?.icon("w-5 h-5 mr-2 text-[#1a2f4a]")}
              <div>
                <p className="text-xs text-gray-500">
                  Step {currentStepIndex + 1} of {steps.length}
                </p>
                <p className="text-base font-semibold text-[#1a2f4a]">{currentStepInfo?.label}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <nav className="px-4 py-2" aria-label="Process steps">
              {steps.map((stepKey, index) => {
                const step = getStepInfo(stepKey);
                if (!step) return null;

                const isActive = currentStep === stepKey;
                const query = new URLSearchParams();
                query.set("step", stepKey);
                if (mode) query.set("mode", mode);

                return (
                  <Link
                    key={stepKey}
                    href={`/webhookService?${query.toString()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center py-3 pl-2 pr-4 rounded-lg transition-colors ${
                      isActive ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-3 font-medium">{index + 1}</span>
                        {step.icon(`w-5 h-5 mr-2 ${isActive ? "text-sky-950" : "text-gray-600"}`)}
                        <span
                          className={`text-base ${
                            isActive ? "font-semibold text-sky-950" : "text-gray-700"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {isActive && <div className="w-2 h-2 bg-sky-950 rounded-full"></div>}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Desktop View - Horizontal Breadcrumb */}
        <nav
          className="hidden md:flex items-center w-full px-4 space-x-2 lg:space-x-4 overflow-x-auto"
          aria-label="Process steps"
        >
          {steps.map((stepKey, index) => {
            const step = getStepInfo(stepKey);
            if (!step) return null;

            const isActive = currentStep === stepKey;
            const isPast = index < currentStepIndex;
            const query = new URLSearchParams();
            query.set("step", stepKey);
            if (mode) query.set("mode", mode);

            return (
              <div key={stepKey} className="flex items-center flex-shrink-0">
                <Link
                  href={`/webhookService?${query.toString()}`}
                  className="flex items-center group cursor-pointer"
                >
                  <div className="flex items-center">
                    {/* Step number indicator for medium screens */}
                    <span
                      className={`hidden lg:block text-xs mr-2 ${
                        isActive
                          ? "text-sky-900 font-bold"
                          : isPast
                            ? "text-gray-400"
                            : "text-sky-900"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {step.icon(
                      `w-5 h-5 lg:w-6 lg:h-6 mr-1.5 lg:mr-2 ${
                        isActive
                          ? "text-sky-900"
                          : isPast
                            ? "text-gray-400"
                            : "text-sky-900 group-hover:text-sky-700"
                      }`
                    )}
                    <span
                      className={`text-sm lg:text-base xl:text-lg whitespace-nowrap ${
                        isActive
                          ? "font-bold text-[#1a2f4a] underline"
                          : isPast
                            ? "text-gray-400"
                            : "text-sky-900 group-hover:text-sky-700 group-hover:underline"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </Link>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0 ml-2 lg:ml-3" />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
