export enum WhiteButtonText {
  RUN = "RUN",
  WEIGHT = "WEIGHT TRAINING",
}

type ButtonProps = {
  text: WhiteButtonText;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // または: () => void
};

export default function WhiteButton({ text, onClick }: ButtonProps) {
  return (
    <button className="bg-white text-black font-black text-xs h-15 w-full px-20 rounded-md border-2 tracking-widest">
      {text}
    </button>
  );
}
