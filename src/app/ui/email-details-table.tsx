import { useEffect, useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface RowDataType {
  [key: string]: string;
}

interface DataType {
  bcc: string[];
  subject: string;
  cc: string[];
  run_id: string;
  created_at: string;
  recipient_email: string;
  sender_local_part: string;
  status: string;
  spreadsheet_file_id: string;
  row_data: RowDataType;
  attachment_file_ids: string[];
  is_generated_certficate: boolean;
  sender_username: string;
  display_name: string;
  sender_id: string;
  updated_at: string;
  sent_at: string;
  template_file_id: string;
  reply_to: string;
  email_id: string;
}

interface EmailDetailsTableProps {
  data: DataType[];
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  selectedRows: Record<string, boolean>;
  onSelectedRowsChange?: (count: number) => void;
  onRowSelectionChange?: (newSelectedRows: Record<string, boolean>) => void;
  selectedEmailNum: number;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  sorting: any[];
  onSortingChange: (sorting: any[]) => void;
}

export default function EmailDetailsTable({
  data,
  selectedStatus,
  onStatusChange,
  selectedRows,
  onSelectedRowsChange,
  onRowSelectionChange,
  selectedEmailNum,
  globalFilter,
  onGlobalFilterChange,
  sorting,
  onSortingChange,
}: EmailDetailsTableProps) {
  const columnHelper = createColumnHelper<DataType>();

  // 定義表格欄位
  const columns = useMemo(
    () => [
      // Checkbox 欄位
      {
        id: "select",
        header: () => {
          const isAllSelected =
            data.length > 0 && data.every(email => selectedRows[email.email_id]);
          const isIndeterminate =
            data.some(email => selectedRows[email.email_id]) && !isAllSelected;

          return (
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={el => {
                if (el) el.indeterminate = isIndeterminate;
              }}
              onChange={() => {
                if (isAllSelected) {
                  // 取消全選
                  onRowSelectionChange?.({});
                } else {
                  // 全選所有資料
                  const newSelection: Record<string, boolean> = {};
                  data.forEach(email => {
                    newSelection[email.email_id] = true;
                  });
                  onRowSelectionChange?.(newSelection);
                }
              }}
              className="rounded border-gray-300 text-sky-950 focus:ring-sky-800"
            />
          );
        },
        cell: ({ row }: any) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="rounded border-gray-300 text-sky-950 focus:ring-sky-800"
          />
        ),
      },
      columnHelper.accessor("recipient_email", {
        header: "Recipient Email",
        cell: info => info.getValue(),
        filterFn: "includesString",
        enableSorting: true,
      }),
      columnHelper.accessor("bcc", {
        header: "BCC",
        cell: info => {
          const bccList = info.getValue();
          return bccList && bccList.length > 0 ? bccList.join(", ") : "-";
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.bcc?.join(", ") || "";
          const b = rowB.original.bcc?.join(", ") || "";
          return a.localeCompare(b);
        },
      }),
      columnHelper.accessor("cc", {
        header: "CC",
        cell: info => {
          const ccList = info.getValue();
          return ccList && ccList.length > 0 ? ccList.join(", ") : "-";
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.cc?.join(", ") || "";
          const b = rowB.original.cc?.join(", ") || "";
          return a.localeCompare(b);
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: info => (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              info.getValue() === "SUCCESS"
                ? "bg-green-100 text-green-800"
                : info.getValue() === "FAILED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {info.getValue()}
          </span>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("sent_at", {
        header: "Sent At",
        cell: info => {
          const dateValue = info.getValue();
          if (!dateValue) return "-";
          const date = new Date(dateValue);
          return date.toLocaleString();
        },
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const a = new Date(rowA.original.sent_at || 0).getTime();
          const b = new Date(rowB.original.sent_at || 0).getTime();
          return a - b;
        },
      }),
    ],
    [columnHelper, data, selectedRows, onRowSelectionChange]
  );

  // 設定 React Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
      rowSelection: selectedRows,
      sorting,
    },
    onGlobalFilterChange: onGlobalFilterChange,
    onRowSelectionChange: updaterOrValue => {
      const newValue =
        typeof updaterOrValue === "function" ? updaterOrValue(selectedRows) : updaterOrValue;
      onRowSelectionChange?.(newValue);
    },
    onSortingChange: updaterOrValue => {
      const newValue =
        typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
      onSortingChange(newValue);
    },
    enableRowSelection: true,
    enableSorting: true,
    getRowId: row => row.email_id,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // 更新選中的 email 數量
  useEffect(() => {
    if (onSelectedRowsChange) {
      const selectedCount = Object.keys(selectedRows).length;
      onSelectedRowsChange(selectedCount);
    }
  }, [selectedRows, onSelectedRowsChange]);

  // 生成分頁數字陣列的函數
  const generatePageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | string)[] = [];
    const delta = 2; // 當前頁碼兩側顯示的頁碼數量

    if (totalPages <= 7) {
      // 如果總頁數小於等於 7，顯示所有頁碼
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 總是顯示第一頁
      pages.push(1);

      // 計算當前頁碼範圍
      const startPage = Math.max(2, currentPage - delta);
      const endPage = Math.min(totalPages - 1, currentPage + delta);

      // 如果開始頁碼大於 2，加入省略號
      if (startPage > 2) {
        pages.push("...");
      }

      // 加入當前頁碼範圍
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 如果結束頁碼小於總頁數-1，加入省略號
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // 總是顯示最後一頁（如果總頁數大於 1）
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="overflow-x-auto">
      {/* Filters and Page Size */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <select
            value={selectedStatus ?? ""}
            onChange={e => onStatusChange(e.target.value || null)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
          >
            <option value="">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800"
          >
            {[10, 20, 30, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">entries per page</span>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center space-x-1">
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getCanSort() && (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className="ml-1 hover:text-gray-700"
                        >
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp size={14} />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            <span>
              Showing{" "}
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </span>
          </div>
          {selectedEmailNum > 0 && (
            <div className="text-sm text-sky-950 font-medium">
              {selectedEmailNum} selected (from all {data.length} emails)
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md ${
              !table.getCanPreviousPage()
                ? "cursor-not-allowed text-gray-400 bg-gray-100"
                : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {generatePageNumbers(
              table.getState().pagination.pageIndex + 1,
              table.getPageCount()
            ).map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-500">
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isCurrentPage = pageNumber === table.getState().pagination.pageIndex + 1;

              return (
                <button
                  key={pageNumber}
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? "bg-sky-950 text-white hover:bg-sky-800"
                      : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md ${
              !table.getCanNextPage()
                ? "cursor-not-allowed text-gray-400 bg-gray-100"
                : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
