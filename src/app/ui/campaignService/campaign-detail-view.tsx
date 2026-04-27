"use client";

import { useState } from "react";
import { Campaign, Run, Participant } from "./types";
import CampaignInfoCard from "./campaign-info-card";
import ParticipantsSection from "./participants-section";
import EditCampaignDialog from "./edit-campaign-dialog";
import RotatingLoaderAnimation from "../rotating-loader-animation";
import Link from "next/link";

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

      <Link
        href={{
          pathname: "/emailHistory",
          query: {
            campaign_id: campaignId,
            campaign_name: campaign.campaign_name,
          },
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-gray-100 rounded-lg shadow-md p-4 sm:p-6 text-lg sm:text-xl font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer text-left"
      >
        Related Email Sending Histories
      </Link>

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
