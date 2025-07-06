"use client";
import React, { useEffect, useState } from "react";
import EmailServiceBreadcrumb from "@/app/ui/email-service-breadcrumb";
import EmailServiceChooseTemplate from "@/app/ui/email-service-choose-template";
import { EmailServiceRecipients } from "@/app/ui/email-service-recipients";
import { EmailServiceSetting } from "@/app/ui/email-service-setting";
import { EmailServiceReview } from "@/app/ui/email-service-review";
import { EmailProvider } from "@/app/context/EmailContext";

type Step = "template" | "recipients" | "settings" | "confirmation";

export default function Page() {
  const [currentStep, setCurrentStep] = useState<Step>("template");
  const [templateSubStep, setTemplateSubStep] = useState<"choose" | "create-new" | "use-history">(
    "choose"
  );
  const [templateKey, setTemplateKey] = useState<number>(0);

  // 監聽 hash 變化
  useEffect(() => {
    const updateStepFromHash = () => {
      const hash = window.location.hash.replace("#", "") as Step;
      const steps: Step[] = ["template", "recipients", "settings", "confirmation"];
      if (steps.includes(hash)) {
        setCurrentStep(hash);
        if (hash === "template") {
          setTemplateSubStep("choose");
          setTemplateKey(prev => prev + 1); // re-mount
        }
      }
    };

    updateStepFromHash(); // 初始載入
    window.addEventListener("hashchange", updateStepFromHash);
    return () => window.removeEventListener("hashchange", updateStepFromHash);
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        return (
          <EmailServiceChooseTemplate
            onNext={() => (window.location.hash = "recipients")}
            initialStep={templateSubStep}
            key={`template-${templateKey}`}
          />
        );
      case "recipients":
        return <EmailServiceRecipients onNext={() => (window.location.hash = "settings")} />;
      case "settings":
        return <EmailServiceSetting onNext={() => (window.location.hash = "confirmation")} />;
      case "confirmation":
        return <EmailServiceReview onSubmit={() => alert("Email sent successfully!")} />;
      default:
        return null;
    }
  };

  return (
    <EmailProvider>
      <div className="container pt-0">
        <p className="text-4xl font-bold pt-2">Email Service</p>
        <EmailServiceBreadcrumb currentStep={currentStep} />
        {renderStepContent()}
      </div>
    </EmailProvider>
  );
}
