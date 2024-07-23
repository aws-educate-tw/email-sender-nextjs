import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/sendEmail", "/templateEdit","/writeEmail"]; 

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token"); 

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  return NextResponse.next();
}

// 指定中間件應用於所有路徑
export const config = {
  matcher: ["/sendEmail", "/templateEdit","/writeEmail"],
};