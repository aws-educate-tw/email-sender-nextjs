"use client";

import { useEffect, useMemo, useState } from "react";
import { Participant } from "@/app/ui/campaignService/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import * as XLSX from "xlsx";
import ExportConfirmationModal from "./export-confirmation-modal";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

interface ParticipantsTableProps {
  participants: Participant[];
  campaignName?: string;
}

export default function ParticipantsTable({ participants, campaignName }: ParticipantsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "ATTEND", label: "ATTEND" },
    { value: "NOT_ATTEND", label: "NOT_ATTEND" },
    { value: "PENDING", label: "PENDING" },
  ];

  const columnHelper = createColumnHelper<Participant>();

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }: { table: any }) => {
          const filteredRows = table.getFilteredRowModel().rows;
          const allFilteredSelected =
            filteredRows.length > 0 && filteredRows.every((row: any) => row.getIsSelected());
          const someFilteredSelected = filteredRows.some((row: any) => row.getIsSelected());

          return (
            <input
              type="checkbox"
              className="rounded w-4 h-4 text-sky-950 bg-gray-100 border-sky-950 focus:ring-sky-950 focus:ring-2"
              checked={allFilteredSelected}
              ref={el => {
                if (el) {
                  el.indeterminate = someFilteredSelected && !allFilteredSelected;
                }
              }}
              onChange={() => {
                if (allFilteredSelected) {
                  table.resetRowSelection();
                  return;
                }

                const nextSelection: RowSelectionState = {};
                filteredRows.forEach((row: any) => {
                  nextSelection[row.id] = true;
                });
                table.setRowSelection(nextSelection);
              }}
            />
          );
        },
        cell: ({ row }: { row: any }) => (
          <input
            type="checkbox"
            className="rounded w-4 h-4 text-sky-950 bg-gray-100 border-sky-950 focus:ring-sky-950 focus:ring-2"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },
      columnHelper.accessor("name", {
        header: "Participant Name",
        cell: info => info.getValue() || "-",
      }),
      columnHelper.accessor("email_id", {
        header: "Participant Email",
        cell: info => info.getValue() || "-",
      }),
      columnHelper.accessor("rsvp_status", {
        header: "Attendance",
        filterFn: "equalsString",
        cell: info => getStatusBadge(info.getValue()),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: participants,
    columns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    // Use a composite id to avoid unintended linked selection when API returns duplicate ids.
    getRowId: (row, index) => `${row.participant_id}-${index}`,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    // Clear stale selections when the table data changes (e.g. switching run).
    setRowSelection({});
  }, [participants]);

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  const stats = useMemo(() => {
    const total = participants.length;
    const attend = participants.filter(p => p.rsvp_status === "ATTEND").length;
    const notAttend = participants.filter(p => p.rsvp_status === "NOT_ATTEND").length;
    const pending = participants.filter(p => p.rsvp_status === "PENDING").length;
    return { total, attend, notAttend, pending };
  }, [participants]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATTEND":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            ATTEND
          </span>
        );
      case "NOT_ATTEND":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
            NOT ATTEND
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            PENDING
          </span>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    const selectedParticipants = table.getFilteredSelectedRowModel().rows.map(row => row.original);

    const exportData = selectedParticipants.map(p => ({
      "Participant Name": p.name,
      "Participant Email": p.email_id ?? "",
      "Attendance Status": p.rsvp_status,
      "Created At": new Date(p.created_at).toLocaleString("en-US"),
      "Updated At": new Date(p.updated_at).toLocaleString("en-US"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");

    const sanitizedCampaignName = campaignName
      ? campaignName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")
      : "Event";
    const fileName = `${sanitizedCampaignName}_participants_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setShowExportModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Separator line */}
      <div className="border-t border-gray-200"></div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-6 text-gray-700 py-3">
          <div className="text-sm sm:text-base font-bold">
            {selectedCount} participants selected
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Total: {stats.total} | Attend: {stats.attend} | Not Attend: {stats.notAttend} | Pending:{" "}
            {stats.pending}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search participants..."
              value={globalFilter}
              onChange={e => {
                setGlobalFilter(e.target.value);
                table.setPageIndex(0);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-xs sm:text-sm"
            />
          </div>
          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm transition-colors ${
              selectedCount > 0
                ? "bg-sky-950 text-white hover:bg-sky-900"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={selectedCount === 0}
            onClick={() => setShowExportModal(true)}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Listbox
          value={statusFilter}
          onChange={value => {
            setStatusFilter(value);
            table
              .getColumn("rsvp_status")
              ?.setFilterValue(value === "All Status" ? undefined : value);
            table.setPageIndex(0);
          }}
        >
          <div className="relative w-full sm:w-auto">
            <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white py-3 pl-4 pr-10 text-left shadow-sm border border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 text-xs sm:text-sm min-w-[140px]">
              <span className="block truncate">
                {statusOptions.find(option => option.value === statusFilter)?.label || "All Status"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs">
              {statusOptions.map(option => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active, selected }) =>
                    `relative cursor-default select-none py-3 pl-4 pr-10 ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-900"
                    } ${selected ? "bg-gray-500 text-white" : ""}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-700">Show</span>
          <Listbox
            value={itemsPerPage}
            onChange={value => {
              setItemsPerPage(value);
              table.setPageSize(value);
              table.setPageIndex(0);
            }}
          >
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white py-3 pl-4 pr-10 text-left shadow-sm border border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 text-xs sm:text-sm min-w-[80px]">
                <span className="block truncate">{itemsPerPage}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs">
                {[10, 20, 30, 50, 100].map(pageSize => (
                  <Listbox.Option
                    key={pageSize}
                    value={pageSize}
                    className={({ active, selected }) =>
                      `relative cursor-default select-none py-3 pl-4 pr-10 ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-900"
                      } ${selected ? "bg-gray-500 text-white" : ""}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {pageSize}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <span className="text-xs sm:text-sm text-gray-700">entries per page</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center gap-1">
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="text-gray-400 hover:text-gray-700"
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          {table.getFilteredRowModel().rows.length === 0
            ? "Showing 0 to 0 of 0 results"
            : `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )} of ${table.getFilteredRowModel().rows.length} results`}
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md ${
              !table.getCanPreviousPage()
                ? "cursor-not-allowed text-gray-400 bg-gray-100"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button className="px-3 py-2 bg-sky-950 text-white rounded-md text-sm font-medium">
            {table.getState().pagination.pageIndex + 1}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md ${
              !table.getCanNextPage()
                ? "cursor-not-allowed text-gray-400 bg-gray-100"
                : "text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <ExportConfirmationModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExport}
        selectedCount={selectedCount}
      />
    </div>
  );
}
