"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Campaign, Participant, Run } from "@/app/ui/campaignService/types";
import { formatDateTime } from "@/app/ui/campaignService/utils";
import ParticipantsTable from "@/app/ui/campaignService/participants-table";
import EditCampaignDialog from "@/app/ui/campaignService/edit-campaign-dialog";
import RotatingLoaderAnimation from "@/app/ui/rotating-loader-animation";
import { Pencil, ChevronRight } from "lucide-react";
import { mockCampaignsData } from "@/app/ui/campaignService/mockData";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const USE_MOCK_DATA = true;

  const mockRuns: Run[] = [
    {
      run_id: "run_001",
      subject: "活動延期通知｜出缺席確認",
      created_at: "2024-02-15T22:09:16Z",
      is_active: true,
      campaign_id: "camp_001",
    },
  ];

  const mockParticipants: Participant[] = [
    {
      run_id: "run_001",
      participant_id: "part_001",
      email: "participant@gmail.com",
      campaign_id: "camp_001",
      rsvp_status: "ATTEND",
      name: "Participant Name",
      campaign_participant_uniq_handle: "camp_001#participant@gmail.com",
      created_at: "2024-01-15T08:30:00Z",
      updated_at: "2024-02-20T14:22:10Z",
    },
  ];

  useEffect(() => {
    loadCampaignData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  useEffect(() => {
    if (selectedRunId) {
      loadParticipants(selectedRunId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRunId]);

  const loadCampaignData = async () => {
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
  };

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

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">{campaign.campaign_name}</h2>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
              EVENT INFORMATION
            </h3>
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Pencil size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Event time</p>
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <div>
                  <p className="text-xs text-gray-500">Start</p>
                  <p className="text-gray-900">{formatDateTime(campaign.campaign_start_time)}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="text-xs text-gray-500">End</p>
                  <p className="text-gray-900">{formatDateTime(campaign.campaign_end_time)}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Event place</p>
              <p className="text-gray-900 break-words">{campaign.campaign_location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold mb-4">Participants Attendance</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Select an email from the email history for attendance tracking.
        </p>

        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Email Subject:
          </label>
          <select
            value={selectedRunId}
            onChange={e => setSelectedRunId(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm sm:text-base"
          >
            {runs.map(run => (
              <option key={run.run_id} value={run.run_id}>
                {run.subject}
              </option>
            ))}
          </select>
        </div>

        {selectedRunId && <ParticipantsTable participants={participants} />}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <button className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 hover:text-gray-600 transition">
          Related Email Sending Histories
          <ChevronRight size={20} />
        </button>
      </div>

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
