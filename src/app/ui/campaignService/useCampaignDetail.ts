import { useState, useEffect, useCallback } from "react";
import { Campaign, Run, Participant, CampaignDetailResponse } from "./types";
import { mockCampaignsData, mockRuns } from "./mockData";

const USE_MOCK_DATA = false;

export function useCampaignDetail(campaignId: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCampaignData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const campaignData = mockCampaignsData.find(c => c.campaign_id === campaignId);
        // For mock data, just return all runs since they don't have campaign_id anymore
        const runsData = mockRuns;
        setCampaign(campaignData || null);
        setRuns(runsData);
        if (runsData.length > 0) {
          setSelectedRunId(runsData[0].run_id);
        }
        return;
      }

      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${base_url}/rsvp-service/campaigns/${campaignId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch campaign detail");

      const data: CampaignDetailResponse = await response.json();

      // Convert API response format to frontend required format
      const campaignData: Campaign = {
        campaign_id: data.campaign_id,
        campaign_name: data.campaign_name,
        campaign_start_time: "", // Not provided in API spec, will need to be added to API or handled differently
        campaign_end_time: "", // Not provided in API spec, will need to be added to API or handled differently
        campaign_location: "", // Not provided in API spec, will need to be added to API or handled differently
        campaign_created_at: data.created_at,
        is_active: data.is_active,
        description: data.description,
      };

      setCampaign(campaignData);
      setRuns(data.runs);
      if (data.runs.length > 0) {
        setSelectedRunId(data.runs[0].run_id);
      }
    } catch (error) {
      console.error("Failed to load campaign data:", error);
      alert("Failed to load event data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  const loadParticipants = useCallback(
    async (runId: string) => {
      try {
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 300));
          // For mock data, find the run and get its participants
          const currentRun = mockRuns.find(r => r.run_id === runId);
          const data = currentRun ? currentRun.participants : [];
          setParticipants(data);
          return;
        }

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
