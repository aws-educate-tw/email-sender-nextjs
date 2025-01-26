"use client";
import React, { useState, useRef, useEffect } from "react";

interface WebhookTypeDropdownProps {
  onSelect: (type: string) => void;
}

export default function WebhookTypeDropdown({ onSelect }: WebhookTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("surveycake");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (type: string) => {
    setSelectedType(type);
    onSelect(type); // Pass the selected type to the parent component
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {selectedType === "surveycake" ? "SurveyCake" : "Slack"}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div>
            <div
              className="hover:bg-gray-200 cursor-pointer active:bg-gray-300 py-2 px-4 text-sm"
              onClick={() => handleSelect("surveycake")}
            >
              SurveyCake
            </div>
            <div
              className="hover:bg-gray-200 cursor-pointer active:bg-gray-300 py-2 px-4 text-sm"
              onClick={() => handleSelect("slack")}
            >
              Slack
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
