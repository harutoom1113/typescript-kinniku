// src/hooks/useSignOut.ts
"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth/sign-out";

export const useSignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
      setIsSigningOut(false);
    }
  };

  return { isSigningOut, handleSignOut };
};
