"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Campaign, Run } from "./types";
import DateTimeInput from "./datetime-input";

interface EditCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaign: Campaign;
  runs: Run[];
}

async function updateCampaign(campaignId: string, data: any): Promise<void> {
  const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${base_url}/campaigns/${campaignId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update campaign");
}

export default function EditCampaignDialog({
  isOpen,
  onClose,
  onSuccess,
  campaign,
  runs,
}: EditCampaignDialogProps) {
  const [formData, setFormData] = useState<{
    campaign_name: string;
    campaign_start_time: Date | null;
    campaign_end_time: Date | null;
    campaign_location: string;
  }>({
    campaign_name: campaign.campaign_name,
    campaign_start_time: new Date(campaign.campaign_start_time),
    campaign_end_time: new Date(campaign.campaign_end_time),
    campaign_location: campaign.campaign_location,
  });
  const [runStates, setRunStates] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        campaign_name: campaign.campaign_name,
        campaign_start_time: new Date(campaign.campaign_start_time),
        campaign_end_time: new Date(campaign.campaign_end_time),
        campaign_location: campaign.campaign_location,
      });
      setHasChanges(false);

      const initialStates: Record<string, boolean> = {};
      runs.forEach(run => {
        initialStates[run.run_id] = run.is_active;
      });
      setRunStates(initialStates);
    }
  }, [isOpen, campaign, runs]);

  const toggleRunState = (runId: string) => {
    setRunStates(prev => ({
      ...prev,
      [runId]: !prev[runId],
    }));
    setHasChanges(true);
  };

  const formatDeadline = (createdAt: string) => {
    const date = new Date(createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.campaign_start_time || !formData.campaign_end_time) {
        alert("Please select both start and end times.");
        setIsSubmitting(false);
        return;
      }

      await updateCampaign(campaign.campaign_id, {
        campaign_name: formData.campaign_name,
        campaign_start_time: formData.campaign_start_time.toISOString(),
        campaign_end_time: formData.campaign_end_time.toISOString(),
        campaign_location: formData.campaign_location,
      });

      // TODO: Update run states via API
      // await Promise.all(
      //   Object.entries(runStates).map(([runId, isActive]) =>
      //     updateRunStatus(runId, isActive)
      //   )
      // );

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update campaign:", error);
      alert("Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.campaign_name.trim() !== "" &&
    formData.campaign_start_time !== null &&
    formData.campaign_end_time !== null &&
    formData.campaign_location.trim() !== "" &&
    hasChanges;

  if (!isOpen) return null;

  const dialogContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Event Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 p-4 sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Event name
                </label>
                <input
                  type="text"
                  required
                  value={formData.campaign_name}
                  onChange={e => {
                    setFormData({ ...formData, campaign_name: e.target.value });
                    setHasChanges(true);
                  }}
                  placeholder="Enter event name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Event time
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Start</label>
                    <DateTimeInput
                      selected={formData.campaign_start_time}
                      onChange={date => {
                        setFormData({ ...formData, campaign_start_time: date });
                        setHasChanges(true);
                        if (
                          date &&
                          formData.campaign_end_time &&
                          formData.campaign_end_time <= date
                        ) {
                          setFormData(prev => ({ ...prev, campaign_end_time: null }));
                        }
                      }}
                      minDate={new Date()}
                      placeholderText="Type or select: YYYY/MM/DD HH:mm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">End</label>
                    <DateTimeInput
                      selected={formData.campaign_end_time}
                      onChange={date => {
                        setFormData({ ...formData, campaign_end_time: date });
                        setHasChanges(true);
                      }}
                      minDate={formData.campaign_start_time || new Date()}
                      placeholderText="Type or select: YYYY/MM/DD HH:mm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold text-gray-700 mb-3">
                  Event place
                </label>
                <input
                  type="text"
                  required
                  value={formData.campaign_location}
                  onChange={e => {
                    setFormData({ ...formData, campaign_location: e.target.value });
                    setHasChanges(true);
                  }}
                  placeholder="Enter event location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <label className="block text-base font-semibold text-gray-700 mb-4">
                Related attendance
              </label>
              {runs.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No related emails found</div>
              ) : (
                <div className="space-y-2">
                  {runs.map(run => (
                    <div
                      key={run.run_id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-1"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm text-gray-600">Email Subject: </span>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                          {run.subject}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 ml-2 whitespace-nowrap">
                          (DL: {formatDeadline(run.registration_deadline)})
                        </span>
                      </div>
                      <div className="flex rounded-lg overflow-hidden border border-gray-300 flex-shrink-0 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => toggleRunState(run.run_id)}
                          className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 transition text-xs sm:text-sm ${
                            runStates[run.run_id]
                              ? "bg-white text-gray-700"
                              : "bg-[#2c3e50] text-white"
                          }`}
                        >
                          Active
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleRunState(run.run_id)}
                          className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2 transition text-xs sm:text-sm ${
                            !runStates[run.run_id]
                              ? "bg-white text-gray-700"
                              : "bg-[#2c3e50] text-white"
                          }`}
                        >
                          Closed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-8 py-4 sm:py-5 border-t bg-white flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 rounded-lg transition ${
                isFormValid && !isSubmitting
                  ? "bg-[#3d4f5f] text-white hover:bg-[#4a5f71]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
