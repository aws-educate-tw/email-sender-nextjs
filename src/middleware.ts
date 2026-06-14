import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  TOKEN_EXPIRY_COOKIE,
  isTokenExpiryTimeValid,
} from "@/lib/auth-cookies";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const expiryTime = request.cookies.get(TOKEN_EXPIRY_COOKIE)?.value;
  const isValid = accessToken && isTokenExpiryTimeValid(expiryTime);

  if (isValid) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(TOKEN_EXPIRY_COOKIE);

  return response;
}

export const config = {
  matcher: [
    "/campaignService/:path*",
    "/emailHistory/:path*",
    "/emailService/:path*",
    "/onboarding/:path*",
    "/webhookRecords/:path*",
    "/webhookService/:path*",
  ],
};
