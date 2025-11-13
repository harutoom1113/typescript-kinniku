"use client";

import { useEffect, useState } from "react";
import { getUserTrainingSessions } from "@/lib/firestore/user-train";
import {
  INTENSITY_GRADIENTS,
  getIntensityFromMinutes,
} from "@/lib/constants/trainingIntensity";

type TrainingHeatmapProps = {
  userId: string;
};

type DayCell = {
  date: Date;
  dateKey: string;
  minutes: number;
  isCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function TrainingHeatmap({ userId }: TrainingHeatmapProps) {
  const [dailyTraining, setDailyTraining] = useState<Map<string, number>>(
    new Map()
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrainingData = async () => {
      try {
        const sessions = await getUserTrainingSessions(userId);

        // 日ごとのトレーニング合計を計算
        const dailyMap = new Map<string, number>();

        sessions.forEach((session) => {
          if (session.startTrain && session.finishTrain) {
            const startDate = new Date(session.startTrain);
            const finishDate = new Date(session.finishTrain);
            const dateKey = startDate.toISOString().split("T")[0]; // YYYY-MM-DD

            // 分単位で時間を計算
            const durationMs = finishDate.getTime() - startDate.getTime();
            const durationMinutes = Math.round(durationMs / (1000 * 60));

            // 日ごとの合計に追加
            const currentTotal = dailyMap.get(dateKey) || 0;
            dailyMap.set(dateKey, currentTotal + durationMinutes);
          }
        });

        setDailyTraining(dailyMap);
      } catch (error) {
        console.error("Failed to load training data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadTrainingData();
    }
  }, [userId]);

  // 月のカレンダーグリッドを生成
  const generateMonthGrid = (): DayCell[][] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 最初の日の曜日（0=日曜日）
    const firstDayOfWeek = firstDay.getDay();

    // カレンダーグリッドのセルを作成
    const cells: DayCell[] = [];

    // 前月の日付を埋める
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dateKey = date.toISOString().split("T")[0];
      cells.push({
        date,
        dateKey,
        minutes: dailyTraining.get(dateKey) || 0,
        isCurrentMonth: false,
      });
    }

    // 今月の日付を追加
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split("T")[0];
      cells.push({
        date,
        dateKey,
        minutes: dailyTraining.get(dateKey) || 0,
        isCurrentMonth: true,
      });
    }

    // 次月の日付を埋める（グリッドを完成させるため）
    const remainingCells = 42 - cells.length; // 6週間 × 7日 = 42セル
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      const dateKey = date.toISOString().split("T")[0];
      cells.push({
        date,
        dateKey,
        minutes: dailyTraining.get(dateKey) || 0,
        isCurrentMonth: false,
      });
    }

    // 週ごとに分割（7日ごと）
    const weeks: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return weeks;
  };

  const weeks = generateMonthGrid();

  // 前の月へ移動
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // 次の月へ移動
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <p className="text-gray-500 text-sm">Loading training history...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-100 rounded-lg">
      {/* 月の切り替え */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-3 py-1 text-sm font-bold hover:bg-gray-200 rounded"
        >
          ←
        </button>
        <h3 className="font-bold text-base">
          {currentMonth.getFullYear()}/{MONTH_LABELS[currentMonth.getMonth()]}
        </h3>
        <button
          onClick={goToNextMonth}
          className="px-3 py-1 text-sm font-bold hover:bg-gray-200 rounded"
        >
          →
        </button>
      </div>

      {/* 曜日ラベル */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-gray-600"
          >
            {label}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((cell, dayIndex) => {
              const intensity = getIntensityFromMinutes(cell.minutes);
              const gradientClass = INTENSITY_GRADIENTS[intensity];

              return (
                <div
                  key={dayIndex}
                  className={`aspect-square rounded border border-gray-200 flex items-center justify-center text-xs ${gradientClass} ${
                    cell.isCurrentMonth
                      ? "text-gray-800"
                      : "text-gray-400 opacity-50"
                  }`}
                  title={`${cell.dateKey}: ${cell.minutes} minutes`}
                >
                  {cell.date.getDate()}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 20, 60, 100, 130].map((minutes, index) => {
            const intensity = getIntensityFromMinutes(minutes);
            const gradientClass = INTENSITY_GRADIENTS[intensity];
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded border border-gray-200 ${gradientClass}`}
              />
            );
          })}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
