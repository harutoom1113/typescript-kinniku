export enum WhiteButtonText {
  RUN = "RUN",
  WEIGHT = "WEIGHT TRAINING",
}

type ButtonProps = {
  text: WhiteButtonText;
  isSelected?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // または: () => void
};

export default function WhiteButton({
  text,
  isSelected = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`font-black text-xs h-15 w-full px-20 rounded-md border-2 tracking-widest transition-all ${
        isSelected
          ? "bg-linear-to-bl from-[#FF00D6] to-[#FF4D00] text-white border-transparent"
          : "bg-white text-black"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
