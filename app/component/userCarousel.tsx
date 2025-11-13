"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import UserCircle from "./userCircle";
import { ProfileColor } from "@/lib/constants/colors";

type UserData = {
  userId: string;
  name: string;
  profileColor: ProfileColor;
};

type UserCarouselProps = {
  users: UserData[];
  onCenterChange: (userId: string) => void;
};

export default function UserCarousel({
  users,
  onCenterChange,
}: UserCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [centeredUserId, setCenteredUserId] = useState<string | null>(
    users[0]?.userId || null
  );

  // 中央のユーザーを検出
  const detectCenteredUser = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    const circles = container.querySelectorAll("[data-user-id]");
    let closestUserId: string | null = null;
    let minDistance = Infinity;

    circles.forEach((circle) => {
      const rect = circle.getBoundingClientRect();
      const circleCenter = rect.left + rect.width / 2;
      const distance = Math.abs(circleCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestUserId = circle.getAttribute("data-user-id");
      }
    });

    if (closestUserId && closestUserId !== centeredUserId) {
      setCenteredUserId(closestUserId);
      onCenterChange(closestUserId);
    }
  }, [centeredUserId, onCenterChange]);

  // スクロールイベントハンドラ（デバウンス）
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(detectCenteredUser, 50);
    };

    container.addEventListener("scroll", handleScroll);
    // 初期検出
    detectCenteredUser();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [detectCenteredUser]);

  if (users.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          className="flex gap-8 py-4"
          style={{
            paddingLeft: "calc(50vw - 50px)",
            paddingRight: "calc(50vw - 50px)",
          }}
        >
          {users.map((user) => (
            <UserCircle
              key={user.userId}
              userId={user.userId}
              name={user.name}
              profileColor={user.profileColor}
              isCentered={centeredUserId === user.userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
