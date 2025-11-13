"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * サインアウト処理
 * セッションクッキーを削除してログインページにリダイレクト
 */
export async function signOut() {
  // セッションクッキーを削除
  const cookieStore = await cookies();
  cookieStore.set("session", "", { path: "/", maxAge: 0 });

  // ログインページにリダイレクト
  redirect("/");
}
