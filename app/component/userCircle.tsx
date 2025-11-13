import { ProfileColor, COLOR_GRADIENTS } from "@/lib/constants/colors";

type UserCircleProps = {
  userId: string;
  name: string;
  profileColor: ProfileColor;
  isCentered: boolean;
};

export default function UserCircle({
  userId,
  name,
  profileColor,
  isCentered,
}: UserCircleProps) {
  const gradientClass = COLOR_GRADIENTS[profileColor];

  return (
    <div
      data-user-id={userId}
      className="flex flex-col items-center gap-3 min-w-[100px] scroll-snap-align-center transition-all duration-300 ease-in-out"
      style={{ scrollSnapAlign: "center" }}
    >
      {/* Colored Circle */}
      <div
        className={`w-20 h-20 rounded-full ${gradientClass} transition-all duration-300 ease-in-out ${
          isCentered
            ? "scale-110 shadow-lg ring-4 ring-white ring-opacity-50"
            : "scale-100"
        }`}
      />

      {/* User Name */}
      <p
        className={`text-center font-bold text-sm transition-all duration-300 ${
          isCentered
            ? "text-gray-900 scale-105"
            : "text-gray-600 scale-100"
        }`}
      >
        {name}
      </p>
    </div>
  );
}
