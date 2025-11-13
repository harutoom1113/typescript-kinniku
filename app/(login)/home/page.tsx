"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/auth/user-context";
import { getFollowingList } from "@/lib/firestore/following";
import { getUserData, UserData } from "@/lib/firestore/user-data";
import { ProfileColor, DEFAULT_PROFILE_COLOR } from "@/lib/constants/colors";
import UserCarousel from "@/app/component/userCarousel";
import TrainingHeatmap from "@/app/component/trainingHeatmap";

type UserWithData = {
  userId: string;
  name: string;
  place: string;
  profileColor: ProfileColor;
};

export default function Home() {
  const { user } = useUser();
  const [followingUsers, setFollowingUsers] = useState<UserWithData[]>([]);
  const [centeredUserId, setCenteredUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フォロー中のユーザーデータを取得
  useEffect(() => {
    const fetchFollowingUsers = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // 1. フォロー中のユーザーIDリストを取得
        const followingIds = await getFollowingList(user.uid);

        // 2. 全ユーザーのデータを並列取得
        const userDataPromises = followingIds.map((id) => getUserData(id));
        const usersData = await Promise.all(userDataPromises);

        // 3. nullを除外してUserWithData型にマッピング
        const validUsers: UserWithData[] = usersData
          .filter((userData): userData is UserData => userData !== null)
          .map((userData) => ({
            userId: userData.userId,
            name: userData.name || "Unknown",
            place: userData.place || "Unknown",
            profileColor: userData.profileColor || DEFAULT_PROFILE_COLOR,
          }));

        setFollowingUsers(validUsers);

        // 4. 最初のユーザーを中央に設定
        if (validUsers.length > 0) {
          setCenteredUserId(validUsers[0].userId);
        }
      } catch (err) {
        console.error("Failed to fetch following users:", err);
        setError("フォロー中のユーザーの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowingUsers();
  }, [user]);

  // ローディング状態
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // フォローユーザーが0人の場合
  if (followingUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <p className="text-gray-600 text-center">
          You&apos;re not following anyone yet
        </p>
        <a
          href="/search"
          className="px-6 py-3 bg-black text-white rounded-md font-bold"
        >
          Find Users
        </a>
      </div>
    );
  }

  const centeredUser = followingUsers.find((u) => u.userId === centeredUserId);

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* カルーセルセクション */}
      <div className="py-8 border-b border-gray-200">
        <UserCarousel users={followingUsers} onCenterChange={setCenteredUserId} />
      </div>

      {/* ヒートマップセクション */}
      {centeredUser && (
        <div
          key={centeredUser.userId}
          className="w-full max-w-3xl mx-auto px-4 mt-8 animate-fadeIn"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {centeredUser.name}&apos;s Training
          </h2>
          <TrainingHeatmap userId={centeredUser.userId} />
        </div>
      )}
    </div>
  );
}
