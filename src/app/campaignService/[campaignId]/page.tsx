"use client";

import { useParams } from "next/navigation";
import { useCampaignDetail } from "@/app/ui/campaignService/useCampaignDetail";
import CampaignDetailView from "@/app/ui/campaignService/campaign-detail-view";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;

  const {
    campaign,
    runs,
    selectedRunId,
    setSelectedRunId,
    participants,
    isLoading,
    loadCampaignData,
  } = useCampaignDetail(campaignId);

  return (
    <CampaignDetailView
      campaign={campaign}
      runs={runs}
      selectedRunId={selectedRunId}
      onRunChange={setSelectedRunId}
      participants={participants}
      isLoading={isLoading}
      onCampaignUpdate={loadCampaignData}
    />
  );
}
