"use client";

interface RsvpRadioGroupProps {
  selectedOption: "ATTEND" | "NOT_ATTEND" | null;
  onChange: (value: "ATTEND" | "NOT_ATTEND") => void;
  disabled: boolean;
}

export default function RsvpRadioGroup({
  selectedOption,
  onChange,
  disabled,
}: RsvpRadioGroupProps) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => !disabled && onChange("ATTEND")}
        disabled={disabled}
        className={`w-full p-3 border-2 rounded-full flex items-center justify-center gap-3 transition-all ${
          selectedOption === "ATTEND" ? "border-[#2c3e50] bg-[#d4e3f7]" : "border-gray-300 bg-white"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            selectedOption === "ATTEND" ? "bg-[#2c3e50]" : "border-2 border-gray-400"
          }`}
        >
          {selectedOption === "ATTEND" && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        是，我會準時出席。
      </button>

      <button
        type="button"
        onClick={() => !disabled && onChange("NOT_ATTEND")}
        disabled={disabled}
        className={`w-full p-3 border-2 rounded-full flex items-center justify-center gap-3 transition-all ${
          selectedOption === "NOT_ATTEND"
            ? "border-[#2c3e50] bg-[#d4e3f7]"
            : "border-gray-300 bg-white"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400"}`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
            selectedOption === "NOT_ATTEND" ? "bg-[#2c3e50]" : "border-2 border-gray-400"
          }`}
        >
          {selectedOption === "NOT_ATTEND" && (
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        否，我不克出席。
      </button>
    </div>
  );
}
