"use client";
import React, { useState, useEffect, KeyboardEvent, MouseEvent } from "react";

interface EmailInputProps {
  allowMultiple?: boolean;
  value: string[]; // controlled list of emails
  onEmailsChange: (emails: string[]) => void;
}

const contacts = [
  { name: "Alice Wang", email: "alice@example.com" },
  { name: "Alice Cheng", email: "alicecheng@example.com" },
  { name: "Alice Tai", email: "alicetai@example.com" },
  { name: "Bob Chen", email: "bob@example.com" },
  { name: "Cathy Lin", email: "cathy@example.com" },
  { name: "David Wu", email: "david@example.com" },
];

export default function EmailInput({
  allowMultiple = true,
  value,
  onEmailsChange,
}: EmailInputProps) {
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState<typeof contacts>([]);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 = no selection

  useEffect(() => {
    const keyword = email.toLowerCase();
    if (keyword) {
      const matched = contacts
        .filter(
          c => c.name.toLowerCase().includes(keyword) || c.email.toLowerCase().includes(keyword)
        )
        .slice(0, 5);
      setSuggestions(matched);
      setActiveIndex(matched.length > 0 ? 0 : -1);
    } else {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  }, [email]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmed = email.trim();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex(prev => (prev + 1) % suggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      }
    } else if ((e.key === "Enter" || e.key === "Tab") && trimmed) {
      e.preventDefault();
      if (suggestions.length > 0 && activeIndex >= 0) {
        handleSuggestionClick(suggestions[activeIndex].email);
      } else if (validateEmail(trimmed)) {
        addEmail(trimmed);
      } else {
        alert("Please enter a valid email address");
      }
    } else if (e.key === "Backspace" && trimmed === "" && value.length > 0) {
      e.preventDefault();
      onEmailsChange(value.slice(0, -1));
    } else if (e.key === "Escape") {
      setActiveIndex(-1);
      setSuggestions([]);
    }
  };

  const addEmail = (newEmail: string) => {
    if (allowMultiple || value.length === 0) {
      onEmailsChange([...value, newEmail]);
    } else {
      onEmailsChange([newEmail]);
    }
    setEmail("");
    setSuggestions([]);
  };

  const handleSuggestionClick = (selectedEmail: string) => {
    if (validateEmail(selectedEmail)) {
      addEmail(selectedEmail);
    }
  };

  const removeEmail = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    const updated = value.filter((_, i) => i !== index);
    onEmailsChange(updated);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-md shadow-sm flex items-center flex-wrap border border-gray-200 p-2 gap-2 focus-within:border-blue-500 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500">
        {value.map((email, index) => (
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
            !allowMultiple && value.length > 0
              ? "Edit the existing email and press tab"
              : "Type an email and press tab"
          }
          className="flex-grow p-2 outline-none border-none focus:ring-0 text-sm rounded-md"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full shadow z-10">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSuggestionClick(s.email)}
              className={`px-3 py-1 text-sm cursor-pointer ${
                idx === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
            >
              {s.name} &lt;{s.email}&gt;
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
