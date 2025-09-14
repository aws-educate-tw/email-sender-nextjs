"use client";
import { Suspense } from "react";
import WebhookService from "@/app/ui/webhookService/webhook-service";

function WebhookServiceFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1a2f4a]"></div>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <Suspense fallback={<WebhookServiceFallback />}>
        <WebhookService />
      </Suspense>
    </div>
  );
}
