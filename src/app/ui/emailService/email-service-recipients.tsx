import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import SpreadsheetEditor from "@/app/ui/emailService/spreadsheet-editor";
import TemplateVariablesInfo from "@/app/ui/emailService/template-variables-info";

interface TemplateProps {
  onNext: () => void;
  templateFileId?: string | null;
  onSave?: (
    spreadsheetFileName: string,
    spreadsheetFileId: string,
    spreadsheetFileUrl: string
  ) => void;
}

interface Excel {
  id: string;
  [key: string]: string;
}

interface Column {
  id: string;
  name: string;
  isStandard?: boolean;
}

export default function EmailServiceRecipients({ onNext, templateFileId, onSave }: TemplateProps) {
  const [excel, setExcel] = useState<Excel[]>([]);
  const [fileName, setFileName] = useState("");
  const [, setAllColumns] = useState<Column[]>([]);
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);
  const [templateFileName, setTemplateFileName] = useState<string>("Unknown File Name");
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);
  const [isSave, setIsSave] = useState(false);

  // Fetch template variables and always include "Email"
  useEffect(() => {
    if (!templateFileId) return;
    const fetchVariables = async () => {
      setIsLoadingVariables(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/files/${templateFileId}/template-variables`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        const data = await res.json();
        setTemplateFileName(data.file_name || "Unknown File");

        // Ensure "Email" is always included
        const varsWithEmail = Array.from(new Set([...(data.variables || []), "Email"]));
        setTemplateVariables(varsWithEmail);

        // Build columns for rendering/editing
        const variableColumns = varsWithEmail.map((v: string) => ({ id: `var-${v}`, name: v }));
        setAllColumns(prev => [...prev.filter(col => col.isStandard), ...variableColumns]);
      } catch (err) {
        console.error("Failed to load variables:", err);
      } finally {
        setIsLoadingVariables(false);
      }
    };
    fetchVariables();
  }, [templateFileId]);

  // Re-calculate missing variables whenever excel data or templateVariables change
  useEffect(() => {
    const excelColumns = excel.length > 0 ? Object.keys(excel[0]) : [];
    const missing = templateVariables.filter(v => !excelColumns.includes(v));
    setMissingVariables(missing);
  }, [excel, templateVariables]);

  useEffect(() => {
    setIsSave(false);
  }, [fileName, excel]);

  const handleUploadExcelData = async () => {
    if (!fileName || excel.length === 0) {
      alert("請輸入檔案名稱並上傳至少一筆資料");
      return;
    }
    if (missingVariables.length > 0) {
      alert(`缺少以下欄位: ${missingVariables.join(", ")}`);
      return;
    }

    try {
      // 1. Create Excel file from JSON data
      const worksheet = XLSX.utils.json_to_sheet(excel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const file = new File([blob], `${fileName}.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // 2. Upload API
      const formData = new FormData();
      formData.append("file", file);

      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const url = new URL(`${base_url}/upload-multiple-file`);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`上傳失敗: ${response.status}`);
      }

      const result = await response.json();
      const saved = result.files?.[0];
      if (onSave && saved) {
        onSave(saved.file_name, saved.file_id, saved.file_url);
      }
      setIsSave(true);
    } catch (error: any) {
      console.error("❌ 上傳失敗:", error);
      alert("上傳失敗：" + error.message);
    }
  };

  const handleNextClick = () => {
    if (onNext) {
      onNext();
    } else {
      window.location.href = "/emailService";
    }
  };

  const handleTableChange = useCallback((data: any) => {
    setExcel(data);
  }, []);

  return (
    <>
      <div className="space-y-6 mb-6">
        <TemplateVariablesInfo
          templateFileName={templateFileName}
          templateVariables={templateVariables}
          isLoading={isLoadingVariables}
          missingVariables={missingVariables}
        />
        <SpreadsheetEditor onTableChange={handleTableChange} />
      </div>

      {/* File name input, upload button and next button */}
      <div className="flex flex-wrap justify-end gap-3 items-center h-12">
        <input
          type="text"
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          placeholder="Enter file name"
          className="rounded-md border border-gray-300 px-3 py-2 text-base w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
        />
        <button
          onClick={handleUploadExcelData}
          disabled={!fileName || excel.length === 0 || missingVariables.length > 0}
          className={`flex items-center justify-center rounded-md px-4 py-3 text-base font-medium text-white transition-colors
    ${
      !fileName || excel.length === 0 || missingVariables.length > 0
        ? "bg-gray-400 cursor-not-allowed"
        : isSave
          ? "bg-green-600 hover:bg-green-700"
          : "bg-[#1a2f4a] hover:bg-[#1a2f4a]/90"
    }`}
        >
          {isSave ? "Saved" : "Save Spreadsheet"}
        </button>
        <button
          onClick={handleNextClick}
          className="rounded-md bg-[#1a2f4a] hover:bg-[#1a2f4a]/90 px-4 py-3 text-base font-medium text-white transition-colors"
        >
          Next
        </button>
      </div>
    </>
  );
}
