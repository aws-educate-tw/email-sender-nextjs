"use client";

import { useState } from "react";
import { X } from "lucide-react";
import DateTimeInput from "./datetime-input";

interface CreateCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCampaignDialog({ isOpen, onClose, onSuccess }: CreateCampaignDialogProps) {
  const [formData, setFormData] = useState({
    campaign_name: "",
    campaign_start_time: null as Date | null,
    campaign_end_time: null as Date | null,
    campaign_location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const USE_MOCK_DATA = true;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.campaign_start_time || !formData.campaign_end_time) {
      alert("Please select both start and end times.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Mock: Campaign created", formData);
        onSuccess();
        onClose();
        setFormData({ campaign_name: "", campaign_start_time: null, campaign_end_time: null, campaign_location: "" });
        return;
      }

      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${base_url}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaign_name: formData.campaign_name,
          campaign_start_time: formData.campaign_start_time.toISOString(),
          campaign_end_time: formData.campaign_end_time.toISOString(),
          campaign_location: formData.campaign_location,
          is_active: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to create campaign");

      onSuccess();
      onClose();
      setFormData({ campaign_name: "", campaign_start_time: null, campaign_end_time: null, campaign_location: "" });
    } catch (error) {
      console.error("Failed to create campaign:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">EVENT INFORMATION</h2>
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
                    setFormData({ ...formData, campaign_start_time: date });
                    if (date && formData.campaign_end_time && formData.campaign_end_time <= date) {
                      setFormData(prev => ({ ...prev, campaign_end_time: null }));
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
                  onChange={date => setFormData({ ...formData, campaign_end_time: date })}
                  minDate={formData.campaign_start_time || new Date()}
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
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
