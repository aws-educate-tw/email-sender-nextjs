import { Campaign, CampaignStatus } from "./types";

export function getCampaignStatus(campaign: Campaign): CampaignStatus {
  const now = new Date();
  const startTime = new Date(campaign.campaign_start_time);
  const endTime = new Date(campaign.campaign_end_time);

  if (now >= startTime && now <= endTime) {
    return "ongoing";
  } else if (now < startTime) {
    return "future";
  } else {
    return "past";
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export function formatDateTimeForInput(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}
