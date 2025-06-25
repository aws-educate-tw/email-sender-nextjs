"use client";

import React, { useState } from "react";
import { EmailServiceChooseTemplateChoose } from "./email-service-choose-template-choose";
import EmailServiceChooseTemplateCreateNew from "./email-service-choose-template-create-new";

export default function EmailServiceChooseTemplate() {
  const [currentStep, setCurrentStep] = useState<"choose" | "create-new" | "use-history">("choose");

  const handleChooseTemplateNext = (templateType: "new" | "history") => {
    if (templateType === "new") {
      setCurrentStep("create-new");
    } else if (templateType === "history") {
      setCurrentStep("use-history");
    }
  };

  const handleCreateNewBack = () => {
    setCurrentStep("choose");
  };

  const handleCreateNewNext = () => {
    // Navigate to the next step after template creation
    console.log("Template created, move to next step");
    // setCurrentStep("next-step");
  };

  // Render the appropriate component based on the current step
  return (
    <div className="container mx-auto px-4 py-8">
      {currentStep === "choose" && (
        <EmailServiceChooseTemplateChoose
          onNext={(templateType) => handleChooseTemplateNext(templateType)} 
        />
      )}

      {currentStep === "create-new" && (
        <EmailServiceChooseTemplateCreateNew
          onBack={handleCreateNewBack}
          onNext={handleCreateNewNext}
        />
      )}

      {/* Add other steps here as needed */}
    </div>
  );
}
