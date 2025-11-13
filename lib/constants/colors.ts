// プロフィール画像の色定義
export enum ProfileColor {
  RED = "RED",
  ORANGE = "ORANGE",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
  BLUE = "BLUE",
  PURPLE = "PURPLE",
  PINK = "PINK",
  LIGHT_BLUE = "LIGHT_BLUE",
  YELLOW_GREEN = "YELLOW_GREEN",
  LIGHT_PURPLE = "LIGHT_PURPLE",
}

// 色のグラデーション定義（Tailwind CSS クラス）
export const COLOR_GRADIENTS: Record<ProfileColor, string> = {
  [ProfileColor.RED]: "bg-gradient-to-bl from-red-400 to-red-600",
  [ProfileColor.ORANGE]: "bg-gradient-to-bl from-orange-400 to-orange-600",
  [ProfileColor.YELLOW]: "bg-gradient-to-bl from-yellow-300 to-yellow-500",
  [ProfileColor.GREEN]: "bg-gradient-to-bl from-green-400 to-green-600",
  [ProfileColor.BLUE]: "bg-gradient-to-bl from-blue-400 to-blue-600",
  [ProfileColor.PURPLE]: "bg-gradient-to-bl from-purple-400 to-purple-600",
  [ProfileColor.PINK]: "bg-gradient-to-bl from-pink-400 to-pink-600",
  [ProfileColor.LIGHT_BLUE]: "bg-gradient-to-bl from-cyan-300 to-cyan-500",
  [ProfileColor.YELLOW_GREEN]: "bg-gradient-to-bl from-lime-400 to-lime-600",
  [ProfileColor.LIGHT_PURPLE]:
    "bg-gradient-to-bl from-purple-300 to-purple-400",
};

// デフォルトの色
export const DEFAULT_PROFILE_COLOR = ProfileColor.PINK;
