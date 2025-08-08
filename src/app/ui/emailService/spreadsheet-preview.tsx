import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { AlertCircle, Database } from "lucide-react";
import { Excel } from "@/app/ui/emailService/type";

interface ExcelPreviewProps {
  fileUrl: string;
  readOnly?: boolean;
  onTableChange?: (excel: Excel[]) => void;
}

export default function SpreadsheetPreview({
  fileUrl,
  readOnly = true,
  onTableChange,
}: ExcelPreviewProps) {
  const [data, setData] = useState<Excel[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpreadsheet = async () => {
      if (!fileUrl) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
          throw new Error(`Failed to load spreadsheet: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);

        const excelData: Excel[] = [];
        const columnSet = new Set<string>();

        jsonData.forEach((row: any) => {
          const excelRow: Excel = {
            id: Date.now() + Math.random().toString(36).substring(2),
          };

          Object.entries(row).forEach(([key, value]) => {
            excelRow[key] = String(value);
            columnSet.add(key);
          });

          excelData.push(excelRow);
        });

        const newColumns = Array.from(columnSet);
        setColumns(newColumns);

        // Set default column widths
        const defaultWidths: { [key: string]: number } = {};
        newColumns.forEach(col => {
          defaultWidths[col] = 150;
        });
        setColumnWidths(defaultWidths);

        setData(excelData);

        if (onTableChange && !readOnly) {
          onTableChange(excelData);
        }
      } catch (err: any) {
        console.error("Error loading spreadsheet:", err);
        setError(`Error loading spreadsheet: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpreadsheet();
  }, [fileUrl, readOnly, onTableChange]);

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    if (readOnly) return;

    const updatedData = [...data];
    updatedData[rowIndex][column] = value;
    setData(updatedData);

    if (onTableChange) {
      onTableChange(updatedData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-slate-500">Loading spreadsheet data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 bg-slate-50">
        <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 bg-slate-50">
        <Database className="w-8 h-8 text-slate-400 mb-3" />
        <p className="text-slate-500 italic">No data found in spreadsheet</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="bg-white rounded-lg p-4 overflow-auto w-full">
        <div className="min-w-fit">
          <table className="text-sm min-w-max w-full">
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col}
                    className="border-2 border-gray-400 bg-gray-100 text-left p-2 whitespace-nowrap"
                    style={{ width: `${columnWidths[col] || 150}px` }}
                  >
                    <div className="flex items-center justify-between h-full">
                      <div className="flex-1 h-full">
                        <div className="w-full truncate font-medium">{col}</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${rowIndex % 2 === 0 ? "bg-gray-50/30" : ""}`}
                >
                  {columns.map(col => (
                    <td
                      key={col}
                      className="border border-gray-200 p-2"
                      style={{ width: `${columnWidths[col] || 150}px` }}
                    >
                      {readOnly ? (
                        <div className="w-full px-2 py-1">{row[col] || ""}</div>
                      ) : (
                        <input
                          type="text"
                          className="border-none w-full px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={row[col] || ""}
                          onChange={e => handleCellChange(rowIndex, col, e.target.value)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
