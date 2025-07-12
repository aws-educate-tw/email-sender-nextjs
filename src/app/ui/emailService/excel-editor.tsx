import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";

interface Excel {
  id: string;
  [key: string]: string;
}

interface ExcelEditorProps {
  onTableChange: (excel: Excel[]) => void;
}

export default function ExcelEditor({ onTableChange }: ExcelEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<Excel[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [isResizing, setIsResizing] = useState<string | null>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportSheet = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const allMergedData: Excel[] = [];
    const allColumnSet = new Set<string>();

    for (const file of Array.from(e.target.files)) {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "buffer" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws);

      jsonData.forEach((row: any) => {
        const recipient: Excel = {
          id: Date.now() + Math.random().toString(36).substring(2),
        };
        Object.entries(row).forEach(([key, value]) => {
          recipient[key] = String(value);
          allColumnSet.add(key);
        });
        allMergedData.push(recipient);
      });
    }

    const newColumns = Array.from(allColumnSet);
    setColumns(newColumns);

    // 為新欄位設定預設寬度
    const newWidths = { ...columnWidths };
    newColumns.forEach(col => {
      if (!newWidths[col]) {
        newWidths[col] = 150; // 預設寬度
      }
    });
    setColumnWidths(newWidths);

    setData(prev => [...prev, ...allMergedData]);
    onTableChange([...data, ...allMergedData]);
  };

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const updatedData = [...data];
    updatedData[rowIndex][column] = value;
    setData(updatedData);
    onTableChange(updatedData);
  };

  const handleMouseDown = (column: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(column);

    const startX = e.clientX;
    const startWidth = columnWidths[column] || 150;

    // 取得滾動容器的引用
    const scrollContainer = e.currentTarget.closest(".overflow-auto");

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const newWidth = Math.max(50, startWidth + (e.clientX - startX));
      setColumnWidths(prev => ({
        ...prev,
        [column]: newWidth,
      }));
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(null);

      // 重新啟用滾動
      if (scrollContainer) {
        (scrollContainer as HTMLElement).style.pointerEvents = "auto";
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "auto";
    };

    // 暫時禁用滾動和文字選取
    if (scrollContainer) {
      (scrollContainer as HTMLElement).style.pointerEvents = "none";
    }
    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-end ">
        <button
          className="p-2 flex items-center hover:bg-gray-100 rounded-lg"
          onClick={triggerFileInput}
        >
          <Upload className="mr-2 w-4 h-4" /> Import Excel File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          multiple
          className="hidden"
          onChange={handleImportSheet}
        />
      </div>

      <div className="relative w-full">
        <div className="absolute rounded-lg top-0 right-0 w-8 h-full pointer-events-none z-10 bg-gradient-to-l from-white to-transparent" />
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mt-2 p-4 overflow-auto max-h-[60vh] w-full">
          {/* 右側淡出效果 */}
          <div className="min-w-fit">
            <table className="text-sm min-w-max w-full">
              <thead>
                <tr>
                  {columns.map(col => (
                    <th
                      key={col}
                      className="border-2 border-gray-400 px-3 py-2 bg-gray-100 text-left whitespace-nowrap relative"
                      style={{ width: `${columnWidths[col] || 150}px` }}
                    >
                      <div className="truncate pr-3">{col}</div>
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-blue-500 transition-all z-10"
                        onMouseDown={e => handleMouseDown(col, e)}
                        style={{
                          backgroundColor: isResizing === col ? "#3b82f6" : "transparent",
                          width: "6px",
                          marginRight: "-3px",
                        }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length || 1}
                      className="flex itemc-center w-full justify-center text-center text-gray-500 py-4"
                    >
                      尚未上傳 Excel 資料
                    </td>
                  </tr>
                )}
                {data.map((row, rowIndex) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {columns.map(col => (
                      <td
                        key={col}
                        className="border-2 border-gray-200"
                        style={{ width: `${columnWidths[col] || 150}px` }}
                      >
                        <input
                          type="text"
                          className="border-none w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={row[col] || ""}
                          onChange={e => handleCellChange(rowIndex, col, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
