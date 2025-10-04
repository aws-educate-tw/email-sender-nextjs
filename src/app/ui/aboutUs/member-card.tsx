import Image from "next/image";
import { useState } from "react";

interface MemberCardProps {
  name: string;
  email: string;
  avatar?: string;
  period?: string;
  labels?: string[];
}

export default function MemberCard({
  name,
  email,
  avatar = "/aws-educate-avatar.png",
  period,
  labels = [],
}: MemberCardProps) {
  const [imgSrc, setImgSrc] = useState(avatar);

  return (
    <div className="flex flex-col items-center p-4 rounded-lg">
      {/* Labels - Fixed height container to keep avatars aligned */}
      <div className="h-14 flex flex-col gap-2 mb-2 justify-end items-center">
        {labels.map((label, index) => (
          <span
            key={index}
            className={`text-sm font-bold ${
              label === "FOUNDER MEMBER" ? "text-amber-500 animate-bounce" : "text-blue-700"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Avatar */}
      <Image
        src={imgSrc} // when error, use default avatar
        alt={`${name}'s avatar`}
        width={150}
        height={150}
        className={`rounded-full mb-3 border-4 border-sky-950 shadow-lg`}
        onError={() => setImgSrc("/aws-educate-avatar.png")}
      />

      {/* Name */}
      <p className="text-2xl font-bold text-gray-800 text-center">{name}</p>

      {/* Period */}
      {period && <p className="text-sm text-gray-600 text-center mb-2">{period}</p>}

      {/* Email */}
      {email && (
        <p className="text-sm text-gray-600 text-center">
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        </p>
      )}
    </div>
  );
}
