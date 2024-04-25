"use client";
import React from "react";
import { submitForm } from "@/app/lib/actions";

export default function SendForm() {
  return (
    <form action={submitForm}>
      <div className="rounded-md bg-gray-50 p-4">
        <div className="m-3">
          <label className="mb-2 block text-sm font-medium">
            Enter your email title
          </label>
          <input
            id="email_title"
            name="email_title"
            type="text"
            placeholder="email_title"
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
            className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
          />
        </div>
        <div className="m-3">
          <label className="mb-2 block text-sm font-medium">
            Enter your spreadsheet id
          </label>
          <input
            id="spreadsheet_id"
            name="spreadsheet_id"
            type="text"
            placeholder="spreadsheet_id"
            className="block rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500 w-full"
          />
        </div>
      </div>
      <div className="w-full flex justify-end my-3 gap-3">
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-sky-800 px-4 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 active:bg-sky-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
        >
          Send Form
        </button>
      </div>
    </form>
  );
}
