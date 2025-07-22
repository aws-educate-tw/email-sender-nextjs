import Link from "next/link";
import { ChevronRight, Users, Settings, Send, Layers3, PenLine, BookOpenCheck } from "lucide-react";

interface StepInfo {
  step: string;
  label: string;
  icon: (className: string) => React.ReactNode;
}

interface EmailServiceBreadcrumbProps {
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
  recipients: {
    step: "recipients",
    label: "Recipients",
    icon: className => <Users className={className} />,
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

export default function EmailServiceBreadcrumb({
  currentStep,
  steps,
}: EmailServiceBreadcrumbProps) {
  const mode =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("mode") : null;

  return (
    <div className="w-full bg-white rounded-xl p-4">
      <nav className="flex items-center w-full space-x-2 md:space-x-4" aria-label="Process steps">
        {steps.map((stepKey, index) => {
          const step = stepLabelMap[stepKey];
          if (!step) return null;

          const isActive = currentStep === stepKey;
          const query = new URLSearchParams();
          query.set("step", stepKey);
          if (mode) query.set("mode", mode);

          return (
            <div key={stepKey} className="flex items-center">
              <Link
                href={`/emailService?${query.toString()}`}
                className="flex items-center group cursor-pointer"
              >
                {step.icon(
                  `w-6 h-6 mr-2 ${
                    isActive ? "text-[#1a2f4a]" : "text-[#1a2f4a] group-hover:text-[#48596e]"
                  }`
                )}
                <span
                  className={`text-base md:text-lg ${
                    isActive
                      ? "font-bold text-[#1a2f4a]"
                      : "text-[#1a2f4a] group-hover:text-[#48596e]"
                  }`}
                >
                  {step.label}
                </span>
              </Link>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 text-[#1a2f4a] flex-shrink-0 ml-2" />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
