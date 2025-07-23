"use client";

interface EmailServiceStartOptionProps {
  onSelect: (mode: "new" | "edit-existing" | "resend") => void;
}

export default function EmailServiceStartOption({ onSelect }: EmailServiceStartOptionProps) {
  return (
    <div className="min-h-screen px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mt-6 space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              How would you like to begin?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
              Choose your preferred way to get started
            </p>
          </div>

          <div className="relative md:space-y-0 space-y-6">
            {/* Main Option */}
            <div className="flex justify-center">
              <button onClick={() => onSelect("new")} className="group relative w-full max-w-md">
                <div className="aspect-square bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transform transition-all duration-500 hover:scale-105 shadow-lg shadow-yellow-200/50">
                  <div className="text-center space-y-4 text-white px-4">
                    <div className="text-6xl md:text-8xl animate-bounce">✏️</div>
                    <div className="font-semibold text-lg md:text-4xl">Write New Emails</div>
                    <div className="text-slate-300 text-sm">Start with a fresh template.</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Side Options */}
            <div className="flex flex-col md:flex-row justify-center items-center md:gap-64 gap-6">
              {/* Edit Existing */}
              <button onClick={() => onSelect("edit-existing")} className="group w-48">
                <div className="aspect-square rounded-full bg-gray-100 hover:bg-gray-200 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-md shadow-gray-400/50">
                  <div className="text-center space-y-2 px-2">
                    <div className="text-3xl md:text-4xl">🧩</div>
                    <div className="font-semibold text-gray-800 text-base">Edit Template</div>
                    <div className="text-gray-600 text-xs">
                      Modify a history template for new emails.
                    </div>
                  </div>
                </div>
              </button>

              {/* Resend */}
              <button onClick={() => onSelect("resend")} className="group w-48">
                <div className="aspect-square rounded-full bg-gray-100 hover:bg-gray-200 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-md shadow-gray-400/50">
                  <div className="text-center space-y-2 px-2">
                    <div className="text-3xl md:text-4xl">🔁</div>
                    <div className="font-semibold text-gray-800 text-base">Resend Email</div>
                    <div className="text-gray-600 text-xs">
                      Use a history template for emails resending.
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
