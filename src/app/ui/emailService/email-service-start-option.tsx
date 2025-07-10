"use client";

import React from "react";

interface EmailServiceStartOptionProps {
  onSelect: (mode: "new" | "edit-existing" | "resend") => void;
}

export default function EmailServiceStartOption({ onSelect }: EmailServiceStartOptionProps) {
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">How would you like to begin?</h2>
      <div className="space-y-3">
        <button
          onClick={() => onSelect("new")}
          className="w-full p-4 border rounded-xl hover:bg-gray-100 text-left"
        >
          ✏️ <span className="font-medium">Write a new email</span>
          <div className="text-sm text-gray-500">Start from scratch with a new template</div>
        </button>
        <button
          onClick={() => onSelect("edit-existing")}
          className="w-full p-4 border rounded-xl hover:bg-gray-100 text-left"
        >
          🧩 <span className="font-medium">Modify an existing template</span>
          <div className="text-sm text-gray-500">Choose a saved template to edit and send</div>
        </button>
        <button
          onClick={() => onSelect("resend")}
          className="w-full p-4 border rounded-xl hover:bg-gray-100 text-left"
        >
          🔁 <span className="font-medium">Resend a previous email</span>
          <div className="text-sm text-gray-500">
            Pick an email you've sent before and resend it
          </div>
        </button>
      </div>
    </div>
  );
}
