"use client";

import { useState, useEffect } from "react";
import RsvpConfirmationForm from "@/app/ui/rsvpService/rsvp-confirmation-form";

export default function RsvpPage() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    setToken(hash || null);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

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

  return <RsvpConfirmationForm token={token} />;
}
