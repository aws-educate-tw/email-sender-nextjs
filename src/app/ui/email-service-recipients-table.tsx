import React, { useState, useRef } from "react";
import { Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface RecipientTableProps {
  customColumns: Array<{
    id: string;
    name: string;
    tempValue?: string;
  }>;
  recipients: Array<{
    id: string;
    [key: string]: string;
  }>;
  setRecipients: React.Dispatch<
    React.SetStateAction<
      Array<{
        id: string;
        [key: string]: string;
      }>
    >
  >;
  onAddColumn?: () => void;
  onAddRecipient?: () => void;
  onColumnValueChange?: (columnId: string, value: string) => void;
  onColumnDotClick?: (event: React.MouseEvent, columnId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
  onMoveColumn?: (columnId: string, direction: "left" | "right") => void;
  activeColumnMenu?: string | null;
}

// Fixed Column Icon component - based on the new UI design
const ColumnIcon = ({
  onClick,
  isClickable = false,
}: {
  onClick?: (e: React.MouseEvent) => void;
  isClickable?: boolean;
}) => {
  return (
    <div
      className={`flex items-center justify-center ${isClickable ? "cursor-pointer hover:bg-gray-100 rounded" : ""}`}
      onClick={onClick}
    >
      <div className="relative w-2 h-2 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-[1px]">
          <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
          <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
          <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
          <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
          <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
          <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export const RecipientTable: React.FC<RecipientTableProps> = ({
  customColumns,
  recipients,
  setRecipients,
  onAddColumn,
  onAddRecipient,
  onColumnValueChange,
  onColumnDotClick,
  onDeleteColumn,
  onMoveColumn,
  activeColumnMenu,
}) => {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const columnMenuRef = useRef<HTMLDivElement>(null);

  // ColumnMenu component to display when a column dot is clicked
  const ColumnMenu = ({ columnId }: { columnId: string }) => {
    return (
      <div
        ref={columnMenuRef}
        className="absolute bg-white shadow-md rounded-md border border-gray-200 z-10 py-1 w-36"
        style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
      >
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-red-600"
          onClick={() => onDeleteColumn && onDeleteColumn(columnId)}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </button>
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          onClick={() => onMoveColumn && onMoveColumn(columnId, "left")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Move Left
        </button>
        <button
          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          onClick={() => onMoveColumn && onMoveColumn(columnId, "right")}
        >
          <ChevronRight className="w-4 h-4 mr-2" /> Move Right
        </button>
      </div>
    );
  };

  // Handle column dot click and position the menu
  const handleColumnDotClick = (event: React.MouseEvent, columnId: string) => {
    event.preventDefault();
    event.stopPropagation();

    // Position the menu near the clicked dot
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    // Pass the event to parent
    if (onColumnDotClick) {
      onColumnDotClick(event, columnId);
    }
  };

  return (
    <>
      {/* Input fields section */}
      <div className="px-6 pb-4">
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-6">
          {customColumns.map(column => (
            <React.Fragment key={column.id}>
              <div className="flex items-center px-2">
                <ColumnIcon isClickable={true} onClick={e => handleColumnDotClick(e, column.id)} />
              </div>
              <input
                type="text"
                className="w-44 p-3 border-2 border-gray-300 focus:border-gray-400 rounded-md focus:outline-none focus:ring-0"
                placeholder={column.name}
                value={column.tempValue || ""}
                onChange={e => {
                  if (onColumnValueChange) {
                    onColumnValueChange(column.id, e.target.value);
                  }
                }}
              />
            </React.Fragment>
          ))}

          <button
            className="h-12 w-12 p-3 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50"
            onClick={onAddColumn}
          >
            <Plus size={20} />
          </button>

          <button
            className="h-12 bg-[#1a2f4a] text-white px-4 py-2 rounded flex items-center"
            onClick={onAddRecipient}
          >
            <Plus className="mr-2 w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Recipients table */}
      <div className="px-6">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${customColumns.length + 1}, 1fr)` }}
        >
          {customColumns.map(column => (
            <div
              key={column.id}
              className={"py-3 px-4 border-b border-gray-200 font-medium text-black"}
            >
              {column.name}
            </div>
          ))}
          <div className="py-3 px-4 border-b border-gray-200 font-medium">Action</div>
        </div>

        {recipients.map(recipient => (
          <div
            key={recipient.id}
            className="grid"
            style={{ gridTemplateColumns: `repeat(${customColumns.length + 1}, 1fr)` }}
          >
            {customColumns.map(column => (
              <div key={column.id} className={"py-3 px-4 border-b border-gray-200 text-black"}>
                {recipient[column.name]}
              </div>
            ))}

            <div className="py-3 px-4 border-b border-gray-200 flex items-center">
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

      {/* Display the column menu when a column is active */}
      {activeColumnMenu && <ColumnMenu columnId={activeColumnMenu} />}
    </>
  );
};
