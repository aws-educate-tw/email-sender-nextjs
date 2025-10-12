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
      labels: [],
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
  ];

  const frontendDevs = [
    {
      name: "Yuna",
      period: "2024",
      email: "tmfel91219pinyu@gmail.com",
      avatar: "/avatar/yuna.jpg",
      labels: ["FOUNDER MEMBER"],
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
        <h3 className="text-2xl font-bold text-sky-950 mb-6">Our Journey</h3>
        <Timeline milestones={milestones} />
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
