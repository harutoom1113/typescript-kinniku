"use client";
import { useRive } from "@rive-app/react-canvas";
import { useEffect } from "react";

type RiveAnimationProps = {
  isPlaying?: boolean;
};

export default function RiveAnimation({
  isPlaying = false,
}: RiveAnimationProps) {
  const { RiveComponent, rive } = useRive({
    src: "/animation.riv",
    autoplay: false, // 手動制御に変更
  });

  // isPlayingの変更に応じてアニメーションを制御
  useEffect(() => {
    if (!rive) return;

    if (isPlaying) {
      rive.play();
    } else {
      rive.pause();
    }
  }, [isPlaying, rive]);

  return (
    <div className="w-200 h-200">
      <RiveComponent />
    </div>
  );
}
