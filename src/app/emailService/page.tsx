"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EmailServiceBreadcrumb from "@/app/ui/emailService/email-service-breadcrumb";
import EmailServiceStartOption from "@/app/ui/emailService/email-service-start-option";
import EmailServiceTemplateSelector from "@/app/ui/emailService/email-service-template-selector";
import EmailServiceTemplateEditor from "@/app/ui/emailService/email-service-template-editor";
import EmailServiceRecipients from "@/app/ui/emailService/email-service-recipients";
import EmailServiceSettings from "@/app/ui/emailService/email-service-settings";
import EmailServiceReview from "@/app/ui/emailService/email-service-review";

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
  const params = useSearchParams();
  const router = useRouter();
  const currentStep = (params.get("step") as Step) ?? "start-option";

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

  const goToStep = (step: Step) => {
    router.push(`/emailService?step=${step}`);
  };

  useEffect(() => {
    if (currentStep === "start-option") {
      setStartMode(null);
      setEmailData({
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
    }
  }, [currentStep]);

  const handleStart = (mode: StartMode) => {
    setStartMode(mode);
    if (mode === "new") {
      goToStep("template-edit");
    } else {
      goToStep("select-template");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "start-option":
        return <EmailServiceStartOption onSelect={handleStart} />;
      case "select-template":
        return (
          <EmailServiceTemplateSelector
            onNext={() => {
              if (startMode === "edit-existing") {
                goToStep("template-edit");
              } else if (startMode === "resend") {
                goToStep("recipients");
              }
            }}
            onTemplateSelect={(templateFileName, templateFileId, templateFileUrl) => {
              setEmailData(prev => ({
                ...prev,
                templateFileName,
                templateFileId,
                templateFileUrl,
              }));
            }}
          />
        );
      case "template-edit":
        return (
          <EmailServiceTemplateEditor
            onNext={() => {
              goToStep("recipients");
            }}
            templateFileUrl={emailData.templateFileUrl}
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
            onNext={() => goToStep("settings")}
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
          <EmailServiceSettings
            onNext={() => goToStep("confirmation")}
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
    <div>
      {currentStep !== "start-option" && (
        <EmailServiceBreadcrumb currentStep={currentStep} steps={visibleSteps} />
      )}
      {renderStepContent()}
    </div>
  );
}
