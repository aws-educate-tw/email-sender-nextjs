// Mock data for testing RSVP service
// TODO: Remove this file when integrating with real backend API

export const MOCK_RSVP_DATA = {
  participant: {
    name: "王小明",
    email: "participant@example.com",
  },
  event: {
    name: "AWS Cloud Workshop",
    startTime: "2026-03-01 09:00",
    endTime: "2026-03-01 17:00",
    location: "AWS Taipei",
    deadline: "2026-02-20 23:59",
  },
  // Mock response for different test scenarios
  responses: {
    pending: {
      status: "PENDING" as const,
      lastEditedTime: null,
    },
    attended: {
      status: "ATTEND" as const,
      lastEditedTime: "2026-01-29 21:20",
    },
    notAttended: {
      status: "NOT_ATTEND" as const,
      lastEditedTime: "2026-01-29 21:20",
    },
  },
};

// Valid mock tokens for testing
export const MOCK_TOKENS = {
  valid: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock",
  expired: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired",
};
