import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", "", { path: "/", maxAge: 0 });
  return res;
}

// クライアント側のログアウト例
// await fetch("/api/auth/logout", { method: "POST" });
// window.location.href = "/signin";
