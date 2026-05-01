export type RsvpStatus = "PENDING" | "ATTEND" | "NOT_ATTEND";

export interface RsvpToken {
  run_id: string;
  participant_id: string;
  email_id: string;
  name: string;
  iat: number;
  exp: number;
}

export interface RsvpPageState {
  currentStatus: RsvpStatus;
  participantName: string;
  eventName: string;
  eventTime: string;
  location: string;
  registrationDeadline: string;
  isRegistrationClosed: boolean;
  lastEditedTime?: number;
  isEditing: boolean;
  isSubmitting: boolean;
  selectedOption: "ATTEND" | "NOT_ATTEND" | null;
}

export interface RsvpApiResponse {
  status: "success" | "error";
  data?: {
    currentStatus: RsvpStatus;
    participantName: string;
    runInfo: {
      eventName: string;
      eventTime: string;
      location: string;
      registrationDeadline: string;
      isRegistrationClosed: boolean;
    };
    stats?: {
      totalAttendees: number;
    };
  };
  message?: string;
}
