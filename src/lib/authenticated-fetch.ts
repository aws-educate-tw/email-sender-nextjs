"use client";

let loginRedirect: Promise<never> | undefined;

/** Fetch a protected BFF endpoint using the browser's session cookie. */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  if (loginRedirect) return loginRedirect;

  const response = await fetch(input, init);
  if (response.status !== 401) return response;

  if (!loginRedirect) {
    // Leave callers suspended while the document unloads, so their error handlers
    // cannot show blocking alerts or continue a failed upload/send workflow.
    loginRedirect = new Promise<never>(() => {});
    window.location.replace("/login");
  }

  return loginRedirect;
}
