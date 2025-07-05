import React, { createContext, useState, useContext } from "react";

export interface EmailData {
  subject: string;
  senderName: string;
  templateFile: string | null;
  templateContent: string | null;
  templateName: string | null;
  templateUrl: string | null;
  sheetFile: string | null;
  sheetFileName?: string | null;
  sheetFileUrl?: string | null;
  localPart: string;
  replyTo: string;
  bcc: string;
  cc: string;
  attachments: File[];
  provideCertification: string | null;
}

export const defaultEmailData: EmailData = {
  subject: "",
  senderName: "",
  templateFile: null,
  templateContent: null,
  templateName: null,
  templateUrl: null,
  sheetFile: null,
  sheetFileName: null,
  sheetFileUrl: null,
  localPart: "",
  replyTo: "",
  bcc: "",
  cc: "",
  attachments: [],
  provideCertification: null,
};

interface EmailContextType {
  emailData: EmailData;
  updateEmailData: (data: Partial<EmailData>) => void;
  updateTemplate: (id: string, name: string, content: string, url?: string) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emailData, setEmailData] = useState<EmailData>(defaultEmailData);

  const updateEmailData = (data: Partial<EmailData>) => {
    setEmailData(prevData => ({ ...prevData, ...data }));
  };

  const updateTemplate = (
    templateFile: string,
    templateName: string,
    templateContent?: string,
    templateUrl?: string
  ) => {
    setEmailData(prevData => ({
      ...prevData,
      templateFile,
      templateName,
      templateContent: templateContent || null,
      templateUrl: templateUrl || null,
    }));
  };

  return (
    <EmailContext.Provider value={{ emailData, updateEmailData, updateTemplate }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmailContext = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error("useEmailContext must be used within an EmailProvider");
  }
  return context;
};
