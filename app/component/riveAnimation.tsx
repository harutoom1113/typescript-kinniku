"use client";
import { useRive } from "@rive-app/react-canvas";

export default function RiveAnimation() {
  const { RiveComponent } = useRive({
    src: "/animation.riv", // ①で置いたファイル
    autoplay: true, // 自動再生するか
  });

  return (
    <div className="w-200 h-200">
      <RiveComponent /> {/* ここにアニメーションが描画される */}
    </div>
  );
}
