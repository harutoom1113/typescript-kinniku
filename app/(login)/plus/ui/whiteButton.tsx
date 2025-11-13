export default function WhiteButton({ text }: { text: string }) {
  return (
    <button className="bg-white text-black font-black text-xs h-12 w-auto px-20 rounded-md border">
      {text}
    </button>
  );
}
