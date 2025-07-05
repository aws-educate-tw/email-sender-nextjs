import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ArrowRight, Upload, Pencil, X, Check } from "lucide-react";
import * as XLSX from "xlsx";
import { useEmailContext } from "@/app/context/EmailContext";
import { RecipientTable } from "./email-service-recipients-table";
import { useRouter } from "next/navigation";
import FileUpload from "@/app/ui/file-upload";

interface RecipientsProps {
  onNext: () => void;
}

interface Recipient {
  id: string;
  [key: string]: string; // dynamic columns
}

interface Column {
  id: string;
  name: string;
  tempValue?: string;
  isStandard?: boolean;
}

interface TemplateVariablesResponse {
  variables: string[];
  [key: string]: any;
}

const EnhancedFileUpload = forwardRef(({ OnFileExtension, onUploadSuccess }, ref) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    uploadFile: async file => {
      const formData = new FormData();
      formData.append("file", file);

      setIsSubmitting(true);

      try {
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
          const errorMessage = `Upload failed: ${response.status} - ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();
        if (onUploadSuccess && result.files) {
          onUploadSuccess(result.files);
        }
        return result.files;
      } catch (error) {
        console.error("Upload error:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
  }));

  return <FileUpload OnFileExtension={OnFileExtension} />;
});

EnhancedFileUpload.displayName = "EnhancedFileUpload";

export const EmailServiceRecipients: React.FC<RecipientsProps> = ({ onNext }) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("Enter the file name");
  const [editingTitle, setEditingTitle] = useState("Enter the file name");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [allColumns, setAllColumns] = useState<Column[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);
  const [activeColumnMenu, setActiveColumnMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileData, setFileData] = useState<any>(null);
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const router = useRouter();
  const [lastUploadedRecipients, setLastUploadedRecipients] = useState<string>("");
  const [recipientsChanged, setRecipientsChanged] = useState<boolean>(false);

  const [uploadButtonFlash, setUploadButtonFlash] = useState(false);
  const fileUploadRef = useRef<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [showXlsxUpload, setShowXlsxUpload] = useState<boolean>(false);
  const { emailData, updateEmailData } = useEmailContext();

  const titleInputRef = useRef<HTMLInputElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  const handleXlsxOpenUpload = async () => {
    if (recipients.length === 0) {
      alert("No recipients to save. Please add recipients first.");
      return;
    }

    setIsUploading(true);

    try {
      const worksheet = XLSX.utils.json_to_sheet(
        recipients.map(recipient => {
          const result: { [key: string]: string } = {};
          customColumns.forEach(column => {
            result[column.name] = recipient[column.name] || "";
          });
          return result;
        })
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Recipients");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const file = new File([blob], `${sheetTitle}.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

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
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.files && result.files.length > 0) {
        setLastUploadedRecipients(JSON.stringify(recipients));
        setRecipientsChanged(false);

        const uploadedFile = result.files[0];

        updateEmailData({
          sheetFileId: uploadedFile.file_id,
          sheetFileName: uploadedFile.file_name,
          sheetFileUrl: uploadedFile.file_url,
        });

        setUploadSuccess(true);
        setUploadButtonFlash(true);

        setTimeout(() => {
          setUploadButtonFlash(false);
        }, 2000);
      }
    } catch (error: any) {
      alert("Failed to upload recipients sheet: " + error.message);
      console.error("Error uploading recipients sheet:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleXlsxCloseUpload = () => {
    setShowXlsxUpload(false);
  };

  const handleXlsxSelect = (file_id: string, file_url: string, file_name: string) => {
    updateEmailData({
      sheetFileId: file_id,
      sheetFileName: file_name,
      sheetFileUrl: file_url,
    });
  };

  const saveRecipientsSheet = async () => {
    if (recipients.length === 0) {
      alert("No recipients to save");
      return;
    }

    setIsSaving(true);

    try {
      const worksheet = XLSX.utils.json_to_sheet(
        recipients.map(recipient => {
          const result: { [key: string]: string } = {};
          customColumns.forEach(column => {
            result[column.name] = recipient[column.name] || "";
          });
          return result;
        })
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Recipients");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const file = new File([blob], `${sheetTitle}.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sheetTitle}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShowXlsxUpload(true);
      setIsSaving(false);
    } catch (error: any) {
      alert("Failed to create recipients sheet: " + error.message);
      console.error("Error creating recipients sheet:", error);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchTemplateVariables = async () => {
      if (emailData.templateId) {
        setIsLoadingVariables(true);
        try {
          const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
          const url = `${base_url}/files/${emailData.templateId}/template-variables`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const data: TemplateVariablesResponse = await response.json();

          if (data.variables && Array.isArray(data.variables)) {
            const standardColumns = allColumns.filter(col => col.isStandard);

            const templateVarColumns = data.variables.map(varName => ({
              id: `var-${Date.now()}-${Math.random().toString(36).substring(2)}`,
              name: varName,
              tempValue: "",
            }));

            setAllColumns([...standardColumns, ...templateVarColumns]);

            if (recipients.length > 0) {
              const updatedRecipients = recipients.map(recipient => {
                const updatedRecipient = { ...recipient };
                templateVarColumns.forEach(column => {
                  if (!updatedRecipient[column.name]) {
                    updatedRecipient[column.name] = "";
                  }
                });
                return updatedRecipient;
              });
              setRecipients(updatedRecipients);
            }
          }
        } catch (error) {
          console.error("Failed to fetch template variables:", error);
        } finally {
          setIsLoadingVariables(false);
        }
      }
    };

    fetchTemplateVariables();
  }, [emailData.templateId]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");

    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setImportError("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }

    setIsImporting(true);

    try {
      const data = await readExcelFile(file);

      processExcelData(data);
      setSheetTitle(file.name.replace(/\.[^/.]+$/, ""));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error importing Excel file:", error);
      setImportError("Failed to import Excel file. Please check the format and try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        try {
          if (!e.target?.result) {
            reject("Failed to read file");
            return;
          }

          const wb = XLSX.read(e.target.result, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          const data = XLSX.utils.sheet_to_json(ws);
          resolve(data as any[]);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = error => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  };

  const processExcelData = (data: any[]) => {
    if (data.length === 0) {
      setImportError("No data found in the Excel file");
      return;
    }

    const firstRow = data[0];
    const excelHeaders = Object.keys(firstRow);

    const existingColumnMap = new Map<string, Column>();
    allColumns.forEach(column => {
      existingColumnMap.set(column.name.toLowerCase(), column);
    });

    const newColumns: Column[] = [];
    const columnNameMapping: Record<string, string> = {}; // 用於記錄 Excel 欄位與實際欄位的對應關係

    excelHeaders.forEach(excelHeader => {
      const existingColumn = Array.from(existingColumnMap.entries()).find(
        ([key]) => key === excelHeader.toLowerCase()
      );

      if (existingColumn) {
        const [_, column] = existingColumn;
        newColumns.push(column);
        columnNameMapping[excelHeader] = column.name; // 記錄對應關係
      } else {
        const newColumn: Column = {
          id: `col-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          name: excelHeader,
          tempValue: "",
        };
        newColumns.push(newColumn);
        columnNameMapping[excelHeader] = excelHeader; // 新欄位名稱保持一致
        existingColumnMap.set(excelHeader.toLowerCase(), newColumn); // 更新對照表
      }
    });

    const columnsToKeep = allColumns.filter(column => {
      return !excelHeaders.some(header => header.toLowerCase() === column.name.toLowerCase());
    });

    const updatedColumns = [...newColumns, ...columnsToKeep];
    setAllColumns(updatedColumns);

    const importedRecipients = data.map((row: any) => {
      const recipient: Recipient = {
        id: Date.now() + Math.random().toString(36).substring(2),
      };

      excelHeaders.forEach(excelHeader => {
        const actualColumnName = columnNameMapping[excelHeader];
        recipient[actualColumnName] =
          row[excelHeader] !== undefined ? String(row[excelHeader]) : "";
      });

      return recipient;
    });

    setRecipients([...recipients, ...importedRecipients]);
  };

  const saveTitle = useCallback(() => {
    setSheetTitle(editingTitle);
    setIsEditingTitle(false);
  }, [editingTitle]);

  const toggleEditTitle = () => {
    if (!isEditingTitle) {
      setEditingTitle(sheetTitle);
      setIsEditingTitle(true);
    } else {
      saveTitle();
    }
  };

  const addRecipient = () => {
    const allFieldsHaveValues = customColumns.every(
      column => column.tempValue !== undefined && column.tempValue.trim() !== ""
    );

    if (allFieldsHaveValues) {
      const newRecipient: Recipient = {
        id: Date.now().toString(),
      };

      customColumns.forEach(column => {
        newRecipient[column.name] = column.tempValue || "";
      });

      setRecipients([...recipients, newRecipient]);
      setRecipientsChanged(true);

      const clearedColumns = allColumns.map(c => ({ ...c, tempValue: "" }));
      setAllColumns(clearedColumns);
    } else {
      alert("請填寫所有欄位");
    }
  };

  const handleColumnDotClick = (event: React.MouseEvent, columnId: string) => {
    event.preventDefault();
    event.stopPropagation();

    // Position the menu near the clicked dot
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    // Toggle the menu
    setActiveColumnMenu(activeColumnMenu === columnId ? null : columnId);
  };

  const handleDeleteColumn = (columnId: string) => {
    // Find the column to delete
    const columnToDelete = allColumns.find(col => col.id === columnId);
    if (!columnToDelete || columnToDelete.isStandard) return;

    // Filter out the column
    const updatedColumns = allColumns.filter(col => col.id !== columnId);
    setAllColumns(updatedColumns);

    // Remove this column's data from all recipients
    if (recipients.length > 0 && columnToDelete) {
      const updatedRecipients = recipients.map(recipient => {
        const updatedRecipient = { ...recipient };
        delete updatedRecipient[columnToDelete.name];
        return updatedRecipient;
      });
      setRecipients(updatedRecipients);
    }

    setActiveColumnMenu(null);
  };

  const handleMoveColumn = (columnId: string, direction: "left" | "right") => {
    // Filter out standard columns for movement operations
    const nonStandardColumns = allColumns.filter(col => !col.isStandard);
    const columnIndex = nonStandardColumns.findIndex(col => col.id === columnId);

    if (columnIndex === -1) return;

    // Cannot move leftmost column further left or rightmost column further right
    if (
      (direction === "left" && columnIndex === 0) ||
      (direction === "right" && columnIndex === nonStandardColumns.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "left" ? columnIndex - 1 : columnIndex + 1;

    // Create a copy of the non-standard columns
    const updatedNonStandardColumns = [...nonStandardColumns];

    // Perform the swap
    [updatedNonStandardColumns[columnIndex], updatedNonStandardColumns[targetIndex]] = [
      updatedNonStandardColumns[targetIndex],
      updatedNonStandardColumns[columnIndex],
    ];

    // Combine standard and updated non-standard columns
    const standardColumns = allColumns.filter(col => col.isStandard);
    setAllColumns([...standardColumns, ...updatedNonStandardColumns]);

    // Force re-render by creating new recipient objects
    if (recipients.length > 0) {
      const updatedRecipients = recipients.map(recipient => ({ ...recipient }));
      setRecipients(updatedRecipients);
    }

    setActiveColumnMenu(null);
  };

  const handleUploadSuccess = (files: any[]) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (file) {
      updateEmailData({
        sheetFile: file.file_id,
        sheetFileName: file.file_name,
        sheetFileUrl: file.file_url,
      });

      setTimeout(() => {
        if (
          confirm(
            "Recipients sheet uploaded successfully! Do you want to proceed to the next step?"
          )
        ) {
          onNext();
        }
      }, 500);
    }
  };

  // Close column menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setActiveColumnMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openAddColumnModal = () => {
    setNewColumnName("");
    setIsAddingColumn(true);
  };

  const closeAddColumnModal = () => {
    setIsAddingColumn(false);
  };

  const addColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        id: Date.now().toString(),
        name: newColumnName.trim(),
        tempValue: "",
      };

      setAllColumns([...allColumns, newColumn]);

      const updatedRecipients = recipients.map(recipient => ({
        ...recipient,
        [newColumnName]: "",
      }));

      setRecipients(updatedRecipients);
      closeAddColumnModal();
    }
  };

  useEffect(() => {
    if (lastUploadedRecipients && recipients.length > 0) {
      const currentRecipientsString = JSON.stringify(recipients);
      setRecipientsChanged(currentRecipientsString !== lastUploadedRecipients);
    } else if (recipients.length === 0) {
      setRecipientsChanged(false);
    } else {
      setRecipientsChanged(true);
    }
  }, [recipients, lastUploadedRecipients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditingTitle &&
        titleInputRef.current &&
        !titleInputRef.current.contains(event.target as Node) &&
        editButtonRef.current &&
        !editButtonRef.current.contains(event.target as Node)
      ) {
        saveTitle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingTitle, editingTitle, saveTitle]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const customColumns = allColumns.filter(col => !col.isStandard);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-2">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl">File Name:</h2>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              className="text-2xl font-bold border-2 border-gray-300 rounded-md p-1 ml-2 focus:border-gray-500 focus:outline-none focus:ring-0"
              value={editingTitle}
              onChange={e => setEditingTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") saveTitle();
              }}
            />
          ) : (
            <h2 className="text-xl font-bold ml-2">{sheetTitle}</h2>
          )}
          <button
            ref={editButtonRef}
            className="ml-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleEditTitle}
          >
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isLoadingVariables && (
            <div className="text-sm text-gray-500 flex items-center px-3 py-2 rounded-lg">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Loading template variables...</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            className="bg-white border border-gray-300 rounded px-4 py-2 flex items-center hover:bg-gray-100 transition-colors duration-200"
            onClick={triggerFileInput}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 w-4 h-4" /> Import Sheet
              </>
            )}
          </button>
        </div>
      </div>

      {importError && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {importError}
          </p>
        </div>
      )}

      <RecipientTable
        customColumns={customColumns}
        recipients={recipients}
        setRecipients={setRecipients}
        onAddColumn={openAddColumnModal}
        onAddRecipient={addRecipient}
        onColumnValueChange={(columnId, value) => {
          const updatedColumns = allColumns.map(c =>
            c.id === columnId ? { ...c, tempValue: value } : c
          );
          setAllColumns(updatedColumns);
        }}
        onColumnDotClick={handleColumnDotClick}
        onDeleteColumn={handleDeleteColumn}
        onMoveColumn={handleMoveColumn}
        activeColumnMenu={activeColumnMenu}
      />

      {/* Add column modal */}
      {isAddingColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Add New Column</h3>
              <button onClick={closeAddColumnModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Column Name</label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-gray-700 focus:outline-none focus:ring-0"
                placeholder="Enter column name"
                value={newColumnName}
                onChange={e => setNewColumnName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                onClick={closeAddColumnModal}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#1a2f4a] text-white rounded-md hover:bg-[#2c4a72]"
                onClick={addColumn}
              >
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sheet Upload Modal */}
      {showXlsxUpload && (
        <div className="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 pb-20 w-full max-w-screen-lg relative">
            <button onClick={handleXlsxCloseUpload} className="absolute top-8 right-8 text-black">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="currentColor"
                  d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"
                />
              </svg>
            </button>
            <div className="mb-4">
              <h2 className="text-xl font-bold">Upload Recipients Sheet</h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload your recipients sheet file to continue.
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium text-gray-700">Selected file: {xlsxFile?.name}</p>
            </div>
            <FileUpload
              OnFileExtension=".xlsx"
              onFileSelect={(file_id, file_url, file_name) => {
                handleXlsxSelect(file_id, file_url, file_name);
                setShowXlsxUpload(false);
                setUploadSuccess(true);
                setUploadButtonFlash(true);
                setTimeout(() => setUploadButtonFlash(false), 2000);
              }}
            />
          </div>
        </div>
      )}

      {/* Footer buttons */}
      <div className="flex justify-end p-6 gap-4">
        <button
          className={`px-6 py-2 rounded flex items-center transition-colors duration-300 ${
            uploadButtonFlash
              ? "bg-green-500 text-white"
              : isUploading
                ? "bg-gray-200 text-gray-700"
                : recipientsChanged || lastUploadedRecipients === "" // 如果收件人變更或從未上傳過
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed" // 未變更時禁用
          }`}
          onClick={handleXlsxOpenUpload}
          disabled={
            recipients.length === 0 ||
            isUploading ||
            (!recipientsChanged && lastUploadedRecipients !== "")
          }
        >
          {isUploading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : uploadSuccess && uploadButtonFlash ? (
            <>
              <Check className="mr-2 w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Upload className="mr-2 w-4 h-4" /> Save
            </>
          )}
        </button>
        <button
          className={`px-6 py-2 rounded flex items-center ${
            sheetTitle === "Enter the file name"
              ? "bg-gray-300 text-gray-100 cursor-not-allowed"
              : "bg-[#1a2f4a] text-white hover:bg-[#2c4a72] transition-colors duration-200"
          }`}
          onClick={onNext}
          disabled={sheetTitle === "Enter the file name"}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
