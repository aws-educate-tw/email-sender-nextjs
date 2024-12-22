import Image from "next/image";

interface MemberCardProps {
  name: string;
  role: string;
  email: string;
  note?: string;
  avatar?: string;
  isNew?: boolean; // New property to identify new members
}

export default function MemberCard({
  name,
  role,
  email,
  note,
  avatar = "/avatar/hachi.jpg",
  isNew = false, // Default to false
}: MemberCardProps) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg ">
      <Image
        src={avatar} // Use a default or provided avatar
        alt={`${name}'s avatar`}
        width={200}
        height={200}
        className="rounded-full mb-4 border-4 border-sky-950 shadow-lg"
      />
      <p className="text-2xl font-bold text-gray-800 text-center">{name}</p>
      <p className="text-sm text-blue-600 text-center">{role}</p>
      <p className="text-sm text-gray-600 text-center">
        <a href={`mailto:${email}`} className="hover:underline">
          {email}
        </a>
      </p>
      {note && <p className="text-xs text-gray-500 text-center mt-1">{note}</p>}
      {isNew && (
        <span className="mt-2 px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
          New Member
        </span>
      )}
    </div>
  );
}
