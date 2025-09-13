export interface WebhookDataType {
  // Template settings
  templateFileName: string | null;
  templateFileId: string | null;
  templateFileUrl: string | null;
  
  // Webhook settings
  webhookName: string;
  webhookType: "surveycake" | "slack";
  surveycakeLink: string;
  hashKey: string;
  ivKey: string;
  
  // Email settings
  subject: string;
  senderName: string;
  localPart: string;
  replyTo: string;
  bcc: string[];
  cc: string[];
  provideCertification: "yes" | "no";
  attachments: { file_name: string; file_id: string; file_url: string }[];
}

export type WebhookStep =
  | "start-option"
  | "select-template"
  | "template-edit"
  | "webhook"
  | "settings"
  | "confirmation";

export type WebhookStartMode = "new" | "edit-existing" | "modify";

export interface WebhookListItem {
  webhook_id: string;
  webhook_name: string;
  webhook_type: "surveycake" | "slack";
  webhook_url: string;
  created_at: string;
  subject: string;
  display_name: string;
  sender_local_part: string;
  sequence_number: number;
  surveycake_link: string;
  is_generate_certificate: boolean;
  template_file_id: string;
  reply_to: string;
  cc: string[];
  bcc: string[];
  attachment_file_ids: string[];
  iv_key: string;
  hash_key: string;
}
