import { Campaign, Run, Participant } from "./types";

// Mock Data (for development use)
export const mockCampaignsData: Campaign[] = [
  {
    campaign_id: "camp_001",
    campaign_name: "AIF workshop I",
    campaign_start_time: "2024-03-15T01:00:00Z",
    campaign_end_time: "2024-03-15T09:00:00Z",
    campaign_location: "Virtual - AWS Chime",
    campaign_created_at: "2024-01-10T10:00:00Z",
    is_active: true,
    description: "Advanced AI fundamentals workshop for developers",
  },
  {
    campaign_id: "camp_002",
    campaign_name: "AIF workshop II",
    campaign_start_time: "2024-03-16T01:00:00Z",
    campaign_end_time: "2024-03-16T09:00:00Z",
    campaign_location: "Virtual - AWS Chime",
    campaign_created_at: "2024-01-11T10:00:00Z",
    is_active: true,
    description: "Intermediate AI concepts and practical applications",
  },
  {
    campaign_id: "camp_003",
    campaign_name: "AIF workshop III",
    campaign_start_time: "2025-05-20T01:00:00Z",
    campaign_end_time: "2025-05-20T09:00:00Z",
    campaign_location: "Virtual - AWS Chime",
    campaign_created_at: "2024-02-01T10:00:00Z",
    is_active: true,
    description: "Advanced AI implementation and deployment strategies",
  },
];

export const mockParticipants: Participant[] = [
  {
    participant_id: "part_001",
    email_id: "email_uuid_001",
    rsvp_status: "ATTEND",
    name: "Alice Chen",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-02-20T14:22:10Z",
  },
  {
    participant_id: "part_002",
    email_id: "email_uuid_002",
    rsvp_status: "ATTEND",
    name: "Bob Wang",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-02-20T14:22:10Z",
  },
  {
    participant_id: "part_003",
    email_id: "email_uuid_003",
    rsvp_status: "NOT_ATTEND",
    name: "Carol Liu",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-02-20T14:22:10Z",
  },
  {
    participant_id: "part_004",
    email_id: "email_uuid_004",
    rsvp_status: "ATTEND",
    name: "David Lee",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-02-20T14:22:10Z",
  },
  {
    participant_id: "part_005",
    email_id: "email_uuid_005",
    rsvp_status: "PENDING",
    name: "Emma Zhang",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-02-20T14:22:10Z",
  },
];

export const mockRuns: Run[] = [
  {
    run_id: "run_001",
    subject: "活動延期通知｜出缺席確認",
    registration_deadline: "2026-04-10T23:59:59Z",
    max_participants: 100,
    is_active: true,
    participants: mockParticipants,
  },
  {
    run_id: "run_002",
    subject: "實體報名成功信｜出缺席確認",
    registration_deadline: "2025-02-28T23:59:59Z",
    max_participants: 100,
    is_active: true,
    participants: [],
  },
  {
    run_id: "run_003",
    subject: "線上報名成功信｜出缺席確認",
    registration_deadline: "2025-02-27T23:59:59Z",
    max_participants: 100,
    is_active: false,
    participants: [],
  },
];

export function addMockCampaign(
  campaign: Omit<Campaign, "campaign_id" | "campaign_created_at" | "is_active">
) {
  const newCampaign: Campaign = {
    ...campaign,
    campaign_id: `camp_${String(mockCampaignsData.length + 1).padStart(3, "0")}`,
    campaign_created_at: new Date().toISOString(),
    is_active: true,
  };
  mockCampaignsData.push(newCampaign);
}
