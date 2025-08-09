interface AttachmentFilesType {
  file_url: string;
  uploaded_id?: string;
  uploader_id?: string;
  updated_at: string;
  file_name: string;
  file_id: string;
  s3_object_key: string;
  created_at: string;
  file_extension: string;
  file_size: number;
}

interface SpreadsheetFileType {
  file_url: string;
  uploaded_id?: string;
  uploader_id?: string;
  updated_at: string;
  file_name: string;
  file_id: string;
  s3_object_key: string;
  created_at: string;
  file_extension: string;
  file_size: number;
}

interface TemplateFileType {
  file_url: string;
  uploaded_id?: string;
  uploader_id?: string;
  updated_at: string;
  file_name: string;
  file_id: string;
  s3_object_key: string;
  created_at: string;
  file_extension: string;
  file_size: number;
}

interface SenderType {
  user_id: string;
  email: string;
  username: string;
}

interface DataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  attachment_files: AttachmentFilesType[];
  recipient_source: "DIRECT" | "SPREADSHEET";
  created_at: string;
  sender_local_part: string;
  spreadsheet_file_id: string | null;
  created_year_month?: string;
  recipients?: Array<{ email: string; template_variables: Record<string, any> }>;
  attachment_file_ids: string[];
  is_generate_certificate: boolean;
  spreadsheet_file: SpreadsheetFileType | null;
  display_name: string;
  sender_id: string | null;
  sender: SenderType;
  template_file_id: string;
  success_email_count: number;
  expected_email_send_count: number;
  failed_email_count?: number;
  reply_to: string;
  template_file: TemplateFileType;
  created_year_month_day?: string;
  created_year?: string;
}

interface EmailDetailsDropdownProps {
  data: DataType;
}

export default function EmailDetailsDropdown({ data }: EmailDetailsDropdownProps) {
  if (!data) {
    return (
      <div className="w-full p-8 text-center text-gray-500">No email history details found</div>
    );
  }

  console.log("Email data:", data);

  const emailData = data;
  const emailDetails = [
    { label: "Subject:", value: emailData.subject },
    {
      label: "From:",
      value: `${emailData.display_name} <${emailData.sender_local_part}@aws-educate.tw>`,
    },
    {
      label: "To:",
      value: "Recipients from sheet file",
    },
    {
      label: "TemplateFile:",
      value: emailData.template_file?.file_name
        ? `${emailData.template_file.file_name} (${emailData.template_file.file_size})`
        : "No template file",
    },
    {
      label: "SheetFile:",
      value: emailData.spreadsheet_file
        ? `${emailData.spreadsheet_file.file_name} (${emailData.spreadsheet_file.file_size})`
        : "No sheet file",
    },
    { label: "LocalPart:", value: emailData.sender_local_part },
    { label: "Reply To:", value: emailData.reply_to },
    {
      label: "BCC:",
      value: emailData.bcc && emailData.bcc.length ? emailData.bcc.join(", ") : "No BCC recipients",
    },
    {
      label: "CC:",
      value: emailData.cc && emailData.cc.length ? emailData.cc.join(", ") : "No CC recipients",
    },
    {
      label: "Attachments:",
      value:
        emailData.attachment_files && emailData.attachment_files.length > 0
          ? `${emailData.attachment_files.length} file(s) attached`
          : "No files attached",
    },
    {
      label: "ProvideCertificate:",
      value: emailData.is_generate_certificate ? "Yes" : "No",
    },
  ];

  return (
    <div className="">
      <div className="mt-4 space-y-2">
        {emailDetails.map((item, index) => (
          <div key={index} className="flex text-sm">
            <div className="w-40 font-medium text-gray-700">{item.label}</div>
            <div className="flex-1 text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
