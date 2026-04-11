import { useState, useEffect, useCallback } from "react";
import { Campaign, Run, Participant, CampaignDetailResponse, CampaignListItem } from "./types";

export function useCampaignDetail(campaignId: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCampaignData = useCallback(async () => {
    setIsLoading(true);
    try {
      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;
      if (!environment) {
        throw new Error("Missing environment configuration. Please set NEXT_PUBLIC_ENVIRONMENT.");
      }
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Unauthorized: missing access token. Please login again.");
      }
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

      // Fetch campaign list and detail in parallel because they do not depend on each other.
      const [campaignsResponse, detailResponse] = await Promise.all([
        fetch(`${base_url}/rsvp-service/${environment}/campaigns`, {
          headers,
        }),
        fetch(`${base_url}/rsvp-service/${environment}/campaigns/${campaignId}`, {
          headers,
        }),
      ]);

      if (campaignsResponse.status === 401 || campaignsResponse.status === 403) {
        throw new Error("Unauthorized: your session may have expired. Please login again.");
      }
      if (!campaignsResponse.ok) throw new Error("Failed to fetch campaigns list");

      if (detailResponse.status === 401 || detailResponse.status === 403) {
        throw new Error("Unauthorized: your session may have expired. Please login again.");
      }
      if (!detailResponse.ok) throw new Error("Failed to fetch campaign detail");

      const campaignsList: CampaignListItem[] = await campaignsResponse.json();
      const campaignBasicInfo = campaignsList.find(c => c.campaign_id === campaignId);
      if (!campaignBasicInfo) throw new Error(`Campaign with ID '${campaignId}' not found`);

      const detailData: CampaignDetailResponse = await detailResponse.json();

      // Merge basic info with detail data
      const campaignData: Campaign = {
        campaign_id: campaignBasicInfo.campaign_id,
        campaign_name: campaignBasicInfo.campaign_name,
        campaign_start_time: campaignBasicInfo.campaign_start_time,
        campaign_end_time: campaignBasicInfo.campaign_end_time,
        campaign_location: campaignBasicInfo.campaign_location,
        campaign_created_at: campaignBasicInfo.campaign_created_at,
        is_active: campaignBasicInfo.is_active,
      };

      setCampaign(campaignData);
      setRuns(detailData.runs);
      if (detailData.runs.length > 0) {
        setSelectedRunId(detailData.runs[0].run_id);
      }
    } catch (error) {
      console.error("Failed to load campaign data:", error);
      const message = error instanceof Error ? error.message : "Failed to load event data.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  const loadParticipants = useCallback(
    async (runId: string) => {
      try {
        // Get participants from corresponding run
        const currentRun = runs.find(run => run.run_id === runId);
        if (currentRun && currentRun.participants) {
          setParticipants(currentRun.participants);
        } else {
          setParticipants([]);
        }
      } catch (error) {
        console.error("Failed to load participants:", error);
      }
    },
    [runs]
  );

  useEffect(() => {
    loadCampaignData();
  }, [loadCampaignData]);

  useEffect(() => {
    if (selectedRunId && runs.length > 0) {
      loadParticipants(selectedRunId);
    }
  }, [selectedRunId, runs, loadParticipants]);

  return {
    campaign,
    runs,
    selectedRunId,
    setSelectedRunId,
    participants,
    isLoading,
    loadCampaignData,
  };
}
