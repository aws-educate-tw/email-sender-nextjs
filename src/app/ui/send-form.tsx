"use client";
import React, { useRef, useState, FormEvent } from "react";
import { submitForm } from "@/app/lib/actions";

interface SubmitResponse {
  status: string;
  message: string;
  request_id?: string;
  timestamp?: string;
  sqs_message_id?: string;
}

export default function SendForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ref.current) return;

    const formData = new FormData(ref.current);

    setIsSubmitting(true);
    try {
      const response: SubmitResponse = (await submitForm(
        formData
      )) as SubmitResponse;
      alert(response.status + ": " + response.message);
      ref.current.reset();
    } catch (error: any) {
      alert("Failed to send form data: " + error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <form onSubmit={onSubmit} ref={ref}>
        <div className="rounded-md bg-gray-50 p-4">
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="subject"
              disabled={isSubmitting}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your display name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="display_name"
              disabled={isSubmitting}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your template file id
            </label>
            <input
              id="template_file_id"
              name="template_file_id"
              type="text"
              placeholder="template_file_id"
              disabled={isSubmitting}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
            />
          </div>
          <div className="m-3">
            <label className="mb-2 block text-sm font-medium">
              Enter your spreadsheet file id
            </label>
            <input
              id="spreadsheet_file_id"
              name="spreadsheet_file_id"
              type="text"
              placeholder="spreadsheet_file_id"
              disabled={isSubmitting}
              className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
            />
          </div>
        </div>
        <div className="w-full flex justify-end my-3 gap-3">
          <button
            type="submit"
            className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            disabled={isSubmitting}
          >
            Send Form
          </button>
        </div>
      </form>
    </>
  );
}
