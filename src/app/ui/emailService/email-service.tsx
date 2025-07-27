"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmailDataType } from "@/app/ui/emailService/type";
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

export default function EmailService() {
  const params = useSearchParams();
  const router = useRouter();

  const currentStep = (params.get("step") as Step) ?? "start-option";
  const mode = params.get("mode") as StartMode | null;

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

  const goToStep = (step: Step, newMode: StartMode) => {
    const search = new URLSearchParams();
    search.set("step", step);
    search.set("mode", newMode);
    router.push(`/emailService?${search.toString()}`);
  };

  useEffect(() => {
    if (currentStep === "start-option") {
      // Reset emailData when back to start
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

    if (!mode && currentStep !== "start-option") {
      // 若沒帶 mode 參數，但 step 非起始，導回起點
      router.replace("/emailService?step=start-option");
    }
  }, [currentStep, mode]);

  const renderStepContent = () => {
    switch (currentStep) {
      case "start-option":
        return (
          <EmailServiceStartOption
            onSelect={mode => {
              if (mode === "new") goToStep("template-edit", "new");
              else if (mode === "edit-existing") goToStep("select-template", "edit-existing");
              else if (mode === "resend") goToStep("select-template", "resend");
            }}
          />
        );
      case "select-template":
        return (
          <EmailServiceTemplateSelector
            onNext={() => {
              if (mode === "edit-existing") goToStep("template-edit", "edit-existing");
              else if (mode === "resend") goToStep("recipients", "resend");
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
              if (mode === "new") goToStep("recipients", "new");
              else if (mode === "edit-existing") goToStep("recipients", "edit-existing");
              else if (mode === "resend") goToStep("recipients", "resend");
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
            onNext={() => {
              if (mode === "new") goToStep("settings", "new");
              else if (mode === "edit-existing") goToStep("settings", "edit-existing");
              else if (mode === "resend") goToStep("settings", "resend");
            }}
            emailData={emailData}
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
            onNext={() => {
              if (mode === "new") goToStep("confirmation", "new");
              else if (mode === "edit-existing") goToStep("confirmation", "edit-existing");
              else if (mode === "resend") goToStep("confirmation", "resend");
            }}
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

  const visibleSteps = (() => {
    if (!mode) return ["start-option"];

    if (mode === "new") {
      return ["start-option", "template-edit", "recipients", "settings", "confirmation"];
    }

    if (mode === "edit-existing") {
      return [
        "start-option",
        "select-template",
        "template-edit",
        "recipients",
        "settings",
        "confirmation",
      ];
    }

    if (mode === "resend") {
      return ["start-option", "select-template", "recipients", "settings", "confirmation"];
    }

    return ["start-option"];
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
