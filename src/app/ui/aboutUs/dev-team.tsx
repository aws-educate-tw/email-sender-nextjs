import MemberCard from "@/app/ui/aboutUs/member-card";
import Timeline from "@/app/ui/aboutUs/time-line";

export default function DevTeam() {
  const milestones = [
    // 2024
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
          date: "2024/04",
          title: "Generated custom participation certificates for UAD",
          description: "Automated the creation and distribution of personalized certificates.",
        },
        {
          date: "2024/04/22",
          title: "Official establishment of Dev Team",
          description: "Formalized the team structure to focus on operational improvements.",
        },
        {
          date: "2024/04",
          title: "Delivered custom emails to 1,000+ participants",
          description:
            "Implemented bulk email delivery system for large-scale event communication.",
        },
      ],
    },
    // 2025
    {
      year: "2025",
      events: [
        {
          date: "2025/01",
          title: "Integrated SurveyCake Webhook for automated emails sending",
          description:
            "Enabled real-time email sending automatically upon submitting the form on Surveycake.",
        },
        {
          date: "2025/05",
          title: "Migrated from DynamoDB to Aurora Serverless database",
          description:
            "Transformed to Aurora Serverless to support filtering, keyword search, and pagination filtering.",
        },
        {
          date: "2025/07",
          title: "Achieved 9,300+ emails sent during 7th Ambassador Term",
          description:
            "Handled over 9,300 emails including 5,930 general emails, 1,070 certificates, and 2,300 triggered via webhook — with a single batch reaching up to 2,045 recipients.",
        },
      ],
    },
    // 2026
    {
      year: "2026",
      events: [
        {
          date: "2026/07",
          title: "Implemented DLQ handling flow",
          description:
            "Introduced dead-letter queue processing to improve failure recovery and operational stability.",
        },
        {
          date: "2026/08",
          title: "RSVP Service rollout",
          description:
            "Released RSVP workflow for attendance collection and confirmation handling.",
        },
      ],
    },
  ];

  const performanceHighlights = [
    {
      label: "Total Emails Sent",
      value: "8,326",
      note: "From 2025/10 to 2026/05",
    },
    {
      label: "General Emails",
      value: "8,120",
      note: "Standard campaign and notification emails",
    },
    {
      label: "Participation Certificates",
      value: "206",
      note: "Generated and delivered automatically",
    },
    {
      label: "Largest Single Batch",
      value: "2,139",
      note: "Maximum event email delivery in one run",
    },
  ];

  const productOwners = [
    {
      name: "Boyi",
      period: "2024-2025",
      email: "boyi.wang1223@gmail.com",
      avatar: "/avatar/boyi.jpg",
      labels: ["FOUNDER MEMBER"],
    },
    {
      name: "Queena",
      period: "2024-2025",
      email: "queena1211.chen@gmail.com",
      avatar: "/avatar/queena.jpg",
      labels: [],
    },
    {
      name: "Tiffany",
      period: "2025-present",
      email: "tiffany.zsed18@gmail.com",
      avatar: "/avatar/tiffany.jpg",
      labels: [],
    },
    {
      name: "Selina",
      period: "2026-present",
      email: "yishan2004931022@gmail.com",
      avatar: "/avatar/selina.jpg",
      labels: [],
    },
    {
      name: "Maggie",
      period: "2026-present",
      email: "maggie0302501@gmail.com",
      avatar: "/avatar/maggie.jpg",
      labels: [],
    },
  ];

  const fullStackDevs = [
    {
      name: "Harry",
      period: "2024-present",
      email: "harryup2000@gmail.com",
      avatar: "/avatar/harry.jpg",
      labels: ["MENTOR", "FOUNDER MEMBER"],
    },
    {
      name: "Kiki",
      period: "2025-present",
      email: "271yeye@gmail.com",
      avatar: "/avatar/kiki.jpg",
      labels: ["TECH-LEAD"],
    },
    {
      name: "Tony",
      period: "2024-present",
      email: "poyang1024@gmail.com",
      avatar: "/avatar/tony.jpg",
      labels: ["MENTOR"],
    },
    {
      name: "Claire",
      period: "2025",
      email: "abctintin0504@gmail.com",
      avatar: "/avatar/claire.jpg",
      labels: [],
    },
  ];

  const backendDevs = [
    {
      name: "Shiun",
      period: "2024-present",
      email: "a0923183408@gmail.com",
      avatar: "/avatar/shiun.jpg",
      labels: ["MENTOR", "FOUNDER MEMBER"],
    },
    {
      name: "Richie",
      period: "2024-2025",
      email: "rich.liu627@gmail.com",
      avatar: "/avatar/richie.jpg",
      labels: ["FOUNDER MEMBER"],
    },
    {
      name: "Vincent",
      period: "2026-present",
      email: "asd1111zxcv@gmail.com",
      avatar: "/avatar/vincent.jpg",
      labels: ["TECH-LEAD"],
    },
    {
      name: "Aaron",
      period: "2026-present",
      email: "aaronwayway@gmail.com",
      avatar: "/avatar/aaron.jpg",
      labels: [],
    },
    {
      name: "Ariel",
      period: "2026-present",
      email: "arielyu999@gmail.com",
      avatar: "/avatar/ariel.jpg",
      labels: [],
    },
  ];

  const frontendDevs = [
    {
      name: "Yuna",
      period: "2024",
      email: "tmfel91219pinyu@gmail.com",
      avatar: "/avatar/yuna.jpg",
      labels: ["FOUNDER MEMBER"],
    },
    {
      name: "Seren",
      period: "2026-present",
      email: "dxes100144@gmail.com",
      avatar: "/avatar/seren.jpg",
      labels: [],
    },
  ];

  const devOpsDevs = [
    {
      name: "Shiun",
      period: "2024-present",
      email: "a0923183408@gmail.com",
      avatar: "/avatar/shiun.jpg",
      labels: ["FOUNDER MEMBER"],
    },
    {
      name: "Cody",
      period: "2025",
      email: "cdxvy30@gmail.com",
      avatar: "/avatar/cody.jpg",
      labels: [],
    },
  ];

  const renderTeamSection = (title: string, members: typeof productOwners) => (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold text-sky-950 mb-6">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member, index) => (
          <MemberCard
            key={index}
            name={member.name}
            period={member.period}
            email={member.email}
            avatar={member.avatar}
            labels={member.labels}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section id="dev-team" className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dev Team</h2>

      {/* Our Journey */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-sky-950 mb-6">Dev Team 2026 Journey</h3>
        <Timeline milestones={milestones} />
      </div>

      <div className="mb-12">
        <h3 className="text-2xl font-bold text-sky-950 mb-6">Impact Snapshot</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {performanceHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-sky-100 bg-sky-50/60 p-5 shadow-sm"
            >
              <p className="text-sm font-medium uppercase tracking-wide text-sky-900/70">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-sky-950">{item.value}</p>
              <p className="mt-2 text-sm text-gray-600">{item.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Between 2025/10 and 2026/05, the team sent 8,326 emails in total, including
          8,120 general emails and 206 participation certificates, with the largest
          single campaign reaching 2,139 recipients.
        </p>
      </div>

      {/* Team Members */}
      <div>
        <h3 className="text-2xl font-bold text-sky-950 mb-8">Team Members</h3>
        {renderTeamSection("Product Owner", productOwners)}
        {renderTeamSection("Full-Stack", fullStackDevs)}
        {renderTeamSection("Backend", backendDevs)}
        {renderTeamSection("Frontend", frontendDevs)}
        {renderTeamSection("DevOps", devOpsDevs)}
      </div>
    </section>
  );
}
