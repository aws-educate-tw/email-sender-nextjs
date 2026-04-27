"use client";

import { useEffect, useState, useCallback } from "react";
import { Campaign, CampaignListItem } from "@/app/ui/campaignService/types";
import CampaignList from "@/app/ui/campaignService/campaign-list";
import CreateCampaignDialog from "@/app/ui/campaignService/create-campaign-dialog";
import RotatingLoaderAnimation from "@/app/ui/rotating-loader-animation";
import { getCampaignServiceBaseUrl } from "@/app/ui/campaignService/utils";

export default function CampaignServicePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const campaignServiceBaseUrl = getCampaignServiceBaseUrl();
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Unauthorized: missing access token. Please login again.");
      }

      const response = await fetch(`${campaignServiceBaseUrl}/campaigns`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized: your session may have expired. Please login again.");
        }
        throw new Error("Failed to fetch campaigns");
      }

      const data: CampaignListItem[] = await response.json();
      // Convert API response to Campaign format for UI compatibility
      const campaigns: Campaign[] = data.map(item => ({
        ...item,
      }));
      setCampaigns(campaigns);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      const message = error instanceof Error ? error.message : "Failed to load events.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <p className="text-4xl font-bold pt-2">Event Service</p>
        <div className="flex justify-between items-center w-full pb-4">
          <p className="text-gray-500 italic">Manage your email events and view sending details.</p>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-2 bg-sky-950 text-white rounded-md hover:bg-sky-800 transition"
        >
          Create New Event
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-100 rounded-md">
          <RotatingLoaderAnimation message="Loading events..." />
        </div>
      ) : (
        <CampaignList campaigns={campaigns} />
      )}

      <CreateCampaignDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={loadCampaigns}
      />
    </div>
  );
}
