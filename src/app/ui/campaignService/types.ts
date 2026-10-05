// API 1: List campaigns response type
export interface CampaignListItem {
  campaign_id: string;
  campaign_name: string;
  campaign_start_time: string;
  campaign_end_time: string;
  campaign_location: string;
  campaign_created_at: string;
  is_active: boolean;
}

// Frontend Campaign type (for compatibility with existing UI)
export interface Campaign {
  campaign_id: string;
  campaign_name: string;
  campaign_start_time: string;
  campaign_end_time: string;
  campaign_location: string;
  campaign_created_at: string;
  is_active: boolean;
}

export interface Participant {
  participant_id: string;
  email: string | null;
  rsvp_status: "PENDING" | "ATTEND" | "NOT_ATTEND";
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Run {
  run_id: string;
  subject: string;
  registration_deadline: string;
  max_participants: number;
  is_active: boolean;
  participants: Participant[];
}

// API response types
export interface CampaignDetailResponse {
  campaign_id: string;
  campaign_name: string;
  created_at: string;
  is_active: boolean;
  runs: Run[];
}

export type CampaignStatus = "ongoing" | "future" | "past";
