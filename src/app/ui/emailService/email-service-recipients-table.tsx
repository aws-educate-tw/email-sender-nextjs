import React, { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Plus, GripVertical } from "lucide-react";

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
  onDeleteColumn?: (columnId: string) => void;
  onReorderColumns?: (newOrder: Array<{ id: string; name: string; tempValue?: string }>) => void;
  onAddColumnWithName?: (columnName: string) => void;
  onUpdateRecipientValue?: (recipientId: string, columnName: string, value: string) => void;
}

// 可排序的欄位名稱標籤
function SortableColumnTag({
  column,
  onDelete,
}: {
  column: { id: string; name: string; tempValue?: string };
  onDelete?: (columnId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2 bg-blue-100 border border-blue-200 rounded-lg transition-all ${
        isDragging ? "shadow-lg scale-105" : "hover:bg-blue-150"
      }`}
    >
      {/* 拖拉手柄 */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-blue-200 transition-colors"
      >
        <GripVertical className="w-4 h-4 text-blue-600" />
      </div>

      {/* 欄位名稱 */}
      <span className="text-blue-800 font-medium select-none">{column.name}</span>

      {/* 刪除按鈕 */}
      <button
        className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors ml-1"
        onClick={() => onDelete && onDelete(column.id)}
        title="刪除欄位"
      >
        ×
      </button>
    </div>
  );
}

export const RecipientTable: React.FC<RecipientTableProps> = ({
  customColumns,
  recipients,
  setRecipients,
  onDeleteColumn,
  onReorderColumns,
  onAddColumnWithName,
  onUpdateRecipientValue,
}) => {
  const [newColumnName, setNewColumnName] = useState("");
  const sensors = useSensors(useSensor(PointerSensor));

  // 處理拖拉結束事件
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = customColumns.findIndex(col => col.id === active.id);
      const newIndex = customColumns.findIndex(col => col.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newColumns = arrayMove(customColumns, oldIndex, newIndex);

        // 通知父組件更新欄位順序
        if (onReorderColumns) {
          onReorderColumns(newColumns);
        }
      }
    }
  };

  // 新增欄位
  const handleAddColumn = () => {
    const trimmedName = newColumnName.trim();
    if (trimmedName && !customColumns.some(col => col.name === trimmedName)) {
      if (onAddColumnWithName) {
        onAddColumnWithName(trimmedName);
      }
      setNewColumnName("");
    }
  };

  // 處理輸入框按鍵
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddColumn();
    } else if (e.key === "Escape") {
      setNewColumnName("");
    }
  };

  // 新增空白資料列
  const handleAddRow = () => {
    const newRecipient: any = {
      id: `recipient-${Date.now()}-${Math.random().toString(36).substring(2)}`,
    };

    // 為每個欄位初始化空值
    customColumns.forEach(column => {
      newRecipient[column.name] = "";
    });

    setRecipients(prev => [...prev, newRecipient]);
  };

  // 更新收件人資料
  const handleCellValueChange = (recipientId: string, columnName: string, value: string) => {
    setRecipients(prev =>
      prev.map(recipient =>
        recipient.id === recipientId ? { ...recipient, [columnName]: value } : recipient
      )
    );

    // 同時通知父組件（如果需要）
    if (onUpdateRecipientValue) {
      onUpdateRecipientValue(recipientId, columnName, value);
    }
  };

  // 刪除收件人
  const handleDeleteRecipient = (recipientId: string) => {
    setRecipients(prev => prev.filter(r => r.id !== recipientId));
  };

  // 取得欄位 ID 列表用於 SortableContext
  const columnIds = customColumns.map(col => col.id);

  return (
    <>
      {/* 欄位管理區域 */}
      <div className="px-6 pb-4">
        <div className="space-y-4">
          {/* 欄位名稱標籤 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">欄位</h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                <div className="flex flex-wrap gap-2">
                  {customColumns.map(column => (
                    <SortableColumnTag key={column.id} column={column} onDelete={onDeleteColumn} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* 新增欄位輸入框 */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newColumnName}
              onChange={e => setNewColumnName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-48 p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="輸入新欄位名稱..."
            />
            <button
              onClick={handleAddColumn}
              disabled={
                !newColumnName.trim() ||
                customColumns.some(col => col.name === newColumnName.trim())
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              新增欄位
            </button>
          </div>
        </div>
      </div>

      {/* 收件人表格 */}
      <div className="px-6">
        {customColumns.length > 0 ? (
          <>
            {/* 表格標題 */}
            <div
              className="grid gap-px bg-gray-200 rounded-t-lg overflow-hidden"
              style={{ gridTemplateColumns: `repeat(${customColumns.length}, 1fr) auto` }}
            >
              {customColumns.map(column => (
                <div
                  key={column.id}
                  className="py-3 px-4 bg-gray-50 font-medium text-gray-700 text-sm"
                >
                  {column.name}
                </div>
              ))}
              <div className="py-3 px-4 bg-gray-50 font-medium text-gray-700 text-sm text-center">
                操作
              </div>
            </div>

            {/* 表格內容 */}
            <div className="bg-gray-200 rounded-b-lg overflow-hidden">
              {recipients.map((recipient, rowIndex) => (
                <div
                  key={recipient.id}
                  className="grid gap-px"
                  style={{ gridTemplateColumns: `repeat(${customColumns.length}, 1fr) auto` }}
                >
                  {customColumns.map(column => (
                    <div key={column.id} className="bg-white">
                      <input
                        type="text"
                        value={recipient[column.name] || ""}
                        onChange={e =>
                          handleCellValueChange(recipient.id, column.name, e.target.value)
                        }
                        className="w-full py-3 px-4 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        placeholder={`輸入 ${column.name}...`}
                      />
                    </div>
                  ))}

                  <div className="bg-white py-3 px-4 flex items-center justify-center">
                    <button
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-md transition-colors"
                      onClick={() => handleDeleteRecipient(recipient.id)}
                      title="刪除這列"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 新增資料列按鈕 */}
            <button
              onClick={handleAddRow}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增資料列
            </button>
          </>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p className="text-lg">尚未建立任何欄位</p>
            <p className="text-sm mt-1">請先在上方新增欄位名稱</p>
          </div>
        )}
      </div>
    </>
  );
};
