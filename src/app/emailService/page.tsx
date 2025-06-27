"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EmailServiceBreadcrumb from "@/app/ui/email-service-breadcrumb";
import EmailServiceChooseTemplate from "@/app/ui/email-service-choose-template";
import { EmailServiceRecipients } from "@/app/ui/email-service-recipients";
import { EmailServiceSetting } from "@/app/ui/email-service-setting";
import { EmailServiceReview } from "@/app/ui/email-service-review";

type Step = "template" | "recipients" | "setting" | "review";

export default function Page() {
  const breadcrumbItems = [{ label: "Email Service", href: "/emailService", active: true }];
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("template");
  const [templateSubStep, setTemplateSubStep] = useState<"choose" | "create-new" | "use-history">(
    "choose"
  );

  // Add a key to force re-mount of the component when breadcrumb is clicked
  const [templateKey, setTemplateKey] = useState<number>(0);

  const handleStepChange = useCallback((step: Step) => {
    console.log("Breadcrumb clicked:", step);
    setCurrentStep(step);

    // Reset template sub-step when navigating to template step via breadcrumb
    if (step === "template") {
      console.log("Resetting templateSubStep to choose");
      setTemplateSubStep("choose");
      // Increment key to force re-mount
      setTemplateKey(prev => prev + 1);
    }
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        console.log("Rendering template step with substep:", templateSubStep, "key:", templateKey);
        return (
          <EmailServiceChooseTemplate
            onNext={() => setCurrentStep("recipients")}
            initialStep={templateSubStep}
            key={`template-${templateKey}`} // Use templateKey to force re-mount
          />
        );
      case "recipients":
        return <EmailServiceRecipients onNext={() => setCurrentStep("setting")} />;
      case "setting":
        return <EmailServiceSetting onNext={() => setCurrentStep("review")} />;
      case "review":
        return <EmailServiceReview onSubmit={() => alert("Email sent successfully!")} />;
      default:
        return null;
    }
  };

  return (
    <div className="container pt-0">
      <h1 className="text-2xl font-black mt-0 mb-6">Email Service</h1>
      <EmailServiceBreadcrumb
        currentStep={currentStep}
        onStepClick={handleStepChange}
        items={breadcrumbItems}
      />

      {renderStepContent()}
    </div>
  );
}
