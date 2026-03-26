"use client";

import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ExportConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
}

export default function ExportConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}: ExportConfirmationModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-[400px] shadow-2xl">
        {/* Header with close button */}
        <div className="flex justify-end pt-4 pr-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Confirm Export</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            You are about to export <span className="font-semibold">{selectedCount}</span> selected
            row.
            <br />
            Do you want to proceed?
          </p>
        </div>

        {/* Footer with buttons */}
        <div className="px-8 py-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
