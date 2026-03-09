"use client";

import { useEffect, useState } from "react";
import { Campaign } from "@/app/ui/campaignService/types";
import CampaignList from "@/app/ui/campaignService/campaign-list";
import CreateCampaignDialog from "@/app/ui/campaignService/create-campaign-dialog";
import RotatingLoaderAnimation from "@/app/ui/rotating-loader-animation";

// Mock Data（開發階段使用）- 移到組件外部以保持狀態
export let mockCampaignsData: Campaign[] = [
  {
    cohort: "8",
    created_at: "2024-01-10T10:00:00Z",
    campaign_id: "camp_001",
    campaign_name: "AIF workshop I",
    campaign_start_time: "2024-03-15T01:00:00Z",
    campaign_end_time: "2024-03-15T09:00:00Z",
    campaign_location: "Virtual - AWS Chime",
    is_active: true,
  },
  {
    cohort: "8",
    created_at: "2024-01-11T10:00:00Z",
    campaign_id: "camp_002",
    campaign_name: "AIF workshop II",
    campaign_start_time: "2024-03-16T01:00:00Z",
    campaign_end_time: "2024-03-16T09:00:00Z",
    campaign_location: "Virtual - AWS Chime",
    is_active: true,
  },
  {
    cohort: "8",
    created_at: "2024-02-01T10:00:00Z",
    campaign_id: "camp_003",
    campaign_name: "AIF workshop III",
    campaign_start_time: "2025-05-20T01:00:00Z",
    campaign_end_time: "2025-05-20T09:00:00Z",
    campaign_location: "Virtual - AWS Chime",
    is_active: true,
  },
];

export function addMockCampaign(campaign: Omit<Campaign, "campaign_id" | "created_at" | "cohort" | "is_active">) {
  const newCampaign: Campaign = {
    ...campaign,
    campaign_id: `camp_${String(mockCampaignsData.length + 1).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    cohort: "8",
    is_active: true,
  };
  mockCampaignsData.push(newCampaign);
}

export default function CampaignServicePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 🔧 開發開關：true = Mock Data, false = 真實 API
  const USE_MOCK_DATA = true;

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      // 使用 Mock Data
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCampaigns([...mockCampaignsData]);
        return;
      }

      // 使用真實 API
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${base_url}/campaigns`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      alert("Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <RotatingLoaderAnimation />
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
