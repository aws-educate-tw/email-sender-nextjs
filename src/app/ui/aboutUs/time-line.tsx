import { Calendar } from "lucide-react";

interface TimelineProps {
  milestones?: Array<{
    year: string;
    events: Array<{
      date: string;
      title: string;
      description: string;
    }>;
  }>;
}

export default function Timeline({ milestones }: TimelineProps) {
  // Default milestones for backward compatibility
  const defaultMilestones = [
    {
      year: "2024",
      events: [
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
          description:
            "Implemented bulk email delivery system for large-scale event communication.",
        },
      ],
    },
  ];

  const timelineData = milestones || defaultMilestones;

  return (
    <section id="dev-team-timeline" className="px-6">
      <div className="space-y-12">
        {timelineData.map((yearGroup, yearIndex) => (
          <div key={yearIndex}>
            <h4 className="text-xl font-bold text-gray-700 mb-4">{yearGroup.year}</h4>
            <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-4">
              {yearGroup.events.map((event, eventIndex) => (
                <li key={eventIndex} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-neutral-100 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <h5 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h5>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    {event.date}
                  </time>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {event.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
