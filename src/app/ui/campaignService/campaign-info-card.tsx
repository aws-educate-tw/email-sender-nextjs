import { Campaign } from "./types";
import { formatDateTime } from "./utils";
import { Pencil } from "lucide-react";

interface CampaignInfoCardProps {
  campaign: Campaign;
  onEditClick: () => void;
}

export default function CampaignInfoCard({ campaign, onEditClick }: CampaignInfoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">{campaign.campaign_name}</h2>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">
            EVENT INFORMATION
          </h3>
          <button onClick={onEditClick} className="text-gray-400 hover:text-gray-600">
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
  );
}
