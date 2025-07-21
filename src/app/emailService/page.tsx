"use client";
import React, { useEffect, useState } from "react";
import EmailServiceBreadcrumb from "@/app/ui/emailService/email-service-breadcrumb";
import EmailServiceStartOption from "@/app/ui/emailService/email-service-start-option";
import EmailServiceTemplateSelector from "@/app/ui/emailService/email-service-template-selector";
import EmailServiceTemplateEditor from "@/app/ui/emailService/email-service-template-editor";
import EmailServiceRecipients from "@/app/ui/emailService/email-service-recipients";
import EmailServiceSetting from "@/app/ui/emailService/email-service-setting";
import EmailServiceReview from "@/app/ui/emailService/email-service-review";
import { EmailProvider } from "@/app/context/EmailContext";

type Step =
  | "start-option"
  | "select-template"
  | "template-edit"
  | "recipients"
  | "settings"
  | "confirmation";

type StartMode = "new" | "edit-existing" | "resend";

export interface EmailDataType {
  subject: string;
  senderName: string;
  templateFileName: string | null;
  templateFileId: string | null;
  templateFileUrl: string | null;
  spreadsheetFileName: string | null;
  spreadsheetFileId: string | null;
  spreadsheetFileUrl: string | null;
  localPart: string;
  replyTo: string;
  bcc: string[];
  cc: string[];
  provideCertification: "yes" | "no";
  attachments: { file_name: string; file_id: string; file_url: string }[];
}

export default function Page() {
  const [currentStep, setCurrentStep] = useState<Step>("start-option");
  const [startMode, setStartMode] = useState<StartMode | null>(null);

  const [emailData, setEmailData] = useState<EmailDataType>({
    subject: "",
    senderName: "",
    templateFileName: null,
    templateFileId: null,
    templateFileUrl: null,
    spreadsheetFileName: null,
    spreadsheetFileId: null,
    spreadsheetFileUrl: null,
    localPart: "",
    replyTo: "",
    bcc: [],
    cc: [],
    provideCertification: "no",
    attachments: [],
  });

  useEffect(() => {
    console.log("emailData:", emailData);
  }, [emailData]);

  useEffect(() => {
    const updateStepFromHash = () => {
      const hash = window.location.hash.replace("#", "") as Step;
      const steps: Step[] = [
        "start-option",
        "select-template",
        "template-edit",
        "recipients",
        "settings",
        "confirmation",
      ];
      if (steps.includes(hash)) {
        setCurrentStep(hash);

        // 🌟 關鍵：如果跳回 start-option，就清空 startMode
        if (hash === "start-option") {
          setStartMode(null);
        }
      }
    };

    updateStepFromHash();
    window.addEventListener("hashchange", updateStepFromHash);
    return () => window.removeEventListener("hashchange", updateStepFromHash);
  }, []);

  // useEffect(() => {
  //   console.log("templateFileId:", templateFileId);
  //   console.log("templateFileUrl:", templateFileUrl);
  // }, [templateFileId, templateFileUrl]);

  const handleStart = (mode: StartMode) => {
    setStartMode(mode);
    if (mode === "new") {
      window.location.hash = "template-edit";
    } else {
      window.location.hash = "select-template";
    }
  };

  const handleTemplateSelected = () => {
    if (startMode === "resend") {
      window.location.hash = "recipients";
    } else {
      window.location.hash = "template-edit";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "start-option":
        return <EmailServiceStartOption onSelect={handleStart} />;
      case "select-template":
        return <EmailServiceTemplateSelector onSelect={handleTemplateSelected} />;
      case "template-edit":
        return (
          <EmailServiceTemplateEditor
            onNext={() => (window.location.hash = "recipients")}
            onSave={(templateFileName, templateFileId, templateFileUrl) => {
              setEmailData(prev => ({
                ...prev,
                templateFileName,
                templateFileId,
                templateFileUrl,
              }));
            }}
          />
        );
      case "recipients":
        return (
          <EmailServiceRecipients
            onNext={() => (window.location.hash = "settings")}
            templateFileId={emailData.templateFileId}
            onSave={(spreadsheetFileName, spreadsheetFileId, spreadsheetFileUrl) => {
              setEmailData(prev => ({
                ...prev,
                spreadsheetFileName,
                spreadsheetFileId,
                spreadsheetFileUrl,
              }));
            }}
          />
        );
      case "settings":
        return (
          <EmailServiceSetting
            onNext={() => (window.location.hash = "confirmation")}
            emailData={emailData}
            onEmailDataChange={setEmailData}
          />
        );

      case "confirmation":
        return (
          <EmailServiceReview
            onSubmit={() => alert("Email sent successfully!")}
            emailData={emailData}
          />
        );
      default:
        return null;
    }
  };

  const visibleSteps: string[] = (() => {
    if (!startMode) return ["start-option"];

    const baseSteps =
      startMode === "new"
        ? ["template-edit", "recipients", "settings", "confirmation"]
        : startMode === "edit-existing"
          ? ["select-template", "template-edit", "recipients", "settings", "confirmation"]
          : ["select-template", "recipients", "settings", "confirmation"];

    return ["start-option", ...baseSteps];
  })();

  return (
    <EmailProvider>
      <div className="">
        <p className="text-4xl font-bold pt-2">Email Service</p>
        {currentStep !== "start-option" && (
          <EmailServiceBreadcrumb currentStep={currentStep} steps={visibleSteps} />
        )}
        {renderStepContent()}
      </div>
    </EmailProvider>
  );
}
