import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Plus, Upload, Pencil, Trash2, X } from "lucide-react";
import * as XLSX from "xlsx";

interface RecipientsProps {
  onNext: () => void;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  [key: string]: string; // dynamic columns
}

interface Column {
  id: string;
  name: string;
  tempValue?: string;
}

export const EmailServiceRecipients: React.FC<RecipientsProps> = ({ onNext }) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("Create Recipients Sheet");
  const [editingTitle, setEditingTitle] = useState("Create Recipients Sheet");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [customColumns, setCustomColumns] = useState<Column[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const titleInputRef = useRef<HTMLInputElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const headers = Object.keys(firstRow);

    if (!headers.includes("name") && !headers.includes("Name")) {
      setImportError("Excel file must contain a 'name' or 'Name' column");
      return;
    }

    if (!headers.includes("email") && !headers.includes("Email")) {
      setImportError("Excel file must contain an 'email' or 'Email' column");
      return;
    }

    const nameColumn = headers.includes("name") ? "name" : "Name";
    const emailColumn = headers.includes("email") ? "email" : "Email";

    const newCustomColumns: Column[] = [];
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase();
      if (lowerHeader !== "name" && lowerHeader !== "email") {
        newCustomColumns.push({
          id: Date.now() + Math.random().toString(36).substring(2),
          name: header,
          tempValue: "",
        });
      }
    });

    setCustomColumns(newCustomColumns);

    const importedRecipients = data.map((row: any) => {
      const recipient: Recipient = {
        id: Date.now() + Math.random().toString(36).substring(2),
        name: row[nameColumn] || "",
        email: row[emailColumn] || "",
      };

      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader !== "name" && lowerHeader !== "email") {
          recipient[header] = row[header] !== undefined ? String(row[header]) : "";
        }
      });

      return recipient;
    });

    setRecipients(importedRecipients);
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
  }, [isEditingTitle, editingTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const toggleEditTitle = () => {
    if (!isEditingTitle) {
      setEditingTitle(sheetTitle);
      setIsEditingTitle(true);
    } else {
      saveTitle();
    }
  };

  const saveTitle = () => {
    setSheetTitle(editingTitle);
    setIsEditingTitle(false);
  };

  const addRecipient = () => {
    if (newName && newEmail) {
      const newRecipient: Recipient = {
        id: Date.now().toString(),
        name: newName,
        email: newEmail,
      };

      // Add custom column values from the temp values
      customColumns.forEach(column => {
        newRecipient[column.name] = column.tempValue || "";
      });

      setRecipients([...recipients, newRecipient]);
      setNewName("");
      setNewEmail("");

      // Clear temp values after adding
      const clearedColumns = customColumns.map(c => ({ ...c, tempValue: "" }));
      setCustomColumns(clearedColumns);
    }
  };

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

      setCustomColumns([...customColumns, newColumn]);

      const updatedRecipients = recipients.map(recipient => ({
        ...recipient,
        [newColumnName]: "",
      }));

      setRecipients(updatedRecipients);
      closeAddColumnModal();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-2">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              className="text-2xl font-bold border-2 border-gray-300 rounded-md p-1 focus:border-gray-500 focus:outline-none focus:ring-0"
              value={editingTitle}
              onChange={e => setEditingTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") saveTitle();
              }}
            />
          ) : (
            <h2 className="text-2xl font-bold">{sheetTitle}</h2>
          )}
          <button
            ref={editButtonRef}
            className="ml-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleEditTitle}
          >
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
        </div>

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

      {/* 顯示導入錯誤 */}
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

      <div className="px-6 pb-2">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <span className="text-gray-400">::</span>
          </div>
          <input
            type="text"
            className="w-22 p-3 border-2 border-gray-300 rounded-md focus:border-gray-400 focus:outline-none focus:ring-0"
            placeholder="Name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />

          <div className="flex items-center px-2">
            <span className="text-gray-400">::</span>
          </div>

          <input
            type="email"
            className="w-44 p-3 border-2 border-gray-300 rounded-md focus:border-gray-400 focus:outline-none focus:ring-0"
            placeholder="Email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />

          {/* Dynamic input fields for custom columns */}
          {customColumns.map(column => (
            <React.Fragment key={column.id}>
              <div className="flex items-center px-2">
                <span className="text-gray-400">::</span>
              </div>
              <input
                type="text"
                className="w-44 p-3 border-2 border-gray-300 rounded-md focus:border-gray-400 focus:outline-none focus:ring-0"
                placeholder={column.name}
                value={column.tempValue || ""}
                onChange={e => {
                  // Update temporary value for this column
                  const updatedColumns = customColumns.map(c =>
                    c.id === column.id ? { ...c, tempValue: e.target.value } : c
                  );
                  setCustomColumns(updatedColumns);
                }}
              />
            </React.Fragment>
          ))}

          <button
            className="p-3 border border-gray-300 rounded text-gray-500 hover:bg-gray-50"
            onClick={openAddColumnModal}
          >
            <Plus />
          </button>

          <button
            className="bg-[#1a2f4a] text-white px-4 py-2 rounded flex items-center"
            onClick={addRecipient}
          >
            <Plus className="mr-2 w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200 font-medium">
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Email</div>
          {customColumns.map(column => (
            <div key={column.id} className="col-span-2">
              {column.name}
            </div>
          ))}
          <div className="col-span-2">Action</div>
        </div>

        {recipients.map(recipient => (
          <div key={recipient.id} className="grid grid-cols-12 gap-4 py-3 border-b border-gray-200">
            <div className="col-span-4">{recipient.name}</div>
            <div className="col-span-4">{recipient.email}</div>

            {customColumns.map(column => (
              <div key={column.id} className="col-span-2">
                {recipient[column.name]}
              </div>
            ))}

            <div className="col-span-2">
              <button
                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-md transition-colors duration-200"
                onClick={() => {
                  setRecipients(recipients.filter(r => r.id !== recipient.id));
                }}
                aria-label="Delete recipient"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {recipients.length === 0 && (
          <div className="py-4 text-center text-gray-500">No recipients added yet</div>
        )}
      </div>

      <div className="flex justify-end p-6 gap-4">
        <button
          className="px-6 py-2 rounded flex items-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          onClick={() => console.log("Saving recipients...")}
        >
          Save
        </button>
        <button
          className="px-6 py-2 rounded flex items-center bg-[#1a2f4a] text-white hover:bg-[#2c4a72] transition-colors duration-200"
          onClick={onNext}
        >
          Next <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>

      {/* Add Column Modal */}
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
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-gray-500 focus:outline-none"
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
    </div>
  );
};
