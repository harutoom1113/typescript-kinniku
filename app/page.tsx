"use client";
import { clientAuth } from "@/lib/firebase/client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignInPage() {
  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(clientAuth, provider);
    const idToken = await cred.user.getIdToken();

    // サーバへIDトークンを渡して「セッションCookie」を作る
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    // 保護ページへ
    window.location.href = "/dashboard";
  };

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4 flex flex-col">
      <h1 className="text-xl font-bold">Sign in</h1>
      <button
        onClick={handleGoogle}
        className="w-full h-12 bg-black text-white rounded-md px-5"
      >
        Sign in with Google
      </button>
    </div>
  );
}
