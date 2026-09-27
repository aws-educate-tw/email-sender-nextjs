import { NextRequest, NextResponse } from "next/server";
import {
  AuthenticationError,
  authenticatedBackendFetch,
  getBackendApiUrl,
} from "@/lib/backend-api-client";
import { ACCESS_TOKEN_COOKIE, TOKEN_EXPIRY_COOKIE } from "@/lib/auth-cookies";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    path: string[];
  };
};

function clearAuthenticationCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(TOKEN_EXPIRY_COOKIE);
}

async function proxyRequest(request: NextRequest, { params }: RouteContext) {
  try {
    const pathname = params.path.map(segment => encodeURIComponent(segment)).join("/");
    const backendPath = `${pathname}${request.nextUrl.search}`;
    const headers = new Headers(request.headers);
    const isPublicRsvpTokenRequest = /^rsvp\/rsvp\/[^/]+(?:\/status)?$/.test(pathname);
    const rsvpAuthorization = headers.get("authorization");

    headers.delete("authorization");
    headers.delete("connection");
    headers.delete("content-length");
    headers.delete("cookie");
    headers.delete("host");

    if (isPublicRsvpTokenRequest) {
      if (!rsvpAuthorization?.startsWith("Bearer ")) {
        return NextResponse.json({ message: "RSVP token required" }, { status: 401 });
      }
      headers.set("Authorization", rsvpAuthorization);
    }

    const method = request.method.toUpperCase();
    const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();
    const requestInit: RequestInit = {
      method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    };
    const backendResponse = isPublicRsvpTokenRequest
      ? await fetch(getBackendApiUrl(backendPath), requestInit)
      : await authenticatedBackendFetch(backendPath, requestInit);

    const responseHeaders = new Headers(backendResponse.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("set-cookie");
    responseHeaders.delete("transfer-encoding");

    const response = new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });

    if (backendResponse.status === 401) {
      clearAuthenticationCookies(response);
    }

    return response;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      const response = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      clearAuthenticationCookies(response);
      return response;
    }

    console.error("BFF proxy request failed:", error);
    return NextResponse.json({ message: "Backend request failed" }, { status: 502 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
