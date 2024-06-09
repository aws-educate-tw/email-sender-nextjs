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

export default function SendForNew() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [templateFileId, setTemplateFileId] = useState<string>("");
  const [spreadsheetFileId, setSpreadsheetFileId] = useState<string>("");
  const [templateOptions, setTemplateOptions] = useState<fileDataType[] | null>(
    null
  );
  const [spreadsheetOptions, setSpreadsheetOptions] = useState<
    fileDataType[] | null
  >(null);
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

    // Fetch template options (simulated with a timeout here)
    // setTimeout(() => {
    //   setTemplateOptions(["template1", "template2", "template3"]);
    //   setSpreadsheetOptions(["spreadsheet1", "spreadsheet2", "spreadsheet3"]);
    // }, 1000);
    fetchFiles("xlsx", setTemplateOptions);
    fetchFiles("html", setSpreadsheetOptions);
  }, []);

  const limit = 10;
  const fetchFiles = async (
    file_extension: string,
    setFiles: React.Dispatch<React.SetStateAction<fileDataType[] | null>>
  ) => {
    try {
      const base_url =
        "https://8um2zizr80.execute-api.ap-northeast-1.amazonaws.com/dev";
      const url = new URL(`${base_url}/files`);
      url.searchParams.append("file_extension", file_extension);
      url.searchParams.append("limit", limit.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      if (!response.ok) {
        const errorMessage = `Request failed: ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setFiles(result.data);
    } catch (error: any) {
      alert("Failed to fetch files: " + error.message);
    }
  };

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
            <label className="mb-2 block text-sm font-medium">
              Select your template file:
            </label>
            <select
              id="template_file_id"
              name="template_file_id"
              value={templateFileId}
              onChange={(event) => setTemplateFileId(event.target.value)}
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.template_file_id ? "border-red-500" : "border-gray-200"
              }`}
            >
              <option value="" disabled>
                Select a template
              </option>
              {templateOptions &&
                templateOptions.map((option: fileDataType, index: number) => (
                  <option key={index} value={option.file_id}>
                    {option.file_name}
                  </option>
                ))}
            </select>
            {errors.template_file_id && (
              <p className="text-red-500 text-sm">{errors.template_file_id}</p>
            )}
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Select your spreadsheet file:
            </label>
            <select
              id="spreadsheet_file_id"
              name="spreadsheet_file_id"
              value={spreadsheetFileId}
              onChange={(event) => setSpreadsheetFileId(event.target.value)}
              disabled={isSubmitting}
              className={`block rounded-md border py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full ${
                errors.spreadsheet_file_id
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <option value="" disabled>
                Select a spreadsheet
              </option>
              {spreadsheetOptions &&
                spreadsheetOptions.map(
                  (option: fileDataType, index: number) => (
                    <option key={index} value={option.file_id}>
                      {option.file_name}
                    </option>
                  )
                )}
            </select>
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
