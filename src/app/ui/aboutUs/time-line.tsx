import { Calendar } from "lucide-react";

export default function Timeline() {
  const milestones = [
    {
      date: "2024/03",
      title: "Built DC infrastructure and batch invite systems",
      description:
        "Developed foundational systems to manage Discord server operations efficiently.",
    },
    {
      date: "2024/04/08",
      title: "Generated custom participation certificates for UAD",
      description: "Automated the creation and distribution of personalized certificates.",
    },
    {
      date: "2024/04/22",
      title: "Official establishment of Dev Team",
      description: "Formalized the team structure to focus on operational improvements.",
    },
    {
      date: "2024/04 Mid",
      title: "Delivered custom emails to 1,000+ participants",
      description: "Implemented bulk email delivery system for large-scale event communication.",
    },
  ];

  return (
    <section id="dev-team-timeline" className="px-6">
      <ol className="relative border-l border-gray-200 dark:border-gray-700 ">
        {milestones.map((milestone, index) => (
          <li key={index} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-neutral-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
              <Calendar />
            </span>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {milestone.title}
            </h3>
            <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {milestone.date}
            </time>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              {milestone.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
