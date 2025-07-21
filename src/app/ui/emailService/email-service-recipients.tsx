import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Pencil } from "lucide-react";
import * as XLSX from "xlsx";
import ExcelEditor from "@/app/ui/emailService/excel-editor";
import FileUpload from "@/app/ui/file-upload";
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

export default function EmailServiceRecipients({ onNext, templateFileId, onSave }: TemplateProps) {
  const [excel, setExcel] = useState<Excel[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState("Enter the file name");
  const [allColumns, setAllColumns] = useState<Column[]>([]);
  const [isLoadingVariables, setIsLoadingVariables] = useState(false);
  const [lastUploadedRecipients, setLastUploadedRecipients] = useState<string>("");

  const titleInputRef = useRef<HTMLInputElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  const [templateFileName, setTemplateFileName] = useState<string>("Unkown File Name");
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);

  // This part is for template variables fetching
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
        setTemplateVariables(data.variables || []);
        // 自動建立變數欄位
        const variableColumns = data.variables.map((v: string) => ({
          id: `var-${v}`,
          name: v,
        }));
        setAllColumns(prev => [...prev.filter(col => col.isStandard), ...variableColumns]);
      } catch (err) {
        console.error("Failed to load variables:", err);
      } finally {
        setIsLoadingVariables(false);
      }
    };
    fetchVariables();
  }, [templateFileId]);

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

  const handleUploadExcelData = async () => {
    if (!sheetTitle || excel.length === 0) {
      alert("請輸入檔案名稱並上傳至少一筆資料");
      return;
    }

    try {
      // 1. 建立 Excel 檔案
      const worksheet = XLSX.utils.json_to_sheet(excel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const file = new File([blob], `${sheetTitle}.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // 2. 上傳 API
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

      const spreadsheetFileName = result?.files?.[0]?.file_name;
      const spreadsheetFileId = result?.files?.[0]?.file_id;
      const spreadsheetFileUrl = result?.files?.[0]?.file_url;

      if (onSave) {
        console.log("📥 Sending to EmailServiceRecipients:", spreadsheetFileId, spreadsheetFileUrl);
        onSave(spreadsheetFileName, spreadsheetFileId, spreadsheetFileUrl);
      }

      // ✅ 記錄或更新最後上傳狀態
      setLastUploadedRecipients(JSON.stringify(excel));
      alert("上傳成功");
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
      <div className="flex flex-col gap-2">
        <TemplateVariablesInfo
          templateFileName={templateFileName}
          templateVariables={templateVariables}
          isLoading={isLoadingVariables}
        />
        <ExcelEditor
          onTableChange={excelData => {
            console.log("📊 Excel Data Updated:", excelData);
            setExcel(excelData);
          }}
        />
      </div>
      {/* This part is for file name editing */}
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
        <button
          onClick={handleUploadExcelData}
          className="mt-4 px-6 py-2 bg-[#1a2f4a] text-white rounded hover:bg-[#2c4a72]"
        >
          Save
        </button>
        <button
          onClick={handleNextClick}
          className="mt-4 px-6 py-2 bg-[#1a2f4a] text-white rounded hover:bg-[#2c4a72]"
        >
          Next
        </button>

        {/* Add column modal */}
        {/* // {isAddingColumn && (
        //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        //     <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        //       <div className="flex items-center justify-between mb-6">
        //         <h3 className="text-xl font-bold">Add New Column</h3>
        //         <button onClick={closeAddColumnModal} className="text-gray-500 hover:text-gray-700">
        //           <X className="w-5 h-5" />
        //         </button>
        //       </div>

        //       <div className="mb-6">
        //         <label className="block mb-2 font-medium">Column Name</label>
        //         <input
        //           type="text"
        //           className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-gray-700 focus:outline-none focus:ring-0"
        //           placeholder="Enter column name"
        //           value={newColumnName}
        //           onChange={e => setNewColumnName(e.target.value)}
        //           autoFocus
        //         />
        //       </div>

        //       <div className="flex justify-end gap-3">
        //         <button
        //           className="px-5 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
        //           onClick={closeAddColumnModal}
        //         >
        //           Cancel
        //         </button>
        //         <button
        //           className="px-5 py-2 bg-[#1a2f4a] text-white rounded-md hover:bg-[#2c4a72]"
        //           onClick={addColumn}
        //         >
        //           Add Column
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // )} */}

        {/* Footer buttons */}
        {/* // <div className="flex justify-end p-6 gap-4 items-center">
        //   {!sheetTitle && <p className="text-red-500 font-medium mr-4">Please enter a file name</p>}
        //   <button
        //     className={`px-6 py-2 rounded flex items-center transition-colors duration-300 ${
        //       uploadButtonFlash
        //         ? "bg-green-500 text-white"
        //         : isUploading
        //           ? "bg-gray-200 text-gray-700"
        //           : !sheetTitle
        //             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        //             : recipientsChanged || lastUploadedRecipients === ""
        //               ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        //               : "bg-gray-200 text-gray-500 cursor-not-allowed"
        //     }`}
        //     onClick={handleXlsxOpenUpload}
        //     disabled={
        //       !sheetTitle ||
        //       recipients.length === 0 ||
        //       isUploading ||
        //       (!recipientsChanged && lastUploadedRecipients !== "")
        //     }
        //   >
        //     {isUploading ? (
        //       <>
        //         <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
        //         Saving...
        //       </>
        //     ) : uploadSuccess && uploadButtonFlash ? (
        //       <>
        //         <Check className="mr-2 w-4 h-4" /> Saved
        //       </>
        //     ) : (
        //       <>
        //         <Save className="mr-2 w-4 h-4" /> Save
        //       </>
        //     )}
        //   </button>
        //   <button
        //     className={`px-6 py-2 rounded flex items-center ${
        //       !sheetTitle
        //         ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        //         : "bg-[#1a2f4a] text-white hover:bg-[#2c4a72] transition-colors duration-200"
        //     }`}
        //     onClick={onNext}
        //     disabled={!sheetTitle}
        //   >
        //     Next <ArrowRight className="ml-2 w-4 h-4" />
        //   </button>
        // </div> */}
      </div>
    </>
  );
}
