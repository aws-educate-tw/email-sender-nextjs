import React, { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Upload, Plus, X, Trash2 } from "lucide-react";
import { EmailDataType } from "@/app/ui/emailService/email-service";

import SpreadsheetDropdown from "@/app/ui/emailService/spreadsheet-dropdown";

export type TableChangeMeta = {
  source: "init" | "user";
  origin: "dropdown" | "import" | "manual";
};

interface Excel {
  id: string;
  [key: string]: string;
}

interface SpreadsheetEditorProps {
  emailData: EmailDataType;
  onTableChange: (excel: Excel[], meta: TableChangeMeta) => void;
  onSelectSpreadsheetFile?: (file_id: string, file_url: string, file_name: string) => void;
}

export default function SpreadsheetEditor({
  emailData,
  onTableChange,
  onSelectSpreadsheetFile,
}: SpreadsheetEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Excel[]>([
    { id: Date.now() + Math.random().toString(36).substring(2) },
  ]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

  const applyData = (next: Excel[], meta: TableChangeMeta) => {
    setData(next);
    onTableChange(next, meta);
  };

  useEffect(() => {
    if (emailData.spreadsheetFileUrl) {
      setSelectedFileUrl(emailData.spreadsheetFileUrl);
    }
  }, [emailData.spreadsheetFileUrl]);

  useEffect(() => {
    if (!selectedFileUrl) return;

    const fetchAndParseExcel = async () => {
      try {
        const response = await fetch(selectedFileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: "buffer" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);

        const newData: Excel[] = [];
        const newColumnSet = new Set<string>();

        jsonData.forEach((row: any) => {
          const recipient: Excel = { id: Date.now() + Math.random().toString(36).substring(2) };
          Object.entries(row).forEach(([key, value]) => {
            if (key !== "id") {
              recipient[key] = String(value);
              newColumnSet.add(key);
            }
          });
          newData.push(recipient);
        });

        const newColumns = Array.from(newColumnSet);
        setColumns(newColumns);
        setColumnWidths(() => {
          const widths: { [key: string]: number } = {};
          newColumns.forEach(col => {
            widths[col] = 150;
          });
          return widths;
        });

        applyData(newData, { source: "init", origin: "dropdown" });
      } catch (error) {
        console.error("Failed to load spreadsheet from URL", error);
      }
    };

    fetchAndParseExcel();
  }, [selectedFileUrl]);

  // Notify parent whenever data changes
  // useEffect(() => {
  //   onTableChange(data);
  // }, [data, onTableChange]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImportSheet = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setData([]);
    setColumns([]);
    setColumnWidths({});

    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0]; // 只抓第一個檔案
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(ws);

    const newData: Excel[] = [];
    const newColumnSet = new Set<string>();

    jsonData.forEach((row: any) => {
      const recipient: Excel = { id: Date.now() + Math.random().toString(36).substring(2) };
      Object.entries(row).forEach(([key, value]) => {
        if (key !== "id") {
          recipient[key] = String(value);
          newColumnSet.add(key);
        }
      });
      newData.push(recipient);
    });

    const newColumns = Array.from(newColumnSet);

    setColumns(newColumns);
    setColumnWidths(() => {
      const widths: { [key: string]: number } = {};
      newColumns.forEach(col => {
        widths[col] = 150;
      });
      return widths;
    });
    applyData(newData, { source: "init", origin: "import" });

    // 清空 input 的值，避免使用者選同一個檔案時不觸發 onChange
    e.target.value = "";
  };

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const next = [...data];
    next[rowIndex][column] = value;
    applyData(next, { source: "user", origin: "manual" });
  };

  const handleColumnNameChange = (oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) {
      setEditingColumn(null);
      return;
    }
    if (columns.includes(newName) && newName !== oldName) {
      alert("欄位名稱已存在，請使用不同的名稱");
      setEditingColumn(null);
      return;
    }

    const nextColumns = columns.map(col => (col === oldName ? newName : col));
    const nextWidths = { ...columnWidths, [newName]: columnWidths[oldName] || 150 };
    delete nextWidths[oldName];

    const nextData = data.map(row => {
      const r = { ...row };
      if (r[oldName] !== undefined) {
        r[newName] = r[oldName];
        delete r[oldName];
      }
      return r;
    });

    setColumns(nextColumns);
    setColumnWidths(nextWidths);
    setEditingColumn(null);
    applyData(nextData, { source: "user", origin: "manual" });
  };

  const addRow = () => {
    const newRow: Excel = { id: Date.now() + Math.random().toString(36).substring(2) };
    columns.forEach(col => (newRow[col] = ""));
    applyData([...data, newRow], { source: "user", origin: "manual" });
  };

  const addColumn = () => {
    const base = `新欄位${columns.length + 1}`;
    let name = base;
    let i = 1;
    while (columns.includes(name)) {
      name = `${base}_${i++}`;
    }
    setColumns(prev => [...prev, name]);
    setColumnWidths(prev => ({ ...prev, [name]: 150 }));
    const next = data.map(row => ({ ...row, [name]: "" }));
    applyData(next, { source: "user", origin: "manual" });
  };

  const deleteRow = (idx: number) => {
    const next = data.filter((_, i) => i !== idx);
    applyData(next, { source: "user", origin: "manual" });
  };

  const deleteColumn = (col: string) => {
    if (columns.length <= 1) {
      alert("至少需要保留一個欄位");
      return;
    }
    const nextColumns = columns.filter(c => c !== col);
    const w = { ...columnWidths };
    delete w[col];
    setColumns(nextColumns);
    setColumnWidths(w);
    const next = data.map(row => {
      const r = { ...row };
      delete r[col];
      return r;
    });
    applyData(next, { source: "user", origin: "manual" });
  };

  const handleMouseDown = (col: string, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = columnWidths[col] || 150;
    const scrollContainer = e.currentTarget.closest(".overflow-auto");

    const onMouseMove = (ev: MouseEvent) => {
      const diff = ev.clientX - startX;
      setColumnWidths(prev => ({ ...prev, [col]: Math.max(50, startW + diff) }));
    };
    const onMouseUp = () => {
      if (scrollContainer) (scrollContainer as HTMLElement).style.pointerEvents = "auto";
      document.body.style.userSelect = "auto";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    if (scrollContainer) (scrollContainer as HTMLElement).style.pointerEvents = "none";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-end gap-2 items-center">
        <SpreadsheetDropdown
          selectedFileName={emailData.spreadsheetFileName}
          onSelect={(file_id, file_url, file_name) => {
            if (file_url) setSelectedFileUrl(file_url);
            onSelectSpreadsheetFile?.(file_id, file_url, file_name);
          }}
        />
        <hr className="border-2 border-t border-gray-300 mt-4 mb-3 w-12" />
        <p className="text-gray-400">or</p>
        <hr className="border-2 border-t border-gray-300 mt-4 mb-3 w-12" />
        <button
          onClick={triggerFileInput}
          className="px-4 py-2 flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-950 border border-gray-300 rounded-lg shadow-md"
        >
          <Upload className="mr-2 w-4 h-4" /> Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          multiple={false}
          className="hidden"
          onChange={handleImportSheet}
        />
      </div>

      <div className="relative w-full">
        {/* Gradient overlay for scrollable area */}
        {/* <div className="absolute rounded-lg top-0 right-0 w-8 h-full pointer-events-none z-10 bg-gradient-to-l from-white to-transparent" /> */}

        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 mt-2 p-4 overflow-auto max-h-[60vh] w-full">
          <div className="min-w-fit">
            <table className="text-sm min-w-max w-fit">
              <thead>
                <tr>
                  {/* First column header (for trash can) */}
                  <th className="border-2 border-gray-400 h-5 min-w-8 w-8 bg-gray-100"></th>
                  {columns.map(col => (
                    <th
                      key={col}
                      className="border-2 border-gray-400 bg-gray-100 text-left whitespace-nowrap relative"
                      style={{ width: `${columnWidths[col] || 150}px` }}
                    >
                      <div className="flex items-center justify-between h-full">
                        <div className="flex-1 h-full">
                          {editingColumn === col ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              defaultValue={col}
                              autoFocus
                              onBlur={e => handleColumnNameChange(col, e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") e.currentTarget.blur();
                                if (e.key === "Escape") setEditingColumn(null);
                              }}
                              onClick={e => e.stopPropagation()}
                            />
                          ) : (
                            <div
                              className="w-full px-2 py-1 text-sm truncate cursor-pointer hover:bg-gray-200"
                              onClick={() => setEditingColumn(col)}
                            >
                              {col}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteColumn(col)}
                          className="p-1 m-1 hover:bg-red-200 rounded-full text-red-600 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                        onMouseDown={e => handleMouseDown(col, e)}
                      />
                    </th>
                  ))}
                  <th className="min-w-40 w-fit h-3 p-2 border-2 border-gray-400 bg-gray-100">
                    <button
                      onClick={addColumn}
                      className="w-full h-full flex items-center justify-center hover:bg-gray-200 text-green-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length + 2}
                      className="text-center text-gray-500 py-4 border-2	border-gray-200"
                    >
                      尚未上傳 Excel 資料
                    </td>
                  </tr>
                )}
                {data.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {/* First column data cell (for trash can) */}
                    <td className="w-3 h-3 p-2 border-2	border-gray-200 bg-gray-50">
                      <button
                        onClick={() => deleteRow(idx)}
                        className="w-full h-full flex items-center justify-center hover:bg-red-200 rounded text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                    {columns.map(col => (
                      <td
                        key={col}
                        className="border-2 border-gray-200"
                        style={{ width: `${columnWidths[col] || 150}px` }}
                      >
                        <input
                          type="text"
                          className="border-none w-full px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={row[col] || ""}
                          onChange={e => handleCellChange(idx, col, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="border-2	border-gray-200 w-10"></td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={columns.length + 2} className="border-2	border-gray-200 bg-gray-50">
                    <button
                      onClick={addRow}
                      className="w-full py-2 px-8 flex items-center justify-start hover:bg-gray-200 text-sky-950"
                    >
                      <Plus className="w-4 h-4 mr-1" /> 新增一行
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
