export const ACCESS_TOKEN_COOKIE = "access_token";
export const TOKEN_EXPIRY_COOKIE = "token_expiry_time";
export const TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60;

export function getTokenExpiryTime() {
  return Date.now() + TOKEN_MAX_AGE_SECONDS * 1000;
}
