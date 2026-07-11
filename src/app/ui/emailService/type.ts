export interface Excel {
  id?: string;
  [key: string]: string | undefined;
}

export type TableChangeMeta = {
  source: "init" | "user";
  origin: "dropdown" | "import" | "manual";
  columns?: string[];
};

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
  isRsvp: boolean;
  campaignId: string | null;
  campaignStartTime: string | null;
  registrationDeadline: string | null;
}
