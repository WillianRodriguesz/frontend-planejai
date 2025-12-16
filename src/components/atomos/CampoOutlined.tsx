import { type ReactNode } from "react";

interface CampoOutlinedProps {
  label: string;
  children: ReactNode;
  size?: "sm" | "md";
}

const CampoOutlined = ({
  label,
  children,
  size = "md",
}: CampoOutlinedProps) => {
  const sizeClasses = {
    sm: {
      container: "p-3",
      label: "text-sm",
      span: "-top-2.5 left-3 px-2",
      children: "text-base",
    },
    md: {
      container: "p-4",
      label: "text-base",
      span: "-top-2.5 left-3 px-2",
      children: "text-lg",
    },
  };

  return (
    <div className="relative">
      <div
        className={`relative border-2 border-purple-500/30 rounded-xl bg-card/50 ${sizeClasses[size].container} overflow-visible`}
      >
        <span
          className={`absolute bg-card ${sizeClasses[size].label} font-medium text-gray-300 ${sizeClasses[size].span}`}
        >
          {label}
        </span>
        <div className={`text-gray-400 ${sizeClasses[size].children}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CampoOutlined;
