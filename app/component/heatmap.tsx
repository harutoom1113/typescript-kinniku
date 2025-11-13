import React, { useMemo } from "react";

/**
 * GitHub風のコントリビューション・ヒートマップ（1年/任意期間）
 * - 最小依存（Tailwind不要）
 * - グラデーションタイル（from/toを強度で補間）
 * - アクセシブル（aria/tooltip）
 * - クリック/ホバー対応
 *
 * 使用例はこのファイル末尾の Demo を参照
 */

export type HeatmapValue = {
  /** ISO8601 "YYYY-MM-DD" */
  date: string;
  /** コミット数など強度。0以上 */
  count: number;
};

export type ContribHeatmapProps = {
  /** データ（同日重複は最後が優先） */
  values: HeatmapValue[];
  /** 期間の開始/終了（日付はローカル）*/
  startDate: Date;
  endDate: Date;
  /** マスのサイズ(px) */
  size?: number;
  /** マスの角丸(px) */
  radius?: number;
  /** マス間のギャップ(px) */
  gap?: number;
  /** 背景のベース色 */
  baseColor?: string; // 例: "#F1F5F9" (light gray)
  /** 強度0以外のグラデ開始/終了色 */
  gradFrom?: string; // 例: "#FF00D6"
  gradTo?: string; // 例: "#FF4D00"
  /** 最大値（未指定なら values の最大count）*/
  max?: number;
  /** 曜日の先頭（0=Sun ～ 6=Sat、GitHub風はSun）*/
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** ホバー時のTooltip。戻り値は表示用文字列 */
  tooltip?: (v: { date: Date; count: number }) => string;
  /** クリック時 */
  onCellClick?: (v: { date: Date; count: number }) => void;
  /** セルへ追加スタイル（強度に応じた枠線など） */
  cellStyle?: (v: {
    date: Date;
    count: number;
    intensity: number;
  }) => React.CSSProperties | undefined;
  /** セルへ追加クラス名 */
  cellClassName?: (v: {
    date: Date;
    count: number;
    intensity: number;
  }) => string | undefined;
  /** グリッド上部に曜日ヘッダ（Sun..Sat）を表示 */
  showWeekdayHeader?: boolean;
  /** 曜日テキスト（デフォルトは英語短縮）*/
  weekdayLabels?: string[]; // length 7
  /** アクセシビリティ用：ラベルのロケール */
  locale?: string;
};

// ==== ユーティリティ ====
const ISO = (d: Date) => d.toISOString().slice(0, 10);

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function* eachDay(from: Date, to: Date) {
  const d = new Date(from);
  while (d <= to) {
    yield new Date(d);
    d.setDate(d.getDate() + 1);
  }
}

function startOfWeek(d: Date, weekStart: number) {
  const date = new Date(d);
  const day = (date.getDay() - weekStart + 7) % 7; // 0..6
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfWeek(d: Date, weekStart: number) {
  const s = startOfWeek(d, weekStart);
  s.setDate(s.getDate() + 6);
  return s;
}

function startOfGrid(from: Date, weekStart: number) {
  return startOfWeek(from, weekStart);
}

function endOfGrid(to: Date, weekStart: number) {
  return endOfWeek(to, weekStart);
}

// 色補間（簡易）: 16進→RGB → 線形補間 → 16進
function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  const bigint = parseInt(
    n.length === 3
      ? n
          .split("")
          .map((c) => c + c)
          .join("")
      : n,
    16
  );
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const to = (x: number) => x.toString(16).padStart(2, "0");
  return `#${to(Math.round(r))}${to(Math.round(g))}${to(Math.round(b))}`;
}
function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex({
    r: A.r + (B.r - A.r) * t,
    g: A.g + (B.g - A.g) * t,
    b: A.b + (B.b - A.b) * t,
  });
}

// ==== コンポーネント本体 ====
export function ContribHeatmap({
  values,
  startDate,
  endDate,
  size = 18,
  radius = 6,
  gap = 4,
  baseColor = "#F1F5F9",
  gradFrom = "#FF00D6",
  gradTo = "#FF4D00",
  max,
  weekStart = 0,
  tooltip,
  onCellClick,
  cellStyle,
  cellClassName,
  showWeekdayHeader = true,
  weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  locale = "ja-JP",
}: ContribHeatmapProps) {
  const map = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of values) m.set(v.date, v.count);
    return m;
  }, [values]);

  const maxValue = useMemo(() => {
    if (typeof max === "number") return max;
    let mx = 0;
    for (const v of values) if (v.count > mx) mx = v.count;
    return mx || 1;
  }, [values, max]);

  const gridStart = useMemo(
    () => startOfGrid(startDate, weekStart),
    [startDate, weekStart]
  );
  const gridEnd = useMemo(
    () => endOfGrid(endDate, weekStart),
    [endDate, weekStart]
  );

  // 週（列） × 曜日（行）の2次元配列へ
  const weeks: { date: Date; count: number; intensity: number }[][] =
    useMemo(() => {
      const cols: { date: Date; count: number; intensity: number }[][] = [];
      let col: { date: Date; count: number; intensity: number }[] = [];

      for (const day of eachDay(gridStart, gridEnd)) {
        if (col.length === 0 && day.getDay() !== weekStart) {
          // 先頭週の空白（前詰め）
          const pad = (day.getDay() - weekStart + 7) % 7;
          for (let i = 0; i < pad; i++)
            col.push({ date: new Date(NaN), count: 0, intensity: 0 });
        }
        const key = ISO(day);
        const count = map.get(key) ?? 0;
        const intensity = clamp(count / maxValue);
        col.push({ date: day, count, intensity });

        if (col.length === 7) {
          cols.push(col);
          col = [];
        }
      }
      if (col.length) {
        while (col.length < 7)
          col.push({ date: new Date(NaN), count: 0, intensity: 0 });
        cols.push(col);
      }
      return cols;
    }, [gridStart, gridEnd, map, maxValue, weekStart]);

  const columnCount = weeks.length;
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columnCount}, ${size}px)`,
    gridTemplateRows: `${showWeekdayHeader ? size : 0}px repeat(7, ${size}px)`,
    gap: `${gap}px`,
    padding: `${gap * 2}px`,
    background: "#F3F4F6",
    borderRadius: 14,
  };

  const headerCells = showWeekdayHeader
    ? weekdayLabels.map((w, i) => (
        <div
          key={`h-${i}`}
          style={{
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: i === 0 ? "#EF4444" : i === 6 ? "#3B82F6" : "#6B7280",
          }}
        >
          {w}
        </div>
      ))
    : null;

  const renderCell = (
    d: { date: Date; count: number; intensity: number },
    idx: number
  ) => {
    const isValid = !isNaN(d.date as unknown as number);
    const intensity = d.intensity;
    const solid = mix(gradFrom, gradTo, intensity);
    const style: React.CSSProperties = {
      width: size,
      height: size,
      borderRadius: radius,
      background:
        isValid && d.count > 0
          ? `linear-gradient(135deg, ${mix(gradFrom, solid, 0.5)}, ${solid})`
          : baseColor,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.04) inset",
      cursor: isValid ? (onCellClick ? "pointer" : "default") : "default",
      ...(cellStyle && isValid ? cellStyle(d) : undefined),
    };

    const label = isValid
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
          d.date
        ) + `: ${d.count}`
      : "";

    const className = cellClassName && isValid ? cellClassName(d) : undefined;

    return (
      <div
        key={idx}
        className={className}
        style={style}
        role={isValid ? "button" : undefined}
        aria-label={isValid ? label : undefined}
        title={tooltip ? tooltip({ date: d.date, count: d.count }) : label}
        onClick={
          isValid && onCellClick
            ? () => onCellClick({ date: d.date, count: d.count })
            : undefined
        }
      />
    );
  };

  return (
    <div style={gridStyle}>
      {showWeekdayHeader && (
        <>
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            // ヘッダは1行分だけ・列グリッドに合わせて表示
            <div
              key={`head-col-${colIdx}`}
              style={{
                gridColumn: colIdx + 1,
                gridRow: 1,
                display: "contents",
              }}
            >
              {headerCells}
            </div>
          ))}
        </>
      )}

      {weeks.map((col, x) => (
        <div key={x} style={{ display: "contents" }}>
          {col.map((cell, i) => (
            <div
              key={`${x}-${i}`}
              style={{
                gridColumn: x + 1,
                gridRow: (showWeekdayHeader ? 2 : 1) + i,
              }}
            >
              {renderCell(cell, i)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// === Demo ===
export default function Demo() {
  // 直近3ヶ月分のダミーデータ
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setMonth(start.getMonth() - 3);

  // ランダムで強度付与
  const vals: HeatmapValue[] = [];
  for (const d of eachDay(start, end)) {
    const iso = ISO(d);
    const noise = Math.random();
    const count = noise > 0.75 ? Math.floor(noise * 12) : Math.floor(noise * 3);
    vals.push({ date: iso, count });
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 18, marginBottom: 12 }}>
        GitHub風コントリビューション
      </h1>
      <ContribHeatmap
        values={vals}
        startDate={start}
        endDate={end}
        size={22}
        radius={8}
        gap={6}
        baseColor="#EEF2F7"
        gradFrom="#FF00D6"
        gradTo="#FF4D00"
        tooltip={({ date, count }) =>
          `${date.toLocaleDateString("ja-JP")} - ${count} commits`
        }
        onCellClick={({ date, count }) =>
          alert(`${date.toLocaleDateString("ja-JP")}: ${count} commits`)
        }
      />
    </div>
  );
}
