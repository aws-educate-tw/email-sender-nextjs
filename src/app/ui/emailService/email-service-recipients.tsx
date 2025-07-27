import React, { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import SpreadsheetEditor from "@/app/ui/emailService/spreadsheet-editor";
import TemplateVariablesInfo from "@/app/ui/emailService/template-variables-info";
import { TableChangeMeta } from "@/app/ui/emailService/spreadsheet-editor";
import { EmailDataType } from "@/app/ui/emailService/email-service";
import cn from "classnames";
import { ArrowRight } from "lucide-react";

interface EmailServiceProps {
  onNext: () => void;
  emailData: EmailDataType;
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

export default function EmailServiceRecipients({
  onNext,
  emailData,
  templateFileId,
  onSave,
}: EmailServiceProps) {
  const [excel, setExcel] = useState<Excel[]>([]);
  const [fileName, setFileName] = useState("");
  const [, setAllColumns] = useState<Column[]>([]);
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);
  const [templateFileName, setTemplateFileName] = useState<string>("Unknown File Name");
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [missingVariables, setMissingVariables] = useState<string[]>([]);
  const [isSave, setIsSave] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);

  const [selectedSpreadsheetInfo, setSelectedSpreadsheetInfo] = useState<{
    file_id: string;
    file_url: string;
    file_name: string;
  } | null>(null);

  /** 讓父層一旦有 dropdown 選擇，就先把 file_id 送上去（情境1） */
  useEffect(() => {
    if (selectedSpreadsheetInfo) {
      onSave?.(
        selectedSpreadsheetInfo.file_name,
        selectedSpreadsheetInfo.file_id,
        selectedSpreadsheetInfo.file_url
      );
    }
  }, [selectedSpreadsheetInfo]);

  /** 只要 user 有任何編輯（包含 dropdown 案例），就清空父層的 file_id 等（情境2 & 3） */
  const handleTableChange = useCallback(
    (data: Excel[], meta: TableChangeMeta) => {
      setExcel(data);

      if (meta.columns) setColumns(meta.columns);

      if (meta.source === "init") {
        // 來自 editor 的初始化
        if (meta.origin === "dropdown") {
          // 情境1：dropdown 選進來 -> 保留 file_id（不用動）
          return;
        } else {
          // import / 其他初始化都不綁定 server 端檔案
          if (selectedSpreadsheetInfo) {
            setSelectedSpreadsheetInfo(null);
            onSave?.("", "", "");
          }
          return;
        }
      }

      // meta.source === "user"：使用者有編輯
      if (selectedSpreadsheetInfo) {
        // 情境2：之前有選 dropdown，現在改了 -> 清空
        setSelectedSpreadsheetInfo(null);
        onSave?.("", "", "");
      } else {
        // 情境3：沒有 dropdown -> 按你的需求 parent 本來就是 null，不需再特別處理
      }
    },
    [onSave, selectedSpreadsheetInfo]
  );

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
      const worksheet = XLSX.utils.json_to_sheet(excel, { header: columns });
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
      // setHasEdited(false);
      // setSelectedSpreadsheet({
      //   file_id: saved.file_id,
      //   file_name: saved.file_name,
      //   file_url: saved.file_url,
      // });
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

  return (
    <>
      <div className="space-y-6 mb-6">
        <TemplateVariablesInfo
          templateFileName={templateFileName}
          templateVariables={templateVariables}
          isLoading={isLoadingVariables}
          missingVariables={missingVariables}
        />
        <SpreadsheetEditor
          emailData={emailData}
          onTableChange={handleTableChange}
          onSelectSpreadsheetFile={(file_id, file_url, file_name) => {
            // dropdown 選到檔案 → 先回存父層
            setSelectedSpreadsheetInfo({ file_id, file_url, file_name });
          }}
        />
      </div>

      {/* File name input, upload button and next button */}
      <div className="flex flex-wrap justify-end gap-3 items-center h-12">
        <div className="relative flex items-center w-60 h-full">
          <input
            type="text"
            placeholder="Enter file name"
            value={fileName}
            onChange={e => {
              // 自動移除 .html 後綴
              const value = e.target.value.replace(/\.html$/i, "");
              setFileName(value);
            }}
            className="w-full rounded-md border border-gray-300 pl-3 pr-14 py-2 text-base focus:outline focus:ring-2 focus:ring-sky-950 h-full"
          />
          <span className="absolute right-3 text-gray-500 text-sm pointer-events-none">.xlsx</span>
        </div>
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
          disabled={!isSave}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-3 text-base font-medium text-white transition-colors",
            !isSave ? "bg-gray-400 cursor-not-allowed" : "bg-[#1a2f4a] hover:bg-[#1a2f4a]/90"
          )}
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
