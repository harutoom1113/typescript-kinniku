import {
  House,
  MessageCircleMore,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import Link from "next/link";
export default function Footer() {
  return (
    <div className="flex flex-row bg-white justify-around items-center h-20 w-full fixed bottom-0 left-0 right-0 border-t ">
      <Link href="/home">
        <House />
      </Link>
      <Link href="/search">
        <Search />
      </Link>
      <Link href="/plus">
        <div className="h-10 w-20 rounded-full bg-linear-to-bl from-[#FF00D6] to-[#FF4D00] flex items-center justify-center ">
          <Plus className="text-white" />
        </div>
      </Link>
      <Link href="/">
        <MessageCircleMore />
      </Link>
      <Link href="/profile">
        <UserRound />
      </Link>
    </div>
  );
}
