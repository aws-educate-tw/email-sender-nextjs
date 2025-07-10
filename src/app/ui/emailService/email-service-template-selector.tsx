"use client";

import React, { useEffect, useState } from "react";

interface Template {
  id: string;
  name: string;
  updatedAt: string;
}

interface EmailServiceTemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

export default function EmailServiceTemplateSelector({
  onSelect,
}: EmailServiceTemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    // 模擬 API 載入
    setTimeout(() => {
      setTemplates([
        { id: "1", name: "Welcome Email", updatedAt: "2025-07-01" },
        { id: "2", name: "Product Launch", updatedAt: "2025-06-28" },
        { id: "3", name: "Event Reminder", updatedAt: "2025-06-15" },
      ]);
    }, 500);
  }, []);

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Select a template</h2>
      <ul className="space-y-3">
        {templates.map(template => (
          <li
            key={template.id}
            className="p-4 border rounded-xl hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(template.id)}
          >
            <div className="font-medium">{template.name}</div>
            <div className="text-sm text-gray-500">Last updated: {template.updatedAt}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
