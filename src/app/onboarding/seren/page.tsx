import QuizClient from "./QuizClient";

type OnboardingResponse = {
  name: string;
  introduction: string;
};

async function fetchOnboarding(): Promise<OnboardingResponse> {
  const base_url = process.env.NEXT_PUBLIC_API_ENDPOINT || "https://api.tpet.aws-educate.tw/dev";

  try {
    const response = await fetch(`${base_url}/onboarding/seren`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch onboarding data:", error);
    // Return default data if API fails
    return {
      name: "Seren",
      introduction: "Hello! I'm Seren! Nice to meet you all!",
    };
  }
}

export default async function Page() {
  const onboardingData = await fetchOnboarding();

  return <QuizClient initialData={onboardingData} />;
}
