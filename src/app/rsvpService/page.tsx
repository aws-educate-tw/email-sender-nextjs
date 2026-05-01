"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RsvpConfirmationForm from "@/app/ui/rsvpService/rsvp-confirmation-form";

function RsvpPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const testMode = searchParams.get("mode");

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">無效的連結</h1>
          <p className="text-gray-600">此連結無效或已過期，請檢查您的電子郵件。</p>
        </div>
      </div>
    );
  }

  return <RsvpConfirmationForm token={token} testMode={testMode || undefined} />;
}

export default function RsvpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">載入中...</div>
        </div>
      }
    >
      <RsvpPageContent />
    </Suspense>
  );
}
