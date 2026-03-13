import { Run, Participant } from "./types";
import ParticipantsTable from "./participants-table";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

interface ParticipantsSectionProps {
  runs: Run[];
  selectedRunId: string;
  onRunChange: (runId: string) => void;
  participants: Participant[];
}

export default function ParticipantsSection({
  runs,
  selectedRunId,
  onRunChange,
  participants,
}: ParticipantsSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold mb-2">Participants Attendance</h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-6 italic">
        Select an email from the email history for attendance tracking.
      </p>

      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Email Subject:
        </label>
        <Listbox value={selectedRunId} onChange={onRunChange}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-xl bg-white py-3 pl-4 pr-10 text-left shadow-sm border border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm">
              <span className="block truncate">
                {runs.find(run => run.run_id === selectedRunId)?.subject || "Select an email"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
              {runs.map(run => (
                <Listbox.Option
                  key={run.run_id}
                  value={run.run_id}
                  className={({ active, selected }) =>
                    `relative cursor-default select-none py-3 pl-4 pr-10 ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-900"
                    } ${selected ? "bg-gray-500 text-white" : ""}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {run.subject}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {selectedRunId &&
        (() => {
          const selectedRun = runs.find(run => run.run_id === selectedRunId);
          if (!selectedRun) return null;

          const deadlineDate = new Date(selectedRun.attendance_respond_deadline);
          const isDeadlinePassed = new Date() > deadlineDate;
          const isAcceptingResponses = selectedRun.is_active && !isDeadlinePassed;

          const formatDeadline = (dateString: string) => {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
              return "Invalid Date";
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}/${month}/${day}`;
          };

          return (
            <div className="mb-4">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">
                Status:{" "}
                <span
                  className={`font-bold ${isAcceptingResponses ? "text-green-600" : "text-red-600"}`}
                >
                  {isAcceptingResponses ? "Accepted" : "Not accepted"}
                </span>{" "}
                for responses
                <span className="ml-4">
                  Attendance respond deadline:{" "}
                  <span className="font-bold">
                    {formatDeadline(selectedRun.attendance_respond_deadline)}
                  </span>
                </span>
              </div>
            </div>
          );
        })()}

      {selectedRunId && <ParticipantsTable participants={participants} />}
    </div>
  );
}
