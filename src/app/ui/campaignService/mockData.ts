import { Campaign } from "./types";

// Mock Data (for development use)
export const mockCampaignsData: Campaign[] = [
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

export function addMockCampaign(
  campaign: Omit<Campaign, "campaign_id" | "created_at" | "cohort" | "is_active">
) {
  const newCampaign: Campaign = {
    ...campaign,
    campaign_id: `camp_${String(mockCampaignsData.length + 1).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    cohort: "8",
    is_active: true,
  };
  mockCampaignsData.push(newCampaign);
}
