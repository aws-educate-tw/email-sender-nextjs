"use client";

import { useState } from "react";
import { Campaign, Run, Participant } from "./types";
import CampaignInfoCard from "./campaign-info-card";
import ParticipantsSection from "./participants-section";
import EditCampaignDialog from "./edit-campaign-dialog";
import RotatingLoaderAnimation from "../rotating-loader-animation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CampaignDetailViewProps {
  campaignId: string;
  campaign: Campaign | null;
  runs: Run[];
  selectedRunId: string;
  onRunChange: (runId: string) => void;
  participants: Participant[];
  isLoading: boolean;
  onCampaignUpdate: () => void;
}

export default function CampaignDetailView({
  campaignId,
  campaign,
  runs,
  selectedRunId,
  onRunChange,
  participants,
  isLoading,
  onCampaignUpdate,
}: CampaignDetailViewProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <RotatingLoaderAnimation message="Loading event detail..." />
      </div>
    );
  }

  if (!campaign) {
    return <div className="p-8 text-center text-gray-500">Event not found</div>;
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div>
        <p className="text-2xl sm:text-4xl font-bold pt-2">Event Service</p>
        <p className="text-sm sm:text-base text-gray-500 italic">
          Manage your email events and view sending details.
        </p>
      </div>

      <CampaignInfoCard campaign={campaign} onEditClick={() => setIsEditDialogOpen(true)} />

      <ParticipantsSection
        runs={runs}
        selectedRunId={selectedRunId}
        onRunChange={onRunChange}
        participants={participants}
      />

      <div className="flex justify-end">
        <Link
          href={{
            pathname: "/emailHistory",
            query: {
              campaign_id: campaignId,
              campaign_name: campaign.campaign_name,
            },
          }}
          className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-md text-white hover:text-white bg-sky-950 hover:bg-sky-800 border border-gray-200"
        >
          View related email histories
          <ChevronRight size={16} />
        </Link>
      </div>

      {campaign && (
        <EditCampaignDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={() => {
            setIsEditDialogOpen(false);
            onCampaignUpdate();
          }}
          campaign={campaign}
          runs={runs}
        />
      )}
    </div>
  );
}
