"use client";

import React, { useState, useEffect } from "react";
import { EmailServiceChooseTemplateChoose } from "@/app/ui/emailService/email-service-choose-template-choose";
import EmailServiceChooseTemplateCreateNew from "@/app/ui/emailService/email-service-choose-template-create-new";
import { EmailServiceChooseTemplateHistoryTemplate } from "@/app/ui/emailService/email-service-choose-template-history-template";

interface EmailServiceChooseTemplateProps {
  onNext: () => void;
  initialStep?: "choose" | "create-new" | "use-history";
}

export default function EmailServiceChooseTemplate({
  onNext,
  initialStep = "choose",
}: EmailServiceChooseTemplateProps) {
  // Important: Remove the useState initialization with initialStep and set it directly in the useEffect
  const [currentStep, setCurrentStep] = useState<"choose" | "create-new" | "use-history">("choose");

  // This effect will run both on mount and when initialStep changes
  useEffect(() => {
    console.log("EmailServiceChooseTemplate: initialStep changed to", initialStep);
    setCurrentStep(initialStep);
  }, [initialStep]);

  const handleChooseTemplateNext = (templateType: "new" | "history") => {
    if (templateType === "new") {
      setCurrentStep("create-new");
    } else if (templateType === "history") {
      setCurrentStep("use-history");
    }
  };

  // const handleCreateNewBack = () => {
  //   setCurrentStep("choose");
  // };

  const handleHistoryTemplateBack = () => {
    setCurrentStep("choose");
  };

  const handleCreateNewNext = () => {
    // Move to the next main step (recipients)
    onNext();
  };

  console.log("EmailServiceChooseTemplate: rendering with currentStep", currentStep);

  // Render the appropriate component based on the current step
  return (
    <div className="container">
      {currentStep === "choose" && (
        <EmailServiceChooseTemplateChoose
          onNext={selectedTemplate => {
            console.log("EmailServiceChooseTemplateChoose: selected", selectedTemplate);
            // Pass the selected template type to the handler
            handleChooseTemplateNext(selectedTemplate);
          }}
        />
      )}

      {currentStep === "create-new" && (
        <EmailServiceChooseTemplateCreateNew
          // onBack={handleCreateNewBack}
          onNext={handleCreateNewNext}
        />
      )}

      {currentStep === "use-history" && (
        <EmailServiceChooseTemplateHistoryTemplate
          onNext={() => {
            onNext(); // Call parent's onNext to move to next main step
          }}
          onBack={handleHistoryTemplateBack}
        />
      )}
    </div>
  );
}
