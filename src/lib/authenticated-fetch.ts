"use client";

let loginRedirect: Promise<never> | undefined;

export function showSessionExpiredNotice() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("reason") !== "session-expired") return;

  // Consume the notice before showing it, including during React Strict Mode effects.
  url.searchParams.delete("reason");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  window.alert("Unauthorized. Please login again.");
}

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
    window.location.replace("/login?reason=session-expired");
  }

  return loginRedirect;
}
