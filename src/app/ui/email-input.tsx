"use client";
import React, { useState, useEffect, KeyboardEvent, MouseEvent } from "react";

interface EmailInputProps {
  allowMultiple?: boolean;
  onEmailsChange: (emails: string[]) => void;
  initialEmails?: string[] | string;
}

export default function EmailInput({
  allowMultiple = true,
  onEmailsChange,
  initialEmails = [],
}: EmailInputProps) {
  const normalizeInitialEmails = (input: string[] | string): string[] => {
    if (typeof input === "string") {
      return input.trim() ? [input.trim()] : [];
    }
    return input.map(email => email.trim()).filter(Boolean);
  };

  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>(normalizeInitialEmails(initialEmails));

  useEffect(() => {
    onEmailsChange(emails);
  }, [emails]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Tab" || e.key === "Enter") && email.trim()) {
      e.preventDefault(); // Prevent default tab/enter behavior
      if (validateEmail(email.trim())) {
        if (allowMultiple || emails.length === 0) {
          setEmails(prevEmails => [...prevEmails, email.trim()]);
        } else {
          setEmails([email.trim()]);
        }
        setEmail("");
      } else {
        alert("Please enter a valid email address");
      }
    }
  };

  const removeEmail = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setEmails(prevEmails => prevEmails.filter((_, i) => i !== index));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <div className="bg-white rounded-md shadow-sm flex items-center flex-wrap border border-gray-200 p-2 gap-2 focus-within:border-blue-500 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500">
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex items-center bg-neutral-400 bg-opacity-50 hover:bg-opacity-70 px-2 rounded-md"
          >
            <span className="mr-2 text-sm">{email}</span>
            <button
              onClick={e => removeEmail(e, index)}
              className="text-black-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            !allowMultiple && emails.length > 0
              ? "Edit the existing email and press tab"
              : "Type an email and press tab"
          }
          className="flex-grow p-2 outline-none border-none focus:ring-0 text-sm rounded-md"
        />
      </div>
    </div>
  );
}
