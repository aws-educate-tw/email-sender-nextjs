import "server-only";

import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  TOKEN_EXPIRY_COOKIE,
  isTokenExpiryTimeValid,
} from "@/lib/auth-cookies";

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication required");
    this.name = "AuthenticationError";
  }
}

function resolveWithinBase(pathname: string, baseUrl: URL): URL {
  const targetUrl = new URL(pathname.replace(/^\/+/, ""), baseUrl);

  if (targetUrl.origin !== baseUrl.origin || !targetUrl.pathname.startsWith(baseUrl.pathname)) {
    throw new Error("Backend path escapes configured endpoint");
  }

  return targetUrl;
}

export function getBackendApiUrl(pathname: string): URL {
  const endpoint = (
    process.env.BACKEND_API_ENDPOINT || process.env.NEXT_PUBLIC_API_ENDPOINT
  )?.trim();

  if (!endpoint) {
    throw new Error("Missing BACKEND_API_ENDPOINT configuration");
  }

  const normalizedPath = pathname.replace(/^\/+/, "");
  const endpointUrl = new URL(endpoint);

  if (normalizedPath === "rsvp" || normalizedPath.startsWith("rsvp/")) {
    const environment = endpointUrl.pathname.split("/").filter(Boolean)[0];
    if (!environment) {
      throw new Error("Unable to resolve the Backend environment for RSVP requests");
    }

    const rsvpPath = normalizedPath.replace(/^rsvp\/?/, "");
    const rsvpBaseUrl = new URL(
      `/rsvp-service/${encodeURIComponent(environment)}/`,
      endpointUrl.origin
    );
    return resolveWithinBase(rsvpPath, rsvpBaseUrl);
  }

  const normalizedEndpoint = `${endpoint.replace(/\/+$/, "")}/`;
  return resolveWithinBase(normalizedPath, new URL(normalizedEndpoint));
}

export function getAuthenticatedAccessToken(): string {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const expiryTime = cookieStore.get(TOKEN_EXPIRY_COOKIE)?.value;

  if (!accessToken || !isTokenExpiryTimeValid(expiryTime)) {
    throw new AuthenticationError();
  }

  return accessToken;
}

export async function authenticatedBackendFetch(pathname: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getAuthenticatedAccessToken()}`);

  const response = await fetch(getBackendApiUrl(pathname), {
    ...init,
    headers,
    cache: "no-store",
  });

  if (response.status === 401) {
    const cookieStore = cookies();
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(TOKEN_EXPIRY_COOKIE);
  }

  return response;
}
