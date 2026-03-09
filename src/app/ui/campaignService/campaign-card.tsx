import Link from "next/link";
import { Campaign } from "@/app/ui/campaignService/types";
import { formatDateTime } from "@/app/ui/campaignService/utils";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link
      href={`/campaignService/${campaign.campaign_id}`}
      className="block w-full hover:shadow-lg transition rounded-lg shadow-sm bg-white p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-black mb-2">{campaign.campaign_name}</h3>
      <p className="text-sm text-gray-600">
        Event Date: {formatDateTime(campaign.campaign_start_time)} - {formatDateTime(campaign.campaign_end_time)}
      </p>
    </Link>
  );
}
