type OnboardingResponse = {
  name: string;
  introduction: string;
  onboarding_path: string;
};

const API_BASE_URL = "https://8so9m9wv6i.execute-api.us-west-2.amazonaws.com/local-dev/onboarding";

async function fetchOnboarding(name: string): Promise<OnboardingResponse> {
  const response = await fetch(`${API_BASE_URL}/${name}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default async function Page({
  params,
}: {
  params: { newbie_name?: string; name?: string };
}) {
  const resolvedName = params.newbie_name || params.name || "ariel";

  let onboardingData: OnboardingResponse | null = null;
  let errorMessage: string | null = null;

  try {
    onboardingData = await fetchOnboarding(resolvedName);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error.";
  }

  const displayName =
    onboardingData?.name && onboardingData.name !== "undefined"
      ? onboardingData.name
      : resolvedName;

  const displayIntro = onboardingData?.introduction || "Reading...";

  return (
    <main className="min-h-screen bg-[#FFF5F7] px-6 py-12 md:px-12 font-sans">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 animate-in fade-in zoom-in duration-700">
        {/* Header */}
        <header className="rounded-[2.5rem] bg-white p-10 shadow-[0_10px_30px_rgba(255,182,193,0.3)] border-b-4 border-pink-100 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-pink-50" />

          <div className="relative z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-500 text-xs font-bold tracking-widest mb-4">
              ✨ NEWBIE NAME ✨
            </span>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight capitalize">
              {displayName}
              <span className="text-pink-400 ml-2">🌸</span>
            </h1>
          </div>
        </header>

        {/* About Me */}
        <section className="rounded-[3rem] bg-gradient-to-br from-pink-200 via-rose-300 to-pink-400 p-10 text-white shadow-[0_15px_35px_rgba(244,114,182,0.4)] relative">
          <div className="absolute top-6 left-10 text-4xl opacity-30">🎀</div>

          <div className="mt-8">
            <h2 className="text-2xl font-black mb-6 text-white/90">About Me</h2>

            {errorMessage ? (
              <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm border border-white/30 text-rose-900 font-medium">
                oops! Wrong：{errorMessage}
              </div>
            ) : (
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm border border-white/20">
                <p className="text-xl leading-relaxed font-medium drop-shadow-sm">
                  "{displayIntro}"
                </p>
              </div>
            )}
          </div>

          <div className="absolute bottom-6 right-10 text-4xl opacity-40 animate-bounce">✨</div>
        </section>

        {/* Debug Info */}
        <section className="rounded-3xl border-2 border-dashed border-pink-200 bg-white/50 p-6 text-pink-700">
          <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider opacity-60 text-xs">
            <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse"></span>
            Debug Info: API Request
          </div>
          <div className="break-all font-mono text-xs bg-pink-50/50 p-3 rounded-xl border border-pink-100 text-slate-500">
            Endpoint: {API_BASE_URL}/{resolvedName}
          </div>
        </section>

        <footer className="text-center text-pink-300 text-xs font-medium tracking-widest">
          MADE BY ARIEL | TPET ONBOARDING 2026
        </footer>
      </div>
    </main>
  );
}
