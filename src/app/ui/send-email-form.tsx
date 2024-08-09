"use client";
import React, { useRef, useState, FormEvent } from "react";
import { submitForm } from "@/lib/actions";
import HelpTip from "@/app/ui/help-tip";
import SelectDropdown from "@/app/ui/select-dropdown";
import AttachDropdown from "./attach-dropdown";
import FileUpload from "@/app/ui/file-upload";
import IframePreview from "@/app/ui/iframe-preview";
import EmailInput from "@/app/ui/email-input";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

interface SubmitResponse {
  status: string;
  message: string;
  request_id?: string;
  timestamp?: string;
  sqs_message_id?: string;
  errors?: { path: string; message: string }[];
}

export default function SendEmailForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedHtmlFile, setSelectedHtmlFile] = useState<string | null>("");
  const [selectedXlsxFile, setSelectedXlsxFile] = useState<string | null>("");
  const [htmlPreviewLink, setHtmlPreviewLink] = useState<string | null>("");
  const [xlsxPreviewLink, setXlsxPreviewLink] = useState<string | null>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showHtmlUpload, setShowHtmlUpload] = useState<boolean>(false);
  const [showXlsxUpload, setShowXlsxUpload] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<boolean>(false);
  const [previewXlsx, setPreviewXlsx] = useState<boolean>(false);
  const [showAttachUpload, setShowAttachUpload] = useState<boolean>(false);

  const [attachment_file_ids, setAttachment_file_ids] = useState<string[]>([]);
  const [isGenerateCertificate, setIsGenerateCertificate] =
    useState<boolean>(false);

  const [replyToEmail, setReplyToEmail] = useState<string>("");
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [localPart, setLocalPart] = useState<string>("");

  const router = useRouter();

  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem("token_expiry_time");
    if (!expiryTime) return true;
    return new Date().getTime() > parseInt(expiryTime);
  };

  useEffect(() => {
    console.log("checkLoginStatus function called");
    const access_token = localStorage.getItem("access_token");
    if (!access_token || isTokenExpired()) {
      router.push("/login");
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = {
      subject: (ref.current.querySelector("[id='subject']") as HTMLInputElement)
        .value,
      display_name: (
        ref.current.querySelector("[id='display_name']") as HTMLInputElement
      ).value,
      template_file_id: selectedHtmlFile,
      spreadsheet_file_id: selectedXlsxFile,
      attachment_file_ids: attachment_file_ids,
      is_generate_certificate: isGenerateCertificate,
      reply_to: replyToEmail,
      sender_local_part: localPart,
      bcc: bccEmails,
      cc: ccEmails,
    };
    console.log("form data", formData);

    setIsSubmitting(true);
    try {
      const response: SubmitResponse = await submitForm(
        JSON.stringify(formData),
        localStorage.getItem("access_token") ?? ""
      );

      if (response.status === "error" && response.errors) {
        const newErrors: { [key: string]: string } = {};
        response.errors.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      alert(response.status + ": " + response.message);
      setErrors({});
      ref.current.reset();
    } catch (error: any) {
      alert("Failed to send form data: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleHtmlSelect = (
    file_id: string | null,
    file_url: string | null
  ) => {
    setSelectedHtmlFile(file_id);
    setHtmlPreviewLink(file_url);
  };

  const handleXlsxSelect = (file_id: string, file_url: string) => {
    setSelectedXlsxFile(file_id);
    setXlsxPreviewLink(file_url);
  };

  const handleAttachSelect = (selectedFiles: any) => {
    const selected_ids = selectedFiles.map((file: any) => file.file_id);
    setAttachment_file_ids(selected_ids);
    console.log("selected attachment file ids", selected_ids);
  };

  const handleOpenHtmlUpload = () => {
    setShowHtmlUpload(true);
  };
  const handleHtmlCloseUpload = () => {
    setShowHtmlUpload(false);
  };

  const handleXlsxOpenUpload = () => {
    setShowXlsxUpload(true);
  };
  const handleXlsxCloseUpload = () => {
    setShowXlsxUpload(false);
  };

  const handleAttachOpenUpload = () => {
    setShowAttachUpload(true);
  };

  const handleAttachCloseUpload = () => {
    setShowAttachUpload(false);
  };

  const handlePreviewHtml = () => {
    setPreviewHtml(true);
  };

  const handlePreviewHtmlClose = () => {
    setPreviewHtml(false);
  };

  const handlePreviewXlsx = () => {
    setPreviewXlsx(true);
  };

  const handlePreviewXlsxClose = () => {
    setPreviewXlsx(false);
  };

  const handleReplyToEmailChange = (emails: string[]) => {
    setReplyToEmail(emails[0] || "");
  };

  const handleBccEmailsChange = (emails: string[]) => {
    setBccEmails(emails);
  };

  const handleCcEmailsChange = (emails: string[]) => {
    setCcEmails(emails);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Send Emails</p>
        <div className="flex justify-between items-center w-full">
          <p className="text-gray-500 italic">
            Enter your <strong>subject</strong> and{" "}
            <strong>display name</strong>.
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <form onSubmit={onSubmit} ref={ref}>
        <p className="text-2xl font-bold py-2">Required</p>
        <div className="rounded-md bg-neutral-100 p-4">
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Subject of the email:
              <HelpTip message="Enter the email subject that recipients will see.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter the subject"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.subject ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Name of the sender:
              <HelpTip message="Enter the sender's name as it will appear to recipients.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Enter the name"
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.display_name ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.display_name && (
              <p className="text-red-500 text-sm">{errors.display_name}</p>
            )}
          </div>
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Select your template file:
              <HelpTip message="Choose or upload a .html file that contains the email content.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex items-center gap-2">
              <SelectDropdown
                onSelect={handleHtmlSelect}
                fileExtension="html"
              />
              <button
                type="button"
                onClick={handlePreviewHtml}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                preview
              </button>
              <button
                type="button"
                onClick={handleOpenHtmlUpload}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                upload
              </button>
              {showHtmlUpload && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-screen-lg relative">
                    <button
                      onClick={handleHtmlCloseUpload}
                      className="absolute top-4 right-4 text-black"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                        />
                      </svg>
                    </button>
                    <FileUpload OnFileExtension=".html" />
                  </div>
                </div>
              )}
              {previewHtml && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 p-20">
                  <div className="bg-yellow-400 rounded-lg shadow-2xl p-8 pb-12 w-full h-full relative">
                    <button
                      onClick={handlePreviewHtmlClose}
                      className="absolute top-8 right-8 text-white"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                        />
                      </svg>
                    </button>
                    <div className="w-full h-full p-2 flex flex-col">
                      <p className="text-2xl text-white">Preview Html</p>
                      {htmlPreviewLink ? (
                        <IframePreview
                          src={htmlPreviewLink}
                          title="Participants Sheet Preview"
                          width="100%"
                          height="100%"
                        />
                      ) : (
                        <div className="flex w-full h-full justify-center items-center">
                          <p className="text-white">No preview available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.template_file_id && (
              <p className="text-red-500 text-sm">{errors.template_file_id}</p>
            )}
          </div>
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Select your sheet file:
              <HelpTip message="Choose or upload a .xlsx file containing the list of recipients.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex items-center gap-2">
              <SelectDropdown
                onSelect={handleXlsxSelect}
                fileExtension="xlsx"
              />
              <button
                type="button"
                onClick={handlePreviewXlsx}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                preview
              </button>
              <button
                type="button"
                onClick={handleXlsxOpenUpload}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                upload
              </button>
              {showXlsxUpload && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-2xl p-8 pb-20 w-full max-w-screen-lg relative">
                    <button
                      onClick={handleXlsxCloseUpload}
                      className="absolute top-8 right-8 text-black"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                        />
                      </svg>
                    </button>
                    <FileUpload OnFileExtension=".xlsx" />
                  </div>
                </div>
              )}
              {previewXlsx && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50 p-20">
                  <div className="bg-green-700 rounded-lg shadow-2xl p-8 pb-12 w-full h-full relative">
                    <button
                      onClick={handlePreviewXlsxClose}
                      className="absolute top-8 right-8 text-white"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                        />
                      </svg>
                    </button>
                    <div className="w-full h-full p-2 flex flex-col">
                      <p className="text-2xl text-white">Preview xlsx</p>
                      {xlsxPreviewLink ? (
                        <IframePreview
                          src={`https://view.officeapps.live.com/op/view.aspx?src=${xlsxPreviewLink}`}
                          title="Participants Sheet Preview"
                          width="100%"
                          height="100%"
                        />
                      ) : (
                        <div className="flex w-full h-full justify-center items-center">
                          <p className="text-white">No preview available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.spreadsheet_file_id && (
              <p className="text-red-500 text-sm">
                {errors.spreadsheet_file_id}
              </p>
            )}
          </div>
        </div>
        <p className="text-2xl font-bold py-2 flex items-center gap-1">
          Optional
          {/* <ChevronDown size={24} /> */}
        </p>
        <div className="rounded-md bg-neutral-100 p-4">
          {/* Sender Local Part */}
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Sender Local Part:
              <HelpTip message="Enter the prefix for your email address (e.g., if you enter john.doe, the email will be john.doe@aws-educate.tw). This setting will affect the forwarding rules.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex items-center bg-neutral-300 rounded-md">
              <input
                id="sender_local_part"
                name="sender_local_part"
                type="text"
                value={localPart}
                onChange={(e) => setLocalPart(e.target.value)}
                placeholder="Enter the local part of email"
                disabled={isSubmitting}
                className={`rounded-l-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                  errors.sender_local_part
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
              <div className="w-44 text-center text-sm">@aws-educate.tw</div>
            </div>
          </div>
          {/* Reply To */}
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Reply To:
              <HelpTip message="The email address where replies from recipients will be sent. You can set this to match the Sender Local Part or customize it.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <EmailInput
              allowMultiple={false}
              onEmailsChange={handleReplyToEmailChange}
            />
          </div>
          {/* BCC */}
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              BCC:
              <HelpTip message="Add email addresses to send blind carbon copies.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <EmailInput
              allowMultiple={true}
              onEmailsChange={handleBccEmailsChange}
            />
          </div>
          {/* CC */}
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              CC:
              <HelpTip message="Add email addresses to send carbon copies. Recipients will see these addresses.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <EmailInput
              allowMultiple={true}
              onEmailsChange={handleCcEmailsChange}
            />
          </div>
          {/* Attach files */}
          <div className="m-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Attach files:
              <HelpTip message="Attach any files you want to include with the email. Note: It is recommended that the total size of attachments does not exceed 5MB.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex items-center gap-2">
              <AttachDropdown onSelect={handleAttachSelect} />
              <button
                type="button"
                onClick={handleAttachOpenUpload}
                className="text-sky-950 hover:text-sky-800 flex justify-center items-center border-sky-950 h-10 rounded-lg px-2 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              >
                upload
              </button>
              {showAttachUpload && (
                <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-2xl p-8 pb-20 w-full max-w-screen-lg relative">
                    <button
                      onClick={handleAttachCloseUpload}
                      className="absolute top-8 right-8 text-black"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="currentColor"
                          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                        />
                      </svg>
                    </button>
                    <FileUpload OnFileExtension="all" />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Generate certificate */}
          <div className="my-5 mx-3">
            <label className="mb-2 flex text-sm font-medium gap-2">
              Provide a certification of participation?
              <HelpTip message="Select Yes or No if you want to provide a certification. Note: If you select Yes, the Excel file must include two columns: Name and Certificate Text.">
                <Info size={16} color="gray" />
              </HelpTip>
            </label>
            <div className="flex">
              <div className="flex items-center me-4">
                <input
                  id="inline-radio"
                  type="radio"
                  value="yes"
                  onChange={() => setIsGenerateCertificate(true)}
                  name="inline-radio-group"
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label
                  htmlFor="inline-radio"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Yes
                </label>
              </div>
              <div className="flex items-center me-4">
                <input
                  id="inline-2-radio"
                  type="radio"
                  value="no"
                  onChange={() => setIsGenerateCertificate(false)}
                  name="inline-radio-group"
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                ></input>
                <label
                  htmlFor="inline-2-radio"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end my-3 gap-3">
          {isSubmitting ? (
            <button
              type="button"
              className="flex h-10 items-center rounded-lg bg-gray-500 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
              disabled
            >
              Sending...
            </button>
          ) : (
            <button
              type="submit"
              className="flex h-10 items-center rounded-lg bg-sky-950 hover:bg-sky-800 px-4 md:text-base text-xs font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950"
            >
              Send Email
            </button>
          )}
        </div>
      </form>
    </>
  );
}
