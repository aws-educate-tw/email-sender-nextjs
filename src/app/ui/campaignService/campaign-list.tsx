"use client";

import { useState } from "react";
import { Campaign } from "@/app/ui/campaignService/types";
import { getCampaignStatus } from "@/app/ui/campaignService/utils";
import CampaignCard from "./campaign-card";
import { ChevronRight } from "lucide-react";

interface CampaignListProps {
  campaigns: Campaign[];
}

export default function CampaignList({ campaigns }: CampaignListProps) {
  const [isPastExpanded, setIsPastExpanded] = useState(false);

  const ongoingCampaigns = campaigns.filter(c => getCampaignStatus(c) === "ongoing");
  const futureCampaigns = campaigns.filter(c => getCampaignStatus(c) === "future");
  const pastCampaigns = campaigns.filter(c => getCampaignStatus(c) === "past");

  return (
    <div className="space-y-8">
      {/* ONGOING EVENT */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">ONGOING EVENT</h2>
        {ongoingCampaigns.length > 0 ? (
          <div className="space-y-3">
            {ongoingCampaigns.map(campaign => <CampaignCard key={campaign.campaign_id} campaign={campaign} />)}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No ongoing events</p>
        )}
      </div>

      {/* FUTURE EVENT */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">FUTURE EVENT</h2>
        {futureCampaigns.length > 0 ? (
          <div className="space-y-3">
            {futureCampaigns.map(campaign => <CampaignCard key={campaign.campaign_id} campaign={campaign} />)}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No future events</p>
        )}
      </div>

      {/* PAST EVENT */}
      <div>
        <button
          onClick={() => setIsPastExpanded(!isPastExpanded)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4 hover:text-gray-800"
        >
          <ChevronRight className={`transition-transform ${isPastExpanded ? "rotate-90" : ""}`} size={16} />
          PAST EVENT
        </button>
        {isPastExpanded && (
          pastCampaigns.length > 0 ? (
            <div className="space-y-3">
              {pastCampaigns.map(campaign => <CampaignCard key={campaign.campaign_id} campaign={campaign} />)}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No past events</p>
          )
        )}
      </div>
    </div>
  );
}
