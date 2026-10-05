import { Campaign, CampaignStatus } from "./types";

function getNormalizedApiEndpoint(): string {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT?.trim();
  if (!apiEndpoint) {
    throw new Error("Missing API endpoint configuration. Please set NEXT_PUBLIC_API_ENDPOINT.");
  }
  return apiEndpoint.replace(/\/+$/, "");
}

function resolveCampaignEnvironment(apiEndpoint: string): string {
  const pathnameEnvironment = new URL(apiEndpoint).pathname.split("/").filter(Boolean)[0];
  if (pathnameEnvironment) {
    return pathnameEnvironment;
  }

  throw new Error(
    "Unable to resolve campaign environment. Set NEXT_PUBLIC_API_ENDPOINT as https://api.tpet.aws-educate.tw/{environment}."
  );
}

export function getCampaignServiceBaseUrl(): string {
  const normalizedApiEndpoint = getNormalizedApiEndpoint();
  const endpointUrl = new URL(normalizedApiEndpoint);
  const environment = resolveCampaignEnvironment(normalizedApiEndpoint);
  return `${endpointUrl.origin}/rsvp-service/${environment}`;
}

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
