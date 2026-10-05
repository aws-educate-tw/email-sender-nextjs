import type { RsvpStatus } from "./types";

export type RsvpChoice = Exclude<RsvpStatus, "PENDING">;

/**
 * Keep the value sent to the RSVP API identical to the value selected in the
 * UI.  In particular, do not use a truthy/falsy conversion here: ATTEND and
 * NOT_ATTEND are both valid, distinct choices.
 */
export function createRsvpUpdatePayload(choice: RsvpChoice): { action: RsvpChoice } {
  return { action: choice };
}

export function isRsvpChoice(value: unknown): value is RsvpChoice {
  return value === "ATTEND" || value === "NOT_ATTEND";
}
