import React from "react";

interface EmailTotalSummaryProps {
  selectedEmailNum: number;
  runSummary?: {
    totalEmailNum: number;
    successEmailNum: number;
    failedEmailNum: number;
  };
}

export default function EmailTotalSummary({
  selectedEmailNum,
  runSummary = { totalEmailNum: 0, successEmailNum: 0, failedEmailNum: 0 },
}: EmailTotalSummaryProps) {
  const formatNumber = (num: number, isTotalZero: boolean): string => {
    if (isTotalZero) {
      return "-";
    }
    return num.toString();
  };

  const isTotalZero = runSummary.totalEmailNum === 0;

  return (
    <div className="flex items-center space-x-6 text-gray-700 py-3">
      <div className="text-xl font-bold">{selectedEmailNum} recipients selected</div>
      <div className="text-base text-gray-500">
        Total: {formatNumber(runSummary.totalEmailNum, isTotalZero)} | Success:{" "}
        {formatNumber(runSummary.successEmailNum, isTotalZero)} | Failed:{" "}
        {formatNumber(runSummary.failedEmailNum, isTotalZero)}
      </div>
    </div>
  );
}
