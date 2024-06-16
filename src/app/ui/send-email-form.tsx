"use client";
import React, { useRef, useState, useEffect, FormEvent } from "react";
import { submitForm } from "@/lib/actions";
import SelectDropdown from "./select-dropdown";

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
  const [templateOptions, setTemplateOptions] = useState<fileDataType[] | null>(
    null
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // useEffect(() => {
  //   fetchFiles("html", 30, setTemplateOptions);
  //   fetchFiles("xlsx", 30, setSpreadsheetOptions);
  // }, []);

  const fetchFiles = async (
    file_extension: string,
    limit: number,
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

  const handleSelect = (file_id: string) => {
    console.log(file_id);
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
              <SelectDropdown onSelect={handleSelect} />
            </div>
            {errors.template_file_id && (
              <p className="text-red-500 text-sm">{errors.template_file_id}</p>
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
