"use client";
import React, { useRef, useState, useEffect, FormEvent } from "react";
import { submitForm } from "@/lib/actions";
import SelectDropdown from "@/app/ui/select-dropdown";
// import FileUpload from "@/app/ui/file-upload";
import FileUpload from "@/app/ui/file-upload";

interface SubmitResponse {
  status: string;
  message: string;
  request_id?: string;
  timestamp?: string;
  sqs_message_id?: string;
  errors?: { path: string; message: string }[];
}

interface fileDataType {
  file_id: string;
  created_at: string;
  updated_at: string;
  file_url: string;
  file_name: string;
  file_extension: string;
  file_size: number;
  uploader_id: string;
}

export default function SendEmailForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedHtmlFile, setSelectedHtmlFile] = useState("");
  const [selectedXlsxFile, setSelectedXlsxFile] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showHtmlUpload, setShowHtmlUpload] = useState<boolean>(false);
  const [showXlsxUpload, setShowXlsxUpload] = useState<boolean>(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = new FormData(ref.current);
    formData.append("template_file_id", selectedHtmlFile);
    formData.append("spreadsheet_file_id", selectedXlsxFile);

    setIsSubmitting(true);
    try {
      const response: SubmitResponse = (await submitForm(
        formData
      )) as SubmitResponse;

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
      setErrors({}); // Clear previous errors
      ref.current.reset();
    } catch (error: any) {
      alert("Failed to send form data: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleHtmlSelect = (file_id: string) => {
    // console.log("selected html file id", file_id);
    setSelectedHtmlFile(file_id);
  };

  const handleXlsxSelect = (file_id: string) => {
    // console.log("selected xlsx file id", file_id);
    setSelectedXlsxFile(file_id);
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

  return (
    <>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Send Emails</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">
            Enter your <strong>subject</strong> and{" "}
            <strong>display name</strong>.
          </p>
          <div className="h-10"></div>
        </div>
      </div>
      <form onSubmit={onSubmit} ref={ref}>
        <div className="rounded-md bg-neutral-100 p-4">
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Subject of the email:
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
            <label className="mb-2 block text-sm font-medium">
              Name of the sender:
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
            <label className="mb-2 block text-sm font-medium">
              Select your template file:
            </label>
            <div className="flex items-center gap-2">
              <SelectDropdown
                onSelect={handleHtmlSelect}
                fileExtension="html"
              />
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
            </div>
            {errors.template_file_id && (
              <p className="text-red-500 text-sm">{errors.template_file_id}</p>
            )}
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Select your sheet file:
            </label>
            <div className="flex items-center gap-2">
              <SelectDropdown
                onSelect={handleXlsxSelect}
                fileExtension="xlsx"
              />
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
            </div>
            {errors.template_file_id && (
              <p className="text-red-500 text-sm">{errors.template_file_id}</p>
            )}
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
        {/* <div>template : {selectedHtmlFile}</div> */}
        {/* <div>sheet : {selectedXlsxFile}</div> */}
      </form>
    </>
  );
}
