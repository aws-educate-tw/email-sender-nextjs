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
}

const USE_MOCK_DATA = true;

const mockRuns: Run[] = [
  {
    run_id: "run_001",
    subject: "活動延期通知｜出缺席確認",
    created_at: "2024-02-15T22:09:16Z",
    is_active: true,
    campaign_id: "camp_001",
  },
];

async function fetchRunsByCampaignId(campaignId: string): Promise<Run[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRuns.filter(r => r.campaign_id === campaignId);
  }
  const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${base_url}/campaigns/${campaignId}/runs`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch runs");
  return response.json();
}

async function updateCampaign(campaignId: string, data: any): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Mock: Campaign updated", campaignId, data);
    return;
  }
  const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${base_url}/campaigns/${campaignId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update campaign");
}

export default function EditCampaignDialog({ isOpen, onClose, onSuccess, campaign }: EditCampaignDialogProps) {
  const [formData, setFormData] = useState<{
    campaign_name: string;
    campaign_start_time: Date;
    campaign_end_time: Date | null;
    campaign_location: string;
  }>({
    campaign_name: campaign.campaign_name,
    campaign_start_time: new Date(campaign.campaign_start_time),
    campaign_end_time: new Date(campaign.campaign_end_time),
    campaign_location: campaign.campaign_location,
  });
  const [runs, setRuns] = useState<Run[]>([]);
  const [runStates, setRunStates] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        campaign_name: campaign.campaign_name,
        campaign_start_time: new Date(campaign.campaign_start_time),
        campaign_end_time: new Date(campaign.campaign_end_time),
        campaign_location: campaign.campaign_location,
      });
      loadRuns();
    }
  }, [isOpen, campaign]);

  const loadRuns = async () => {
    setIsLoadingRuns(true);
    try {
      const runsData = await fetchRunsByCampaignId(campaign.campaign_id);
      setRuns(runsData);
      const initialStates: Record<string, boolean> = {};
      runsData.forEach(run => {
        initialStates[run.run_id] = run.is_active;
      });
      setRunStates(initialStates);
    } catch (error) {
      console.error("Failed to load runs:", error);
    } finally {
      setIsLoadingRuns(false);
    }
  };

  const toggleRunState = (runId: string) => {
    setRunStates(prev => ({
      ...prev,
      [runId]: !prev[runId],
    }));
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
      if (!formData.campaign_end_time) {
        alert("Please select an end time.");
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

  if (!isOpen) return null;

  const dialogContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">EDIT EVENT INFORMATION</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event name</label>
            <input
              type="text"
              required
              value={formData.campaign_name}
              onChange={e => setFormData({ ...formData, campaign_name: e.target.value })}
              placeholder="Enter event name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event time</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start</label>
                <DateTimeInput
                  selected={formData.campaign_start_time}
                  onChange={date => {
                    if (date) {
                      setFormData({ ...formData, campaign_start_time: date });
                      if (formData.campaign_end_time && formData.campaign_end_time <= date) {
                        setFormData(prev => ({ ...prev, campaign_end_time: null }));
                      }
                    }
                  }}
                  minDate={new Date()}
                  placeholderText="Type or select: YYYY/MM/DD HH:mm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <DateTimeInput
                  selected={formData.campaign_end_time}
                  onChange={date => date && setFormData({ ...formData, campaign_end_time: date })}
                  minDate={formData.campaign_start_time}
                  placeholderText="Type or select: YYYY/MM/DD HH:mm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Event place</label>
            <input
              type="text"
              required
              value={formData.campaign_location}
              onChange={e => setFormData({ ...formData, campaign_location: e.target.value })}
              placeholder="Enter event location"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">Related attendance</label>
            {isLoadingRuns ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : runs.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No related emails found</div>
            ) : (
              <div className="space-y-3">
                {runs.map(run => (
                  <div key={run.run_id} className="flex items-center justify-between py-3 border-b">
                    <div className="flex-1">
                      <span className="text-sm text-gray-600">Email Subject: </span>
                      <span className="text-sm font-medium text-gray-900">{run.subject}</span>
                      <span className="text-sm text-gray-500 ml-2">(DL: {formatDeadline(run.created_at)})</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggleRunState(run.run_id)}
                        className={`px-6 py-2 rounded-full transition ${
                          runStates[run.run_id]
                            ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            : "bg-sky-950 text-white hover:bg-sky-800"
                        }`}
                      >
                        Enable
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleRunState(run.run_id)}
                        className={`px-6 py-2 rounded-full transition ${
                          !runStates[run.run_id]
                            ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            : "bg-sky-950 text-white hover:bg-sky-800"
                        }`}
                      >
                        Disable
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sky-950 text-white rounded-full hover:bg-sky-800 transition disabled:opacity-50"
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
