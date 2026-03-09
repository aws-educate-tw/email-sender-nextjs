"use client";

import { useState, useMemo } from "react";
import { Participant } from "@/app/ui/campaignService/types";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface ParticipantsTableProps {
  participants: Participant[];
}

export default function ParticipantsTable({ participants }: ParticipantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || p.rsvp_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [participants, searchTerm, statusFilter]);

  const paginatedParticipants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredParticipants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredParticipants, currentPage]);

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-xs sm:text-sm text-gray-600">
          <div className="font-semibold mb-1 sm:mb-0">
            {filteredParticipants.length} participants selected
          </div>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>Total: {stats.total}</span>
            <span>Attend: {stats.attend}</span>
            <span>Not Attend: {stats.notAttend}</span>
            <span>Pending: {stats.pending}</span>
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
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
        >
          <option>All Status</option>
          <option>ATTEND</option>
          <option>NOT_ATTEND</option>
          <option>PENDING</option>
        </select>
        <div className="text-xs sm:text-sm text-gray-600">
          Show <span className="font-semibold">v{itemsPerPage}</span> entries per page
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant Name
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant Email
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedParticipants.map(participant => (
              <tr key={participant.participant_id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                  {participant.name}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                  {participant.email}
                </td>
                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(participant.rsvp_status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredParticipants.length)} of{" "}
          {filteredParticipants.length} results
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-sky-950 text-white rounded-md text-sm">
            {currentPage}
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
