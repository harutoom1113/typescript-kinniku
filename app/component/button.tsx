export enum ButtonText {
  TRAIN = "TRAIN",
  FINISH = "FINISH",
  DONE = "DONE",
  EDIT = "EDIT",
  FOLLOW = "FOLLOW",
}

type ButtonProps = {
  text: ButtonText;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // または: () => void
  disabled?: boolean;
};

export default function Button({ text, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={`font-black text-xs h-15 w-full px-20 rounded-md tracking-widest ${
        disabled
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-black text-white"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
