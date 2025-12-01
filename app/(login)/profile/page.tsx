"use client";
import Button, { ButtonText } from "@/app/component/button";
import NamePlateImage from "@/app/component/nameplateImage";
import TrainingHeatmap from "@/app/component/trainingHeatmap";
import { useUser } from "@/lib/auth/user-context";
import { getUserData, updateUserData } from "@/lib/firestore/user-data";
import { ProfileColor, DEFAULT_PROFILE_COLOR } from "@/lib/constants/colors";
import { useState, useEffect } from "react";
import { useSignOut } from "@/app/hooks/signout";
import { MessageBanner } from "@/app/component/messageBanner";
import { ProfileForm } from "@/app/component/profileForm";

type FormDataType = {
  name: string;
  place: string;
  weight: number;
  height: number;
  userId: string;
};

export default function Profile() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isColorEditing, setIsColorEditing] = useState(false);
  const { isSigningOut, handleSignOut } = useSignOut();
  const [selectedColor, setSelectedColor] = useState<ProfileColor>(
    DEFAULT_PROFILE_COLOR
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "ANKNOWN",
    place: "PLACE",
    weight: 0,
    height: 0,
    userId: "",
  });

  // ユーザー情報が取得できたらFirestoreからデータを読み込む
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userData = await getUserData(user.uid);

        if (userData) {
          // Firestoreにデータが存在する場合
          setFormData({
            name: userData.name || user.displayName || "ANKNOWN",
            place: userData.place || "PLACE",
            weight: userData.weight || 0,
            height: userData.height || 0,
            userId: user.uid,
          });
          // プロフィール色を設定
          setSelectedColor(userData.profileColor || DEFAULT_PROFILE_COLOR);
        } else {
          // Firestoreにデータが存在しない場合は認証情報から初期化
          setFormData({
            name: user.displayName || "ANKNOWN",
            place: "PLACE",
            weight: 0,
            height: 0,
            userId: user.uid,
          });
          setSelectedColor(DEFAULT_PROFILE_COLOR);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        // エラー時は認証情報から初期化
        setFormData((prev) => ({
          ...prev,
          name: user.displayName || "",
          userId: user.uid,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // 入力欄の変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 保存処理
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

      setMessage({
        type: "success",
        text: "プロフィールを保存しました",
      });
      setIsEditing(false);

      // 2秒後にメッセージを消す
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    } catch (error) {
      console.error("Failed to save user data:", error);
      setMessage({
        type: "error",
        text: "保存に失敗しました。もう一度お試しください。",
      });

      // エラーメッセージも2秒後に消す
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  // 編集モード切り替え
  const handleEdit = () => {
    setIsEditing(true);
    setMessage(null);
  };

  // 色編集の開始
  const handleColorEditStart = () => {
    setIsColorEditing(true);
  };

  // 色の選択
  const handleColorSelect = (color: ProfileColor) => {
    setSelectedColor(color);
  };

  // 色の保存
  const handleColorSave = async () => {
    if (!user) return;

    try {
      await updateUserData(user.uid, {
        profileColor: selectedColor,
      });

      setMessage({
        type: "success",
        text: "色を保存しました",
      });
      setIsColorEditing(false);

      // 2秒後にメッセージを消す
      setTimeout(() => {
        setMessage(null);
      }, 1000);
    } catch (error) {
      console.error("Failed to save color:", error);
      setMessage({
        type: "error",
        text: "色の保存に失敗しました",
      });

      setTimeout(() => {
        setMessage(null);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center pt-15">
      <NamePlateImage
        name={formData.name}
        place={formData.place}
        color={selectedColor}
        isEditing={isColorEditing}
        onEditClick={handleColorEditStart}
        onColorSelect={handleColorSelect}
        onSaveClick={handleColorSave}
      />
      <MessageBanner message={message} />
      {isEditing ? (
        <ProfileForm
          formData={formData}
          isEditing={isEditing}
          isSaving={isSaving}
          onChange={handleChange}
          onEdit={handleEdit}
          onSave={handleSave}
        />
      ) : (
        <div className="w-1/2">
          <Button text={ButtonText.EDIT} onClick={handleEdit} />
        </div>
      )}
      {/* Training Heatmap */}
      {user && (
        <div className="w-full max-w-2xl mt-8 mb-8">
          <TrainingHeatmap userId={user.uid} />
        </div>
      )}
      {/* Signout Button */}
      <div className="w-1/2 mt-8 mb-20">
        {isSigningOut ? (
          <button
            className="bg-gray-400 text-gray-200 font-black text-xs h-15 w-full px-20 rounded-md cursor-not-allowed"
            disabled
          >
            Signing out...
          </button>
        ) : (
          <Button text={ButtonText.SIGNOUT} onClick={handleSignOut} />
        )}
      </div>
    </div>
  );
}
