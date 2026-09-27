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
    return new URL(
      `/rsvp-service/${encodeURIComponent(environment)}/${rsvpPath}`,
      endpointUrl.origin
    );
  }

  const normalizedEndpoint = `${endpoint.replace(/\/+$/, "")}/`;
  return new URL(normalizedPath, normalizedEndpoint);
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
