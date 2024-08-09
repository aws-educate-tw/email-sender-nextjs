"use client";
import { ReactNode, useState } from "react";

interface TooltipProps {
  message: string;
  children: ReactNode;
}

export default function Helptip({ message, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center hover:cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full transform bg-slate-200 text-slate-500 text-sm rounded-md shadow-xl p-2 whitespace-normal break-words z-50">
          <p className="text-wrap min-w-64">{message}</p>
        </div>
      )}
    </div>
  );
}
