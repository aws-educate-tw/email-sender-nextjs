"use client";

import { useState } from "react";
import Modal from "@/app/ui/emailService/modal";
import AttendancePreview from "@/app/ui/emailService/insert-button-attendance-preview";
import { Info, ChevronsUpDown, Check } from "lucide-react";
import DateTimeInput from "@/app/ui/emailService/insert-button-datetime-input";
import { Listbox } from "@headlessui/react";
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

// Create New Campaign Dialog Component
interface CreateCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: any) => void;
}

function CreateCampaignDialog({ isOpen, onClose, onCampaignCreated }: CreateCampaignDialogProps) {
  const [campaignName, setCampaignName] = useState("");
  const [campaignStartDateTime, setCampaignStartDateTime] = useState<Date | null>(null);
  const [campaignEndDateTime, setCampaignEndDateTime] = useState<Date | null>(null);
  const [campaignPlace, setCampaignPlace] = useState("");

  const now = new Date();
  const fiveYearsLater = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());

  const getValidationError = () => {
    if (!campaignName || !campaignStartDateTime || !campaignEndDateTime || !campaignPlace) {
      return null;
    }
    if (campaignStartDateTime.getTime() >= campaignEndDateTime.getTime()) {
      return "Event start time must be before end time";
    }
    return null;
  };

  const isValid = () => {
    if (!campaignName || !campaignStartDateTime || !campaignEndDateTime || !campaignPlace) {
      return false;
    }
    return !getValidationError();
  };

  const handleCreate = () => {
    if (!isValid()) return;

    const newCampaign = {
      id: Date.now().toString(),
      name: campaignName,
      startDateTime: campaignStartDateTime,
      endDateTime: campaignEndDateTime,
      place: campaignPlace,
    };

    onCampaignCreated(newCampaign);
    handleClose();
  };

  const handleClose = () => {
    setCampaignName("");
    setCampaignStartDateTime(null);
    setCampaignEndDateTime(null);
    setCampaignPlace("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Event Information</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Event name</label>
              <input
                type="text"
                placeholder="Enter event name"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event time</label>
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
                    }}
                    minDate={now}
                    maxDate={fiveYearsLater}
                    placeholderText="Type or select: YYYY/MM/DD HH:mm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End</label>
                  <DateTimeInput
                    selected={campaignEndDateTime}
                    onChange={(date: Date | null) => setCampaignEndDateTime(date)}
                    minDate={campaignStartDateTime || now}
                    maxDate={fiveYearsLater}
                    placeholderText="Type or select: YYYY/MM/DD HH:mm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Event place</label>
              <input
                type="text"
                placeholder="Enter event location"
                value={campaignPlace}
                onChange={e => setCampaignPlace(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {getValidationError() && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{getValidationError()}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 px-4 sm:px-8 py-4 sm:py-5 border-t bg-white flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!isValid()}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isValid()
                ? "bg-[#2c3e50] text-white hover:bg-[#1a2f4a]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InsertButtonDialog({ isOpen, onClose, onInsert }: InsertButtonDialogProps) {
  const [buttonText, setButtonText] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignStartDateTime, setCampaignStartDateTime] = useState<Date | null>(null);
  const [campaignEndDateTime, setCampaignEndDateTime] = useState<Date | null>(null);
  const [campaignPlace, setCampaignPlace] = useState("");
  const [deadlineDateTime, setDeadlineDateTime] = useState<Date | null>(null);
  const [isCreateCampaignDialogOpen, setIsCreateCampaignDialogOpen] = useState(false);
  const [availableCampaigns, setAvailableCampaigns] = useState<any[]>([]);

  const now = new Date();
  const fiveYearsLater = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());

  const getValidationError = () => {
    if (!campaignStartDateTime || !campaignEndDateTime || !deadlineDateTime) return null;

    if (campaignStartDateTime >= campaignEndDateTime)
      return "Event start time must be before end time";
    if (deadlineDateTime > campaignStartDateTime)
      return "Deadline must be before or equal to event start time";

    return null;
  };

  const isValid = () => {
    if (!buttonText || !deadlineDateTime) return false;

    if (selectedCampaign) {
      return true;
    }

    const hasAllFields = !!(
      campaignName &&
      campaignStartDateTime &&
      campaignEndDateTime &&
      campaignPlace
    );
    return hasAllFields && !getValidationError();
  };

  const formatDateTime = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  const handleCampaignCreated = (newCampaign: any) => {
    setAvailableCampaigns(prev => [...prev, newCampaign]);
    setSelectedCampaign(newCampaign.id);
    setCampaignName(newCampaign.name);
    setCampaignStartDateTime(newCampaign.startDateTime);
    setCampaignEndDateTime(newCampaign.endDateTime);
    setCampaignPlace(newCampaign.place);
  };

  const handleCampaignSelection = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    if (campaignId && campaignId !== "none") {
      const campaign = availableCampaigns.find(c => c.id === campaignId);
      if (campaign) {
        setCampaignName(campaign.name);
        setCampaignStartDateTime(campaign.startDateTime);
        setCampaignEndDateTime(campaign.endDateTime);
        setCampaignPlace(campaign.place);
      }
    } else {
      setCampaignName("");
      setCampaignStartDateTime(null);
      setCampaignEndDateTime(null);
      setCampaignPlace("");
    }
  };

  const handleInsert = () => {
    if (!isValid() || !campaignStartDateTime || !campaignEndDateTime || !deadlineDateTime) return;

    const buttonHtml = `<a href="{{RSVP_LINK}}" data-button-type="campaign-attendance" data-campaign-name="${campaignName}" data-campaign-start="${formatDateTime(campaignStartDateTime)}" data-campaign-end="${formatDateTime(campaignEndDateTime)}" data-campaign-place="${campaignPlace}" data-deadline="${formatDateTime(deadlineDateTime)}" style="display:inline-block;padding:12px 24px;background:#1a2f4a;color:white;text-decoration:none;border-radius:4px;font-weight:500;">${buttonText}</a>`;

    onInsert(buttonHtml);
    handleClose();
  };

  const handleClose = () => {
    setButtonText("");
    setSelectedCampaign("");
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
      <CreateCampaignDialog
        isOpen={isCreateCampaignDialogOpen}
        onClose={() => setIsCreateCampaignDialogOpen(false)}
        onCampaignCreated={handleCampaignCreated}
      />
      <Modal isOpen={isOpen} onClose={handleClose} title="Insert Event Attendance Button">
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
              Event Information
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">Related event</label>
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <Listbox value={selectedCampaign || "none"} onChange={handleCampaignSelection}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white py-3 pl-4 pr-10 text-left shadow-sm border border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm">
                        <span className="block truncate text-gray-900">
                          {selectedCampaign && selectedCampaign !== "none"
                            ? availableCampaigns.find(c => c.id === selectedCampaign)?.name ||
                              "Select an existing event"
                            : "Select an existing event"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                        <Listbox.Option
                          value="none"
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
                                Select an existing event
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                        {availableCampaigns.map(campaign => (
                          <Listbox.Option
                            key={campaign.id}
                            value={campaign.id}
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
                                  {campaign.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <Check className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
                <span className="text-gray-500 font-medium">OR</span>
                <button
                  type="button"
                  onClick={() => setIsCreateCampaignDialogOpen(true)}
                  className="px-6 py-2 bg-[#4a5f71] text-white rounded-md hover:bg-[#3d4f5f] transition-colors font-medium"
                >
                  Create New Event
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Registration deadline</label>
              <DateTimeInput
                selected={deadlineDateTime}
                onChange={(date: Date | null) => setDeadlineDateTime(date)}
                minDate={now}
                maxDate={campaignStartDateTime || fiveYearsLater}
                placeholderText="Type or select: YYYY/MM/DD HH:mm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold">Page Preview</h3>
            <AttendancePreview
              campaignName={campaignName}
              campaignStartDate={
                campaignStartDateTime
                  ? `${campaignStartDateTime.getFullYear()}/${String(campaignStartDateTime.getMonth() + 1).padStart(2, "0")}/${String(campaignStartDateTime.getDate()).padStart(2, "0")}`
                  : ""
              }
              campaignStartTime={campaignStartDateTime?.toTimeString().slice(0, 5) || ""}
              campaignEndDate={
                campaignEndDateTime
                  ? `${campaignEndDateTime.getFullYear()}/${String(campaignEndDateTime.getMonth() + 1).padStart(2, "0")}/${String(campaignEndDateTime.getDate()).padStart(2, "0")}`
                  : ""
              }
              campaignEndTime={campaignEndDateTime?.toTimeString().slice(0, 5) || ""}
              campaignPlace={campaignPlace}
              deadline={
                deadlineDateTime
                  ? `${deadlineDateTime.getFullYear()}/${String(deadlineDateTime.getMonth() + 1).padStart(2, "0")}/${String(deadlineDateTime.getDate()).padStart(2, "0")}`
                  : ""
              }
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
