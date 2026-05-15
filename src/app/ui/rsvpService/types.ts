export type RsvpStatus = "PENDING" | "ATTEND" | "NOT_ATTEND";

export interface RsvpToken {
  run_id: string;
  participant_id: string;
  email_id: string;
  name: string;
  iat: number;
  exp: number;
}

export interface RsvpStatusResponse {
  status: "SUCCESS";
  rsvp_status: RsvpStatus;
  participant_name: string;
  campaign_name: string;
  campaign_start_time: string;
  campaign_location: string;
  registration_deadline: string;
  is_registration_closed: boolean;
}

export interface RsvpUpdateResponse {
  status: "SUCCESS";
  data: {
    currentStatus: RsvpStatus;
  };
}

export interface RsvpErrorResponse {
  code?: string;
  message?: string;
}
