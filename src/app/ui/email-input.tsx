"use client";
import React, { useState, useEffect, KeyboardEvent, MouseEvent } from "react";

interface EmailInputProps {
  allowMultiple?: boolean;
  onEmailsChange: (emails: string[]) => void;
}

export default function EmailInput({
  allowMultiple,
  onEmailsChange,
}: EmailInputProps) {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    onEmailsChange(emails);
  }, [emails, onEmailsChange]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && email.trim()) {
      if (validateEmail(email.trim())) {
        if (allowMultiple) {
          setEmails((prevEmails) => [...prevEmails, email.trim()]);
        } else {
          setEmails([email.trim()]);
        }
        setEmail("");
        onEmailsChange(emails);
      } else {
        alert("Please enter a valid email address");
      }
    }
  };

  const removeEmail = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setEmails((prevEmails) => {
      const updatedEmails = prevEmails.filter((_, i) => i !== index);
      onEmailsChange(updatedEmails); // Notify parent of the change
      return updatedEmails;
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="p-4">
      <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2">
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 px-2 py-1 rounded-md"
          >
            <span className="mr-2">{email}</span>
            <button
              onClick={(e) => removeEmail(e, index)}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            !allowMultiple && emails.length > 0
              ? "Edit the existing email and press tab"
              : "Type an email and press tab"
          }
          className="flex-grow p-2 outline-none border-none focus:ring-0"
        />
      </div>
    </div>
  );
}
