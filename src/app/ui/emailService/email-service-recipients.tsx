import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ArrowRight, Upload, Pencil, X, Check, Save } from "lucide-react";
import * as XLSX from "xlsx";
import { useEmailContext } from "@/app/context/EmailContext";
import { RecipientTable } from "./email-service-recipients-table";
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

interface EnhancedFileUploadProps {
  OnFileExtension: string;
  onUploadSuccess?: (files: any[]) => void;
}

const EnhancedFileUpload = forwardRef<any, EnhancedFileUploadProps>(
  ({ OnFileExtension, onUploadSuccess }, ref) => {
    const [, setIsSubmitting] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      uploadFile: async (file: File) => {
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
  }
);

EnhancedFileUpload.displayName = "EnhancedFileUpload";

export const EmailServiceRecipients: React.FC<RecipientsProps> = ({ onNext }) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState("Enter the file name");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [allColumns, setAllColumns] = useState<Column[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);
  const [activeColumnMenu, setActiveColumnMenu] = useState<string | null>(null);
  const [, setMenuPosition] = useState({ top: 0, left: 0 });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [xlsxFile] = useState<File | null>(null);
  const [lastUploadedRecipients, setLastUploadedRecipients] = useState<string>("");
  const [recipientsChanged, setRecipientsChanged] = useState<boolean>(false);

  const [uploadButtonFlash, setUploadButtonFlash] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [showXlsxUpload, setShowXlsxUpload] = useState<boolean>(false);
  const { emailData, updateEmailData } = useEmailContext();

  const titleInputRef = useRef<HTMLInputElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  const [templateFileName, setTemplateFileName] = useState<string>("Unkown File Name");

  // 新增處理欄位重新排序的函數
  const handleReorderColumns = useCallback(
    (newColumns: Column[]) => {
      // 更新欄位順序
      const standardColumns = allColumns.filter(col => col.isStandard);
      setAllColumns([...standardColumns, ...newColumns]);

      // 標記為已變更
      setRecipientsChanged(true);
    },
    [allColumns]
  );

  // This function is for xlsx file uploading after clicking the upload button.
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

  // This part is for template variables fetching
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

          if (data.file_name) {
            setTemplateFileName(data.file_name);
          }

          if (data.variables && Array.isArray(data.variables)) {
            setAllColumns(prevAllColumns => {
              const standardColumns = prevAllColumns.filter(col => col.isStandard);

              const templateVarColumns = data.variables.map(varName => ({
                id: `var-${Date.now()}-${Math.random().toString(36).substring(2)}`,
                name: varName,
                tempValue: "",
              }));

              const newColumns = [...standardColumns, ...templateVarColumns];

              setRecipients(prevRecipients => {
                if (prevRecipients.length > 0) {
                  return prevRecipients.map(recipient => {
                    const updatedRecipient = { ...recipient };
                    templateVarColumns.forEach(column => {
                      if (!updatedRecipient[column.name]) {
                        updatedRecipient[column.name] = "";
                      }
                    });
                    return updatedRecipient;
                  });
                }
                return prevRecipients;
              });

              return newColumns;
            });
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // This function is for Excel file reading, it is used is handleImportSheet
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

  // This function deals with the column name and value updates.
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
    const columnNameMapping: Record<string, string> = {};

    excelHeaders.forEach(excelHeader => {
      const existingColumn = Array.from(existingColumnMap.entries()).find(
        ([key]) => key === excelHeader.toLowerCase()
      );

      if (existingColumn) {
        const [, column] = existingColumn;
        newColumns.push(column);
        columnNameMapping[excelHeader] = column.name;
      } else {
        const newColumn: Column = {
          id: `col-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          name: excelHeader,
          tempValue: "",
        };
        newColumns.push(newColumn);
        columnNameMapping[excelHeader] = excelHeader;
        existingColumnMap.set(excelHeader.toLowerCase(), newColumn);
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

  // This function is attached to the Import Sheet button to handle xlsx files.
  const handleImportSheet = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const saveTitle = useCallback(() => {
    if (editingTitle.trim() !== "") {
      setSheetTitle(editingTitle);
    }
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

  const handleAddColumnWithName = useCallback(
    (columnName: string) => {
      const newColumn: Column = {
        id: `col-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        name: columnName,
        tempValue: "",
      };

      setAllColumns(prev => [...prev, newColumn]);

      // 為現有的收件人新增這個欄位
      if (recipients.length > 0) {
        const updatedRecipients = recipients.map(recipient => ({
          ...recipient,
          [columnName]: "",
        }));
        setRecipients(updatedRecipients);
      }

      // 標記為已變更
      setRecipientsChanged(true);
    },
    [recipients]
  );

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
      <div>
        <p>
          You have selected this template file: <strong>{templateFileName}</strong>
        </p>
      </div>
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-l">File Name:</h2>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              className="text-l font-bold border-2 border-gray-300 rounded-md p-1 ml-2 focus:border-gray-500 focus:outline-none focus:ring-0"
              value={editingTitle}
              placeholder="Enter the file name"
              onChange={e => setEditingTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") saveTitle();
              }}
            />
          ) : (
            <h2 className="text-l font-bold ml-2">
              {sheetTitle || <span className="text-gray-400">Enter the file name</span>}
            </h2>
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
            onChange={handleImportSheet}
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
        onDeleteColumn={handleDeleteColumn}
        onReorderColumns={handleReorderColumns}
        onAddColumnWithName={handleAddColumnWithName} // 新增這個
        onUpdateRecipientValue={(recipientId, columnName, value) => {
          setRecipientsChanged(true);
        }}
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

      {/* Footer buttons */}
      <div className="flex justify-end p-6 gap-4 items-center">
        {!sheetTitle && <p className="text-red-500 font-medium mr-4">Please enter a file name</p>}
        <button
          className={`px-6 py-2 rounded flex items-center transition-colors duration-300 ${
            uploadButtonFlash
              ? "bg-green-500 text-white"
              : isUploading
                ? "bg-gray-200 text-gray-700"
                : !sheetTitle
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : recipientsChanged || lastUploadedRecipients === ""
                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleXlsxOpenUpload}
          disabled={
            !sheetTitle ||
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
              <Save className="mr-2 w-4 h-4" /> Save
            </>
          )}
        </button>
        <button
          className={`px-6 py-2 rounded flex items-center ${
            !sheetTitle
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#1a2f4a] text-white hover:bg-[#2c4a72] transition-colors duration-200"
          }`}
          onClick={onNext}
          disabled={!sheetTitle}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
