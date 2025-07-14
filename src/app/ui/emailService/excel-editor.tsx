import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, Plus, X, Trash2 } from "lucide-react";

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
  const [editingColumn, setEditingColumn] = useState<string | null>(null);

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

  // 處理欄位名稱變更
  const handleColumnNameChange = (oldColumnName: string, newColumnName: string) => {
    if (newColumnName.trim() === "" || newColumnName === oldColumnName) {
      setEditingColumn(null);
      return;
    }

    // 檢查是否有重複的欄位名稱
    if (columns.includes(newColumnName) && newColumnName !== oldColumnName) {
      alert("欄位名稱已存在，請使用不同的名稱");
      setEditingColumn(null);
      return;
    }

    // 更新欄位陣列
    const newColumns = columns.map(col => (col === oldColumnName ? newColumnName : col));
    setColumns(newColumns);

    // 更新欄位寬度設定
    const newColumnWidths = { ...columnWidths };
    if (newColumnWidths[oldColumnName]) {
      newColumnWidths[newColumnName] = newColumnWidths[oldColumnName];
      delete newColumnWidths[oldColumnName];
    }
    setColumnWidths(newColumnWidths);

    // 更新所有資料行的鍵值
    const updatedData = data.map(row => {
      const newRow = { ...row };
      if (newRow[oldColumnName] !== undefined) {
        newRow[newColumnName] = newRow[oldColumnName];
        delete newRow[oldColumnName];
      }
      return newRow;
    });
    setData(updatedData);
    onTableChange(updatedData);
    setEditingColumn(null);
  };

  // 新增一行
  const addRow = () => {
    const newRow: Excel = {
      id: Date.now() + Math.random().toString(36).substring(2),
    };
    // 為每個列初始化空值
    columns.forEach(col => {
      newRow[col] = "";
    });

    const updatedData = [...data, newRow];
    setData(updatedData);
    onTableChange(updatedData);
  };

  // 新增一列
  const addColumn = () => {
    let newColumnName = `新欄位${columns.length + 1}`;
    let counter = 1;

    // 確保欄位名稱不重複
    while (columns.includes(newColumnName)) {
      counter++;
      newColumnName = `新欄位${counter}`;
    }

    const newColumns = [...columns, newColumnName];
    setColumns(newColumns);

    // 設定新列的寬度
    setColumnWidths(prev => ({
      ...prev,
      [newColumnName]: 150,
    }));

    // 為所有現有行添加新列的空值
    const updatedData = data.map(row => ({
      ...row,
      [newColumnName]: "",
    }));
    setData(updatedData);
    onTableChange(updatedData);
  };

  // 刪除指定行
  const deleteRow = (rowIndex: number) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
    onTableChange(updatedData);
  };

  // 刪除指定列
  const deleteColumn = (columnToDelete: string) => {
    if (columns.length <= 1) {
      alert("至少需要保留一個欄位");
      return;
    }

    const newColumns = columns.filter(col => col !== columnToDelete);
    setColumns(newColumns);

    // 移除列寬設定
    const newColumnWidths = { ...columnWidths };
    delete newColumnWidths[columnToDelete];
    setColumnWidths(newColumnWidths);

    // 從所有行中移除該列
    const updatedData = data.map(row => {
      const newRow = { ...row };
      delete newRow[columnToDelete];
      return newRow;
    });
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
          <Upload className="mr-2 w-4 h-4" /> 導入Excel文件
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
          <div className="min-w-fit">
            <table className="text-sm min-w-max w-full">
              <thead>
                <tr>
                  {/* 左上角空白單元格 */}
                  <th className="border-2 border-gray-400 h-5 w-5 bg-gray-100"></th>
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
                              className="w-full px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-none"
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
                              title="點擊編輯欄位名稱"
                            >
                              {col}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteColumn(col)}
                          className="p-1 m-1 hover:bg-red-200 rounded-full text-red-600 flex-shrink-0"
                          title="刪除此列"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* 新增列按鈕 */}
                  <th className="w-3 h-3 p-2 border-2 border-gray-400 bg-gray-100">
                    <button
                      onClick={addColumn}
                      className="w-full h-full flex items-center justify-center hover:bg-gray-200 text-green-600"
                      title="新增欄位"
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
                      className="text-center text-gray-500 py-4 border-2 border-gray-200"
                    >
                      尚未上傳 Excel 資料
                    </td>
                  </tr>
                )}
                {data.map((row, rowIndex) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {/* 行刪除按鈕 */}
                    <td className="w-3 h-3 p-2 border-2 border-gray-200 bg-gray-50">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="w-full h-full flex items-center justify-center hover:bg-red-200 rounded text-red-600"
                        title="刪除此行"
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
                          onChange={e => handleCellChange(rowIndex, col, e.target.value)}
                        />
                      </td>
                    ))}
                    {/* 右側空白單元格對應新增列按鈕 */}
                    <td className="border-2 border-gray-200 w-10"></td>
                  </tr>
                ))}
                {/* 新增行按鈕行 */}
                <tr>
                  <td colSpan={columns.length + 2} className="border-2 border-gray-200 bg-gray-50">
                    <button
                      onClick={addRow}
                      className="w-full py-2 flex items-center justify-center hover:bg-gray-200 text-green-600"
                      title="新增一行"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      新增一行
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
