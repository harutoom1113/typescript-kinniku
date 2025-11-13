"use client";
import Button, { ButtonText } from "@/app/component/button";
import NamePlateImage from "@/app/component/nameplateImage";
import { useUser } from "@/lib/auth/user-context";
import { getUserData, updateUserData } from "@/lib/firestore/user-data";
import { ProfileColor, DEFAULT_PROFILE_COLOR } from "@/lib/constants/colors";
import { useState, useEffect } from "react";

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
    <div className="flex flex-col items-center bg-gray-100">
      <NamePlateImage
        name={formData.name}
        place={formData.place}
        color={selectedColor}
        isEditing={isColorEditing}
        onEditClick={handleColorEditStart}
        onColorSelect={handleColorSelect}
        onSaveClick={handleColorSave}
      />

      {/* メッセージ表示 */}
      {message && (
        <div
          className={`w-full max-w-md mx-auto mt-4 p-3 rounded-md text-center ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {isEditing ? (
        <div>
          {/* 編集モード */}
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="NAME"
            className="w-full border p-2 rounded my-3 h-15"
          />
          <input
            name="place"
            value={formData.place}
            onChange={handleChange}
            placeholder="PLACE"
            className="w-full border p-2 rounded my-3 h-15"
          />
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="WEIGHT"
            className="w-full border p-2 rounded my-3 h-15"
          />
          <input
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="HEIGHT"
            className="w-full border p-2 rounded my-3 h-15"
          />
          <input
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="USER ID"
            className="w-full border p-2 rounded mt-3 mb-10 h-15"
          />
          <div className="mt-3 mb-20">
            {isSaving ? (
              <button
                className="bg-black text-white font-black text-xs h-15 w-full px-20 rounded-md"
                disabled
              >
                loading...
              </button>
            ) : (
              <Button text={ButtonText.DONE} onClick={handleSave} />
            )}
          </div>
        </div>
      ) : (
        <div className="w-1/2">
          <Button text={ButtonText.EDIT} onClick={handleEdit} />
        </div>
      )}
    </div>
  );
}
