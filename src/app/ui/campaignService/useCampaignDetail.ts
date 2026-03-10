import { useState, useEffect, useCallback } from "react";
import { Campaign, Run, Participant } from "./types";
import { mockCampaignsData, mockRuns, mockParticipants } from "./mockData";

const USE_MOCK_DATA = true;

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
        const runsData = mockRuns.filter(r => r.campaign_id === campaignId);
        setCampaign(campaignData || null);
        setRuns(runsData);
        if (runsData.length > 0) {
          setSelectedRunId(runsData[0].run_id);
        }
        return;
      }

      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const token = localStorage.getItem("access_token");
      const [campaignRes, runsRes] = await Promise.all([
        fetch(`${base_url}/campaigns/${campaignId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }),
        fetch(`${base_url}/campaigns/${campaignId}/runs`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!campaignRes.ok || !runsRes.ok) throw new Error("Failed to fetch");

      const campaignData = await campaignRes.json();
      const runsData = await runsRes.json();
      setCampaign(campaignData);
      setRuns(runsData);
      if (runsData.length > 0) {
        setSelectedRunId(runsData[0].run_id);
      }
    } catch (error) {
      console.error("Failed to load campaign data:", error);
      alert("Failed to load event data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  const loadParticipants = async (runId: string) => {
    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = mockParticipants.filter(p => p.run_id === runId);
        setParticipants(data);
        return;
      }

      const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT;
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${base_url}/runs/${runId}/participants`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch participants");

      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error("Failed to load participants:", error);
    }
  };

  useEffect(() => {
    loadCampaignData();
  }, [loadCampaignData]);

  useEffect(() => {
    if (selectedRunId) {
      loadParticipants(selectedRunId);
    }
  }, [selectedRunId]);

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
