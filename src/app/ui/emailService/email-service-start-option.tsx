"use client";

import React from "react";

interface EmailServiceStartOptionProps {
  onSelect: (mode: "new" | "edit-existing" | "resend") => void;
}

export default function EmailServiceStartOption({ onSelect }: EmailServiceStartOptionProps) {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mt-12 space-y-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            How would you like to begin?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button
              onClick={() => onSelect("new")}
              className="w-full h-full p-8 bg-sky-950 border border-gray-200 rounded-2xl hover:bg-sky-900 hover:border-gray-300 text-left transition-all duration-300 group shadow-lg hover:shadow-xl flex flex-col"
            >
              <div className="flex flex-col items-center text-center space-y-4 flex-1">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300 mb-4">
                  ✏️
                </div>
                <div className="font-semibold text-white text-xl mb-3">Write a new email</div>
                <div className="text-gray-300 leading-relaxed">
                  Start from scratch with a new template
                </div>
              </div>
            </button>

            <button
              onClick={() => onSelect("edit-existing")}
              className="w-full h-full p-8 bg-sky-950 border border-gray-200 rounded-2xl hover:bg-sky-900 hover:border-gray-300 text-left transition-all duration-300 group shadow-lg hover:shadow-xl flex flex-col"
            >
              <div className="flex flex-col items-center text-center space-y-4 flex-1">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300 mb-4">
                  🧩
                </div>
                <div className="font-semibold text-white text-xl mb-3">
                  Modify an existing template
                </div>
                <div className="text-gray-300 leading-relaxed">
                  Choose a saved template to edit and send
                </div>
              </div>
            </button>

            <button
              onClick={() => onSelect("resend")}
              className="w-full h-full p-8 bg-sky-950 border border-gray-200 rounded-2xl hover:bg-sky-900 hover:border-gray-300 text-left transition-all duration-300 group shadow-lg hover:shadow-xl flex flex-col"
            >
              <div className="flex flex-col items-center text-center space-y-4 flex-1">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300 mb-4">
                  🔁
                </div>
                <div className="font-semibold text-white text-xl mb-3">Resend a previous email</div>
                <div className="text-gray-300 leading-relaxed">
                  Pick an email you've sent before and resend it
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
