"use client";

interface EventFilterDropdownProps {
  campaignId: string;
  campaignName: string;
}

export default function EventFilterDropdown({ campaignName }: EventFilterDropdownProps) {
  const selectedLabel = campaignName;

  return (
    <div className="flex items-center gap-2 mt-1">
      <p className="text-lg font-bold text-black-700">Filtered Event:</p>
      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-bold uppercase tracking-wide bg-amber-100 text-amber-700">
        {selectedLabel}
      </span>
    </div>
  );
}
