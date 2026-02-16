"use client";

import { useState } from "react";
import Modal from "@/app/ui/emailService/modal";
import AttendancePreview from "@/app/ui/emailService/insert-button-attendance-preview";
import { Info } from "lucide-react";

interface InsertButtonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (buttonHtml: string) => void;
}

export default function InsertButtonDialog({ isOpen, onClose, onInsert }: InsertButtonDialogProps) {
  const [buttonText, setButtonText] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignStartTime, setCampaignStartTime] = useState("");
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [campaignEndTime, setCampaignEndTime] = useState("");
  const [campaignPlace, setCampaignPlace] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  const getValidationError = () => {
    if (
      !campaignStartDate ||
      !campaignStartTime ||
      !campaignEndDate ||
      !campaignEndTime ||
      !deadline ||
      !deadlineTime
    )
      return null;

    const start = new Date(`${campaignStartDate}T${campaignStartTime}`);
    const end = new Date(`${campaignEndDate}T${campaignEndTime}`);
    const deadlineDate = new Date(`${deadline}T${deadlineTime}`);

    if (start >= end) return "Campaign start time must be before end time";
    if (deadlineDate > start) return "Deadline must be before or equal to campaign start time";

    return null;
  };

  const isValid = () => {
    if (!buttonText) return false;
    const hasAllFields = !!(
      campaignName &&
      campaignStartDate &&
      campaignStartTime &&
      campaignEndDate &&
      campaignEndTime &&
      campaignPlace &&
      deadline &&
      deadlineTime
    );
    return hasAllFields && !getValidationError();
  };

  const handleInsert = () => {
    if (!isValid()) return;

    const buttonHtml = `<a href="{{ATTENDANCE_LINK}}" data-button-type="campaign-attendance" data-campaign-name="${campaignName}" data-campaign-start="${campaignStartDate} ${campaignStartTime}" data-campaign-end="${campaignEndDate} ${campaignEndTime}" data-campaign-place="${campaignPlace}" data-deadline="${deadline} ${deadlineTime}" style="display:inline-block;padding:12px 24px;background:#1a2f4a;color:white;text-decoration:none;border-radius:4px;font-weight:500;">${buttonText}</a>`;

    onInsert(buttonHtml);
    handleClose();
  };

  const handleClose = () => {
    setButtonText("");
    setCampaignName("");
    setCampaignStartDate("");
    setCampaignStartTime("");
    setCampaignEndDate("");
    setCampaignEndTime("");
    setCampaignPlace("");
    setDeadline("");
    setDeadlineTime("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Insert Campaign Attendance Button">
      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Button Setting
          </h3>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              Text to display
              <div className="group relative">
                <Info size={16} className="text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  This is the text recipients will see in the email.
                </div>
              </div>
            </label>
            <input
              type="text"
              placeholder="e.g. 點此回覆出席意願"
              value={buttonText}
              onChange={e => setButtonText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Campaign Information
          </h3>
          <div>
            <label className="block text-sm font-medium mb-2">Campaign name</label>
            <input
              type="text"
              placeholder="Enter campaign name"
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Campaign time</label>
            {getValidationError() && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {getValidationError()}
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={campaignStartDate}
                    onChange={e => setCampaignStartDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  />
                  <input
                    type="time"
                    value={campaignStartTime}
                    onChange={e => setCampaignStartTime(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={campaignEndDate}
                    onChange={e => setCampaignEndDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                  />
                  <input
                    type="time"
                    value={campaignEndTime}
                    onChange={e => setCampaignEndTime(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Campaign place</label>
            <input
              type="text"
              placeholder="Enter campaign location"
              value={campaignPlace}
              onChange={e => setCampaignPlace(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Attendance respond deadline</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
              />
              <input
                type="time"
                value={deadlineTime}
                onChange={e => setDeadlineTime(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-semibold">Page Preview</h3>
          <AttendancePreview
            campaignName={campaignName}
            campaignStartDate={campaignStartDate}
            campaignStartTime={campaignStartTime}
            campaignEndDate={campaignEndDate}
            campaignEndTime={campaignEndTime}
            campaignPlace={campaignPlace}
            deadline={deadline}
            deadlineTime={deadlineTime}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!isValid()}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isValid()
                ? "bg-[#2c3e50] text-white hover:bg-[#1a2f4a]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
}
