export interface Campaign {
  cohort: string;
  created_at: string;
  campaign_id: string;
  campaign_name: string;
  campaign_start_time: string;
  campaign_end_time: string;
  campaign_location: string;
  is_active: boolean;
}

export interface Participant {
  run_id: string;
  participant_id: string;
  email: string;
  campaign_id: string;
  rsvp_status: "PENDING" | "ATTEND" | "NOT_ATTEND";
  name: string;
  campaign_participant_uniq_handle: string;
  created_at: string;
  updated_at: string;
}

export interface RunCampaignMapping {
  campaign_id: string;
  run_id: string;
  registration_deadline: string;
  max_participants: number;
  is_active: boolean;
}

export interface Run {
  run_id: string;
  subject: string;
  created_at: string;
  is_active: boolean;
  campaign_id: string;
  attendance_respond_deadline: string;
}

export type CampaignStatus = "ongoing" | "future" | "past";
