"use client";

import React, { useState } from "react";

interface EmailServiceTemplateEditorProps {
  onNext: () => void;
}

export default function EmailServiceTemplateEditor({ onNext }: EmailServiceTemplateEditorProps) {
  const [subject, setSubject] = useState("New Email Subject");
  const [html, setHtml] = useState("<p>Start writing your email content here...</p>");

  const handleSave = () => {
    // 模擬儲存邏輯
    console.log("Saving template:", { subject, html });
    onNext(); // 進到下一步（recipients）
  };

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Edit Email Template</h2>

      <div>
        <label className="block mb-1 font-medium">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">HTML Content</label>
        <textarea
          value={html}
          onChange={e => setHtml(e.target.value)}
          rows={10}
          className="w-full border rounded-lg px-3 py-2 font-mono text-sm"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Save and Continue →
      </button>
    </div>
  );
}
