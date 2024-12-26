import MemberCard from "@/app/ui/aboutUs/member-card";
import Timeline from "@/app/ui/aboutUs/time-line";

export default function DevTeam() {
  const members = [
    {
      name: "Boyi",
      role: "PO",
      email: "boyi.wang1223@gmail.com",
      note: "創始成員",
      avatar: "/avatar/boyi.jpg",
    },
    {
      name: "Queena",
      role: "PO",
      email: "queena1211.chen@gmail.com",
      avatar: "/avatar/queena.jpg",
      isNew: true,
    },
    {
      name: "Harry",
      role: "Tech Lead / Full-Stack",
      email: "harryup2000@gmail.com",
      note: "創始成員",
      avatar: "/avatar/harry.jpg",
    },
    {
      name: "Tony",
      role: "Full-Stack",
      email: "poyang1024@gmail.com",
      avatar: "/avatar/tony.jpg",
      isNew: true,
    },
    {
      name: "Richie",
      role: "Backend",
      email: "rich.liu627@gmail.com",
      note: "創始成員",
      avatar: "/avatar/richie.jpg",
    },
    {
      name: "Shiun",
      role: "Backend / DevOps",
      email: "a0923183408@gmail.com",
      note: "創始成員",
      avatar: "/avatar/shiun.jpg",
    },
    {
      name: "Yuna",
      role: "Frontend",
      email: "tmfel91219pinyu@gmail.com",
      note: "創始成員",
      // avatar: "/avatar/yuna.jpg",
    },
  ];

  const existingMembers = members.filter(member => !member.isNew);
  const newMembers = members.filter(member => member.isNew);

  return (
    <section id="dev-team" className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dev Team</h2>
      {/* Our Journey */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Journey</h3>
        <Timeline />
      </div>

      {/* Existing Members */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-sky-950 mb-4">Old Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {existingMembers.map((member, index) => (
            <MemberCard
              key={index}
              name={member.name}
              role={member.role}
              email={member.email}
              note={member.note}
              avatar={member.avatar}
            />
          ))}
        </div>
      </div>

      {/* New Members */}
      <div>
        <h3 className="text-2xl font-semibold text-amber-400 mb-4">New Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {newMembers.map((member, index) => (
            <MemberCard
              key={index}
              name={member.name}
              role={member.role}
              email={member.email}
              note={member.note}
              avatar={member.avatar}
              isNew={member.isNew}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
