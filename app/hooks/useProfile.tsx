// src/hooks/useProfile.ts
"use client";
import { useEffect, useState } from "react";
import { getUserData, updateUserData } from "@/lib/firestore/user-data";
import { DEFAULT_PROFILE_COLOR, ProfileColor } from "@/lib/constants/colors";
import { User } from "firebase/auth"; // 型はプロジェクトに合わせて

type FormDataType = {
  name: string;
  place: string;
  weight: number;
  height: number;
  userId: string;
};

type Message = { type: "success" | "error"; text: string } | null;

export const useProfile = (user: User | null | undefined) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isColorEditing, setIsColorEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProfileColor>(
    DEFAULT_PROFILE_COLOR
  );
  const [message, setMessage] = useState<Message>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "ANKNOWN",
    place: "PLACE",
    weight: 0,
    height: 0,
    userId: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userData = await getUserData(user.uid);

        if (userData) {
          setFormData({
            name: userData.name || user.displayName || "ANKNOWN",
            place: userData.place || "PLACE",
            weight: userData.weight || 0,
            height: userData.height || 0,
            userId: user.uid,
          });
          setSelectedColor(userData.profileColor || DEFAULT_PROFILE_COLOR);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        setFormData((prev) => ({
          ...prev,
          name: user?.displayName || "",
          userId: user?.uid || "",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setMessage(null);

    try {
      await updateUserData(user.uid, {
        name: formData.name,
        email: user.email || "",
        place: formData.place,
        weight: Number(formData.weight),
        height: Number(formData.height),
      });
      setMessage({ type: "success", text: "プロフィールを保存しました" });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save user data:", error);
      setMessage({
        type: "error",
        text: "保存に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 1000);
    }
  };

  return {
    isEditing,
    isColorEditing,
    isLoading,
    isSaving,
    selectedColor,
    message,
    formData,
    setIsEditing,
    setIsColorEditing,
    setSelectedColor,
    handleChange,
    handleSave,
    setMessage,
  };
};
