"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useCampaignDetail } from "@/app/ui/campaignService/useCampaignDetail";
import CampaignInfoCard from "@/app/ui/campaignService/campaign-info-card";
import ParticipantsSection from "@/app/ui/campaignService/participants-section";
import EditCampaignDialog from "@/app/ui/campaignService/edit-campaign-dialog";
import RotatingLoaderAnimation from "@/app/ui/rotating-loader-animation";
import Link from "next/link";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    campaign,
    runs,
    selectedRunId,
    setSelectedRunId,
    participants,
    isLoading,
    loadCampaignData,
  } = useCampaignDetail(campaignId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <RotatingLoaderAnimation />
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
        onRunChange={setSelectedRunId}
        participants={participants}
      />

      <Link
        href={`/emailHistory?campaign_id=${campaignId}&campaign_name=${encodeURIComponent(campaign.campaign_name)}`}
        className="block w-full bg-gray-100 rounded-lg shadow-md p-4 sm:p-6 text-lg sm:text-xl font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer text-left"
      >
        Related Email Sending Histories
      </Link>

      {campaign && (
        <EditCampaignDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={loadCampaignData}
          campaign={campaign}
        />
      )}
    </div>
  );
}
