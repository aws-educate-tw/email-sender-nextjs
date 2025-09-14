"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  WebhookDataType,
  WebhookStep,
  WebhookStartMode,
  WebhookListItem,
} from "@/app/ui/webhookService/type";
import WebhookServiceBreadcrumb from "@/app/ui/webhookService/webhook-service-breadcrumb";
import WebhookServiceStartOption from "@/app/ui/webhookService/webhook-service-start-option";
import WebhookServiceWebhookSelector from "@/app/ui/webhookService/webhook-service-webhook-selector";
import EmailServiceTemplateSelector from "@/app/ui/emailService/email-service-template-selector";
import EmailServiceTemplateEditor from "@/app/ui/emailService/email-service-template-editor";
import WebhookServiceWebhook from "@/app/ui/webhookService/webhook-service-webhook";
import WebhookServiceSettings from "@/app/ui/webhookService/webhook-service-settings";
import WebhookServiceReview from "@/app/ui/webhookService/webhook-service-review";

export default function WebhookService() {
  const params = useSearchParams();
  const router = useRouter();

  const currentStep = (params.get("step") as WebhookStep) ?? "start-option";
  const mode = params.get("mode") as WebhookStartMode | null;

  const [webhookData, setWebhookData] = useState<WebhookDataType>({
    templateFileName: null,
    templateFileId: null,
    templateFileUrl: null,
    webhookName: "",
    webhookType: "surveycake",
    surveycakeLink: "",
    hashKey: "",
    ivKey: "",
    subject: "",
    senderName: "",
    localPart: "",
    replyTo: "",
    bcc: [],
    cc: [],
    provideCertification: "no",
    attachments: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedWebhookForModify, setSelectedWebhookForModify] = useState<WebhookListItem | null>(
    null
  );

  const goToStep = (step: WebhookStep, newMode: WebhookStartMode) => {
    const search = new URLSearchParams();
    search.set("step", step);
    search.set("mode", newMode);
    router.push(`/webhookService?${search.toString()}`);
  };

  useEffect(() => {
    if (currentStep === "start-option") {
      // Reset webhookData when back to start
      setWebhookData({
        templateFileName: null,
        templateFileId: null,
        templateFileUrl: null,
        webhookName: "",
        webhookType: "surveycake",
        surveycakeLink: "",
        hashKey: "",
        ivKey: "",
        subject: "",
        senderName: "",
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
      router.replace("/webhookService?step=start-option");
    }
  }, [currentStep, mode, router]);

  const handleTemplateSelect = useCallback(
    (templateFileName: string, templateFileId: string, templateFileUrl: string) => {
      setWebhookData(prev => ({
        ...prev,
        templateFileName,
        templateFileId,
        templateFileUrl,
      }));
    },
    []
  );

  const handleTemplateSave = useCallback(
    (
      templateFileName: string | null,
      templateFileId: string | null,
      templateFileUrl: string | null
    ) => {
      setWebhookData(prev => ({
        ...prev,
        templateFileName,
        templateFileId,
        templateFileUrl,
      }));
    },
    []
  );

  const handleWebhookSelectForModify = useCallback((webhook: WebhookListItem) => {
    setSelectedWebhookForModify(webhook);
    console.log("Selected webhook for modify:", webhook.webhook_id);
    // Populate webhookData with selected webhook data
    setWebhookData({
      templateFileName: null, // Template will be handled separately
      templateFileId: webhook.template_file_id,
      templateFileUrl: null,
      webhookName: webhook.webhook_name,
      webhookType: webhook.webhook_type,
      surveycakeLink: webhook.surveycake_link,
      hashKey: webhook.hash_key,
      ivKey: webhook.iv_key,
      subject: webhook.subject,
      senderName: webhook.display_name,
      localPart: webhook.sender_local_part,
      replyTo: webhook.reply_to,
      bcc: webhook.bcc || [],
      cc: webhook.cc || [],
      provideCertification: webhook.is_generate_certificate ? "yes" : "no",
      attachments: [], // Attachments will be handled separately if needed
    });
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case "start-option":
        return (
          <WebhookServiceStartOption
            onSelect={mode => {
              if (mode === "new") goToStep("template-edit", "new");
              else if (mode === "edit-existing") goToStep("select-template", "edit-existing");
              else if (mode === "modify") goToStep("select-webhook", "modify");
            }}
          />
        );
      case "select-webhook":
        // This step is only for modify mode - user selects webhook to modify
        return (
          <WebhookServiceWebhookSelector
            onNext={() => goToStep("select-template", "modify")}
            onWebhookSelect={handleWebhookSelectForModify}
          />
        );
      case "select-template":
        // This step is for both edit-existing and modify modes - user selects email template
        return (
          <EmailServiceTemplateSelector
            onNext={() =>
              goToStep("template-edit", mode === "edit-existing" ? "edit-existing" : "modify")
            }
            onTemplateSelect={handleTemplateSelect}
          />
        );
      case "template-edit":
        return (
          <EmailServiceTemplateEditor
            onNext={() => {
              if (mode === "new") goToStep("webhook", "new");
              else if (mode === "edit-existing") goToStep("webhook", "edit-existing");
              else if (mode === "modify") goToStep("webhook", "modify");
            }}
            templateFileUrl={webhookData.templateFileUrl}
            onSave={handleTemplateSave}
          />
        );
      case "webhook":
        return (
          <WebhookServiceWebhook
            onNext={() => {
              if (mode === "new") goToStep("settings", "new");
              else if (mode === "edit-existing") goToStep("settings", "edit-existing");
              else if (mode === "modify") goToStep("settings", "modify");
            }}
            webhookData={webhookData}
            onWebhookDataChange={setWebhookData}
          />
        );
      case "settings":
        return (
          <WebhookServiceSettings
            onNext={() => {
              if (mode === "new") goToStep("confirmation", "new");
              else if (mode === "edit-existing") goToStep("confirmation", "edit-existing");
              else if (mode === "modify") goToStep("confirmation", "modify");
            }}
            webhookData={webhookData}
            onWebhookDataChange={setWebhookData}
          />
        );
      case "confirmation":
        return <WebhookServiceReview webhookData={webhookData} />;
      default:
        return null;
    }
  };

  const visibleSteps = (() => {
    if (!mode) return ["start-option"];

    if (mode === "new") {
      return ["start-option", "template-edit", "webhook", "settings", "confirmation"];
    }

    if (mode === "edit-existing") {
      return [
        "start-option",
        "select-template",
        "template-edit",
        "webhook",
        "settings",
        "confirmation",
      ];
    }

    if (mode === "modify") {
      return [
        "start-option",
        "select-webhook",
        "select-template",
        "template-edit",
        "webhook",
        "settings",
        "confirmation",
      ];
    }

    return ["start-option"];
  })();

  return (
    <div>
      {currentStep !== "start-option" && (
        <WebhookServiceBreadcrumb currentStep={currentStep} steps={visibleSteps} />
      )}
      {renderStepContent()}
    </div>
  );
}
