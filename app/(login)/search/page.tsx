"use client";

import { useState } from "react";
import NamePlateImage from "@/app/component/nameplateImage";
import TrainingHeatmap from "@/app/component/trainingHeatmap";
import Button, { ButtonText } from "@/app/component/button";
import { getUserData } from "@/lib/firestore/user-data";
import { UserData } from "@/lib/firestore/user-data";
import { DEFAULT_PROFILE_COLOR } from "@/lib/constants/colors";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUser, setSearchedUser] = useState<UserData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // 検索実行
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setSearchedUser(null);

    try {
      const userData = await getUserData(searchQuery.trim());

      if (userData) {
        setSearchedUser(userData);
        setNotFound(false);
      } else {
        setSearchedUser(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  // Enterキーで検索実行
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white pt-8 pb-20">
      {/* 検索バー */}
      <div className="w-full max-w-md px-4 mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by User ID"
            className="w-full h-14 px-6 rounded-full border-2 border-transparent bg-linear-to-bl from-[#FF00D6]/30 to-[#FF4D00]/30 text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#FF00D6]/50 text-sm"
          />
          <button
            onClick={handleSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="#49454F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 検索中 */}
      {isSearching && (
        <div className="text-gray-500 text-sm mt-8">Searching...</div>
      )}

      {/* ユーザーが見つからない */}
      {notFound && !isSearching && (
        <div className="text-gray-500 text-sm mt-8">User not found</div>
      )}

      {/* 検索結果 */}
      {searchedUser && !isSearching && (
        <div className="flex flex-col items-center w-full max-w-2xl px-4">
          {/* NamePlateImage */}
          <div className="mb-6">
            <NamePlateImage
              name={searchedUser.name || "Unknown"}
              place={searchedUser.place || "Unknown"}
              color={searchedUser.profileColor || DEFAULT_PROFILE_COLOR}
              isEditing={false}
            />
          </div>

          {/* Followボタン（非機能） */}
          <div className="mb-4">
            <Button text={ButtonText.FOLLOW} />
          </div>

          {/* TrainingHeatmap */}
          <div className="w-full">
            <TrainingHeatmap userId={searchedUser.userId} />
          </div>
        </div>
      )}
    </div>
  );
}
