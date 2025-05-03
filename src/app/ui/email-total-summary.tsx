import React from "react";

interface EmailTotalSummaryProps {
  selectedEmailNum: number;
  runDetails?: {
    totalEmailNum: number;
    successEmailNum: number;
    failedEmailNum: number;
  };
}

export default function EmailTotalSummary({
  selectedEmailNum,
  runDetails = { totalEmailNum: 0, successEmailNum: 0, failedEmailNum: 0 },
}: EmailTotalSummaryProps) {
  return (
    <div className="flex items-center space-x-6 text-gray-700 py-3">
      <div className="text-xl font-bold">{selectedEmailNum} recipients selected</div>
      <div className="text-base text-gray-500">
        Total: {runDetails.totalEmailNum} | Success: {runDetails.successEmailNum} | Failed:{" "}
        {runDetails.failedEmailNum}
      </div>
    </div>
  );
}
