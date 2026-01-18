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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirm Export</h3>
          <p className="text-gray-600 text-sm mb-6">
            You are about to export{" "}
            <span className="font-semibold text-sky-950">{selectedCount}</span> selected{" "}
            {selectedCount === 1 ? "row" : "rows"}.<span> Do you want to proceed?</span>
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-sky-950 hover:bg-sky-800 rounded-md transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
