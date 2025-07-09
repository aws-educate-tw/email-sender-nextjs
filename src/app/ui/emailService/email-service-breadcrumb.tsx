import React from "react";
import { ChevronRight, FileText, Users, Settings, Send } from "lucide-react";

type Step = "template" | "recipients" | "settings" | "confirmation";

interface EmailServiceBreadcrumbProps {
  currentStep?: Step;
}

export default function EmailServiceBreadcrumb({
  currentStep = "template",
}: EmailServiceBreadcrumbProps) {
  const steps: { step: Step; label: string; icon: (className: string) => React.ReactNode }[] = [
    {
      step: "template",
      label: "Choose Template",
      icon: className => <FileText strokeWidth={1.5} className={className} />,
    },
    {
      step: "recipients",
      label: "Recipients",
      icon: className => <Users strokeWidth={1.5} className={className} />,
    },
    {
      step: "settings",
      label: "Settings",
      icon: className => <Settings strokeWidth={1.5} className={className} />,
    },
    {
      step: "confirmation",
      label: "Confirmation",
      icon: className => <Send strokeWidth={1.5} className={className} />,
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl p-4">
      <div className="flex items-center mb-4">
        <nav className="flex justify-between" aria-label="Process steps">
          <div className="flex items-center w-full space-x-2 md:space-x-4">
            {steps.map((item, index) => (
              <div key={item.step} className="flex items-center">
                <a href={`#${item.step}`} className="flex items-center group cursor-pointer">
                  {item.icon(
                    `w-6 h-6 mr-2 ${
                      currentStep === item.step
                        ? "text-[#1a2f4a]"
                        : "text-[#1a2f4a] group-hover:text-[#48596e]"
                    }`
                  )}
                  <span
                    className={`text-base md:text-lg ${
                      currentStep === item.step
                        ? "font-bold text-[#1a2f4a]"
                        : "text-[#1a2f4a] group-hover:text-[#48596e]"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-[#1a2f4a] flex-shrink-0 ml-2" />
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
