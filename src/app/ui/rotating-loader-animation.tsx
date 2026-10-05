import React from "react";

interface RotatingLoaderAnimationProps {
  message?: string;
}

export default function RotatingLoaderAnimation({
  message = "Loading email history...",
}: RotatingLoaderAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 animate-spin rounded-full" />
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  );
}
