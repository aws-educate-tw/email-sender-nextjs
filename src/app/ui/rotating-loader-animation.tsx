import { CSSProperties } from "react";

interface RotatingLoaderProps {
  size?: number;
  color?: string;
  thickness?: number;
  text?: string;
  className?: string;
}

export default function RotatingLoaderAnimation({
  size = 24,
  color = "#1a56db",
  thickness = 3,
  text,
  className = "",
}: RotatingLoaderProps) {
  const spinnerStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${thickness}px`,
    borderColor: `rgba(156, 163, 175, 0.2)`,
    borderTopColor: color,
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full border-solid" style={spinnerStyle} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
}
