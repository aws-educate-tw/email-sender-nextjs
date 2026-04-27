"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CampaignListItem } from "@/app/ui/campaignService/types";
import { getCampaignServiceBaseUrl } from "@/app/ui/campaignService/utils";

interface EventFilterDropdownProps {
  campaignId: string;
  campaignName: string;
  onFilterChange: (campaignId: string, campaignName: string) => void;
}

export default function EventFilterDropdown({
  campaignId,
  campaignName,
  onFilterChange,
}: EventFilterDropdownProps) {
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const base = getCampaignServiceBaseUrl();
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const res = await fetch(`${base}/campaigns`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) return;
        const data: CampaignListItem[] = await res.json();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns for filter dropdown", error);
      }
    };
    fetchCampaigns();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = campaignName || "All Events";
  const isFiltered = !!campaignId;

  return (
    <div className="flex items-center gap-2 mt-1">
      <p className="text-lg font-bold text-700">Filtered Event:</p>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-sm font-bold uppercase tracking-wide transition-colors ${
            isFiltered
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          {selectedLabel}
          <ChevronDown size={14} />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 min-w-max bg-white border border-gray-200 rounded-md shadow-lg py-1">
            <button
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                !isFiltered ? "font-bold text-gray-700" : "text-gray-500"
              }`}
              onClick={() => {
                onFilterChange("", "");
                setIsOpen(false);
              }}
            >
              All Events
            </button>
            {campaigns.map(c => (
              <button
                key={c.campaign_id}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-50 hover:text-amber-700 ${
                  c.campaign_id === campaignId
                    ? "font-bold text-amber-700 bg-amber-50"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  onFilterChange(c.campaign_id, c.campaign_name);
                  setIsOpen(false);
                }}
              >
                {c.campaign_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
