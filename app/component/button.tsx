export enum ButtonText {
  TRAIN = "TRAIN",
  DONE = "DONE",
  EDIT = "EDIT",
}

type ButtonProps = {
  text: ButtonText;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // または: () => void
};

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      className="bg-black text-white font-black text-xs h-12 w-auto px-20 rounded-md"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
