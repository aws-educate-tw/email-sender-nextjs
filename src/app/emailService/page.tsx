"use client";
import React, { useState } from "react";
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
  const [templateChoice, setTemplateChoice] = useState<"new" | "history" | null>(null);

  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        return <EmailServiceChooseTemplate onNext={() => setCurrentStep("recipients")} />;
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
