export enum TrainingIntensity {
  NONE = "NONE",
  LIGHT = "LIGHT",
  MEDIUM = "MEDIUM",
  DARK = "DARK",
  FULL = "FULL",
}

export const INTENSITY_GRADIENTS: Record<TrainingIntensity, string> = {
  [TrainingIntensity.NONE]: "bg-white",
  [TrainingIntensity.LIGHT]:
    "bg-gradient-to-bl from-[#FF00D6]/20 to-[#FF4D00]/20",
  [TrainingIntensity.MEDIUM]:
    "bg-gradient-to-bl from-[#FF00D6]/50 to-[#FF4D00]/50",
  [TrainingIntensity.DARK]:
    "bg-gradient-to-bl from-[#FF00D6]/80 to-[#FF4D00]/80",
  [TrainingIntensity.FULL]: "bg-gradient-to-bl from-[#FF00D6] to-[#FF4D00]",
};

export function getIntensityFromMinutes(minutes: number): TrainingIntensity {
  if (minutes === 0) return TrainingIntensity.NONE;
  if (minutes < 40) return TrainingIntensity.LIGHT;
  if (minutes < 80) return TrainingIntensity.MEDIUM;
  if (minutes < 120) return TrainingIntensity.DARK;
  return TrainingIntensity.FULL;
}
