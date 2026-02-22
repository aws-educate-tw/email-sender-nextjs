"use client";

import { useState } from "react";
import Modal from "@/app/ui/emailService/modal";
import AttendancePreview from "@/app/ui/emailService/insert-button-attendance-preview";
import { Info } from "lucide-react";
import DateTimeInput from "@/app/ui/emailService/insert-button-datetime-input";
import "react-datepicker/dist/react-datepicker.css";

const datePickerStyles = `
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
  }

  .react-datepicker {
    font-family: inherit;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .react-datepicker__header {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding-top: 0.5rem;
  }

  .react-datepicker__current-month {
    font-weight: 600;
    color: #1f2937;
  }

  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #192f47;
    color: white;
  }

  .react-datepicker__day:not(.react-datepicker__day--disabled):not(
      .react-datepicker__day--selected
    ):hover {
    background-color: #dbeafe;
  }

  .react-datepicker__time-container {
    border-left: 1px solid #e5e7eb;
  }

  .react-datepicker__time-list-item--selected {
    background-color: #192f47 !important;
    color: white !important;
  }

  .react-datepicker__time-list-item:hover {
    background-color: #dbeafe !important;
  }
`;

interface InsertButtonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (buttonHtml: string) => void;
}

export default function InsertButtonDialog({ isOpen, onClose, onInsert }: InsertButtonDialogProps) {
  const [buttonText, setButtonText] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignStartDateTime, setCampaignStartDateTime] = useState<Date | null>(null);
  const [campaignEndDateTime, setCampaignEndDateTime] = useState<Date | null>(null);
  const [campaignPlace, setCampaignPlace] = useState("");
  const [deadlineDateTime, setDeadlineDateTime] = useState<Date | null>(null);

  const now = new Date();
  const fiveYearsLater = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());

  const getValidationError = () => {
    if (!campaignStartDateTime || !campaignEndDateTime || !deadlineDateTime) return null;

    if (campaignStartDateTime >= campaignEndDateTime)
      return "Campaign start time must be before end time";
    if (deadlineDateTime > campaignStartDateTime)
      return "Deadline must be before or equal to campaign start time";

    return null;
  };

  const isValid = () => {
    if (!buttonText) return false;
    const hasAllFields = !!(
      campaignName &&
      campaignStartDateTime &&
      campaignEndDateTime &&
      campaignPlace &&
      deadlineDateTime
    );
    return hasAllFields && !getValidationError();
  };

  const formatDateTime = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  const handleInsert = () => {
    if (!isValid() || !campaignStartDateTime || !campaignEndDateTime || !deadlineDateTime) return;

    const buttonHtml = `<a href="{{ATTENDANCE_LINK}}" data-button-type="campaign-attendance" data-campaign-name="${campaignName}" data-campaign-start="${formatDateTime(campaignStartDateTime)}" data-campaign-end="${formatDateTime(campaignEndDateTime)}" data-campaign-place="${campaignPlace}" data-deadline="${formatDateTime(deadlineDateTime)}" style="display:inline-block;padding:12px 24px;background:#1a2f4a;color:white;text-decoration:none;border-radius:4px;font-weight:500;">${buttonText}</a>`;

    onInsert(buttonHtml);
    handleClose();
  };

  const handleClose = () => {
    setButtonText("");
    setCampaignName("");
    setCampaignStartDateTime(null);
    setCampaignEndDateTime(null);
    setCampaignPlace("");
    setDeadlineDateTime(null);
    onClose();
  };

  return (
    <>
      <style>{datePickerStyles}</style>
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
                  <DateTimeInput
                    selected={campaignStartDateTime}
                    onChange={(date: Date | null) => {
                      setCampaignStartDateTime(date);
                      if (date && campaignEndDateTime && campaignEndDateTime <= date) {
                        setCampaignEndDateTime(null);
                      }
                      if (date && deadlineDateTime && deadlineDateTime > date) {
                        setDeadlineDateTime(null);
                      }
                    }}
                    minDate={now}
                    maxDate={fiveYearsLater}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End</label>
                  <DateTimeInput
                    selected={campaignEndDateTime}
                    onChange={(date: Date | null) => setCampaignEndDateTime(date)}
                    minDate={campaignStartDateTime || now}
                    maxDate={fiveYearsLater}
                  />
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
              <DateTimeInput
                selected={deadlineDateTime}
                onChange={(date: Date | null) => setDeadlineDateTime(date)}
                minDate={now}
                maxDate={campaignStartDateTime || fiveYearsLater}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold">Page Preview</h3>
            <AttendancePreview
              campaignName={campaignName}
              campaignStartDate={campaignStartDateTime?.toISOString().split("T")[0] || ""}
              campaignStartTime={campaignStartDateTime?.toTimeString().slice(0, 5) || ""}
              campaignEndDate={campaignEndDateTime?.toISOString().split("T")[0] || ""}
              campaignEndTime={campaignEndDateTime?.toTimeString().slice(0, 5) || ""}
              campaignPlace={campaignPlace}
              deadline={deadlineDateTime?.toISOString().split("T")[0] || ""}
              deadlineTime={deadlineDateTime?.toTimeString().slice(0, 5) || ""}
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
    </>
  );
}
