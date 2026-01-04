type OnboardingResponse = {
  name: string;
  introduction: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "";
const onboardingApiUrl = `${apiBaseUrl.replace(/\/$/, "")}/onboarding/vincent`;

async function fetchOnboarding(): Promise<OnboardingResponse> {
  const response = await fetch(onboardingApiUrl);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default async function Page() {
  let onboardingData: OnboardingResponse | null = null;
  let errorMessage: string | null = null;

  try {
    onboardingData = await fetchOnboarding();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error.";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 md:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="rounded-3xl bg-white p-8 shadow-md">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
            Frontend Onboarding
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
            {onboardingData?.name ?? "Newbie Intro"}
          </h1>
        </header>

        <section className="rounded-3xl bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 p-8 text-white shadow-lg">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          {errorMessage ? (
            <p className="mt-4 text-sm text-red-200">
              Failed to load onboarding data: {errorMessage}
            </p>
          ) : (
            <p className="mt-4 text-lg leading-relaxed text-slate-100">
              {onboardingData?.introduction ?? "Loading introduction..."}
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
          <p className="text-sm font-medium text-slate-500">API Endpoint</p>
          <p className="mt-2 break-words text-sm font-semibold text-slate-800">
            {onboardingApiUrl}
          </p>
        </section>
      </div>
    </main>
  );
}
