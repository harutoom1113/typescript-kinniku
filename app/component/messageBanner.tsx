// app/component/messageBanner.tsx
type Message = { type: "success" | "error"; text: string };

export const MessageBanner: React.FC<{ message: Message | null }> = ({
  message,
}) => {
  if (!message) return null;

  return (
    <div
      className={`w-full max-w-md mx-auto mt-4 p-3 rounded-md text-center ${
        message.type === "success"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {message.text}
    </div>
  );
};
