"use client";

import {
  ProfileColor,
  COLOR_GRADIENTS,
  DEFAULT_PROFILE_COLOR,
} from "@/lib/constants/colors";

type NamePlateProps = {
  name: string;
  place: string;
  color?: ProfileColor;
  isEditing?: boolean;
  onEditClick?: () => void;
  onColorSelect?: (color: ProfileColor) => void;
  onSaveClick?: () => void;
};

export default function NamePlateImage({
  name,
  place,
  color = DEFAULT_PROFILE_COLOR,
  isEditing = false,
  onEditClick,
  onColorSelect,
  onSaveClick,
}: NamePlateProps) {
  const gradientClass = COLOR_GRADIENTS[color];

  return (
    <div className="w-auto flex flex-col items-center">
      {/* 円とアイコンの配置 */}
      <div className="relative">
        <div className={`rounded-full h-60 w-60 ${gradientClass}`}></div>

        {/* 鉛筆/チェックマークアイコン */}
        <button
          onClick={isEditing ? onSaveClick : onEditClick}
          className="absolute right-0 bottom-0 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          aria-label={isEditing ? "色を保存" : "色を編集"}
        >
          {isEditing ? (
            // チェックマークアイコン
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          ) : (
            // 鉛筆アイコン
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          )}
        </button>
      </div>

      {/* カラーピッカー */}
      {isEditing && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">
            select color
          </p>
          <div className="grid grid-cols-5 gap-3">
            {Object.values(ProfileColor).map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => onColorSelect?.(colorOption)}
                className={`relative flex items-center justify-center p-2 rounded-lg transition-all ${
                  color === colorOption
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:bg-gray-100"
                }`}
              >
                <div
                  className={`rounded-full h-12 w-12 ${COLOR_GRADIENTS[colorOption]}`}
                ></div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-4xl text-black mt-10 ">{name}</div>
      <div className="text-2xl my-4">{place}</div>
    </div>
  );
}
