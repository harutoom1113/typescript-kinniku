// app/components/CalendarTileJP.tsx
"use client";
import { useEffect, useState } from "react";

export default function CalendarTileJP() {
  const [now, setNow] = useState(new Date());

  // ---- 日付を自動更新（最小限の負荷：深夜に1回だけ更新）----
  useEffect(() => {
    // 次の「今日の終わり」（ローカル）まで
    const scheduleNextTick = () => {
      const n = new Date();
      const tomorrow = new Date(n);
      tomorrow.setDate(n.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const ms = tomorrow.getTime() - n.getTime();
      const t = setTimeout(() => {
        setNow(new Date());
        scheduleNextTick();
      }, ms + 500); // わずかに余裕
      return t;
    };
    const timer = scheduleNextTick();
    return () => clearTimeout(timer);
  }, []);

  // ---- 表示は常に日本時間（端末タイムゾーンに依存しない）----
  const fmt = (opt: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", ...opt });

  const weekday = fmt({ weekday: "short" }).format(now); // 例: "月"
  const month = fmt({ month: "short" }).format(now); // 例: "6月"
  const day = fmt({ day: "numeric" }).format(now); // 例: "1"

  return (
    <div className="inline-flex flex-col items-center select-none">
      {/* ダークグレーの本体 */}
      <div className="bg-neutral-800 text-white w-60 h-60 flex flex-col items-center justify-center rounded-2xl">
        <div className="text-2xl font-semibold leading-none mb-2">
          {weekday} {month}
        </div>
        <div className="text-[64px] font-extrabold leading-none">{day}</div>
      </div>
    </div>
  );
}
