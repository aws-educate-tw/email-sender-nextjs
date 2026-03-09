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
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">ATTEND</span>;
      case "NOT_ATTEND":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">NOT ATTEND</span>;
      case "PENDING":
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">PENDING</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{filteredParticipants.length} participants selected</span>
          <span className="ml-4">
            Total: {stats.total} | Attend: {stats.attend} | Not Attend: {stats.notAttend} | Pending: {stats.pending}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        >
          <option>All Status</option>
          <option>ATTEND</option>
          <option>NOT_ATTEND</option>
          <option>PENDING</option>
        </select>
        <div className="text-sm text-gray-600">
          Show <span className="font-semibold">v{itemsPerPage}</span> entries per page
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participant Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedParticipants.map(participant => (
              <tr key={participant.participant_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{participant.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(participant.rsvp_status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredParticipants.length)} of {filteredParticipants.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <button className="px-4 py-2 bg-sky-950 text-white rounded-md">{currentPage}</button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
