"use client";
import React, { useRef, useState, useEffect, FormEvent } from "react";
import { submitForm } from "@/app/lib/actions";

interface SubmitResponse {
  status: string;
  message: string;
  request_id?: string;
  timestamp?: string;
  sqs_message_id?: string;
  errors?: { path: string; message: string }[];
}

export default function SendForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [templateFileId, setTemplateFileId] = useState<string>("");
  const [spreadsheetFileId, setSpreadsheetFileId] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const storedTemplateFileId = localStorage.getItem("html_key");
    const storedSpreadsheetFileId = localStorage.getItem("xlsx_key");

    if (storedTemplateFileId) {
      setTemplateFileId(storedTemplateFileId);
    }

    if (storedSpreadsheetFileId) {
      setSpreadsheetFileId(storedSpreadsheetFileId);
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = new FormData(ref.current);

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors
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
        return;
      }

      alert(response.status + ": " + response.message);
      ref.current.reset();
    } catch (error: any) {
      alert("Failed to send form data: " + error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <p className="text-4xl font-bold pt-2">Send Emails</p>
        <p className="text-gray-500 italic pb-4">
          Enter your <strong>subject</strong> and <strong>display name</strong>.
        </p>
      </div>
      <form onSubmit={onSubmit} ref={ref}>
        <div className="rounded-md bg-gray-50 p-4">
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
            {/* <label className="mb-2 block text-sm font-medium">
              Enter your template file id
            </label> */}
            <input
              id="template_file_id"
              name="template_file_id"
              type="hidden" // to show: change this to text
              placeholder="template_file_id"
              value={templateFileId}
              onChange={(event) => setTemplateFileId(event.target.value)}
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.template_file_id ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.template_file_id && (
              <p className="text-red-500 text-sm">{errors.template_file_id}</p>
            )}
          </div>
          <div className="m-3">
            {/* <label className="mb-2 block text-sm font-medium">
              Enter your spreadsheet file id
            </label> */}
            <input
              id="spreadsheet_file_id"
              name="spreadsheet_file_id"
              type="hidden" // to show: change this to text
              placeholder="spreadsheet_file_id"
              value={spreadsheetFileId}
              onChange={(event) => setSpreadsheetFileId(event.target.value)}
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.spreadsheet_file_id
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />
            {errors.spreadsheet_file_id && (
              <p className="text-red-500 text-sm">
                {errors.spreadsheet_file_id}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex justify-end my-3 gap-3">
          <button
            type="submit"
            className="text-white min-w-32 flex justify-center items-center bg-sky-950 hover:bg-sky-800 h-10 rounded-lg px-4 md:text-base text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            disabled={isSubmitting}
          >
            Send Emails
          </button>
        </div>
      </form>
    </>
  );
}
