"use client";
import Button, { ButtonText } from "@/app/component/button";
import NamePlateImage from "@/app/component/nameplateImage";

import { useState } from "react";
type FormDataType = {
  name: string;
  living: string;
  weight: number;
  height: number;
  userId: string;
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: "ANKNOWN",
    living: "PLACE",
    weight: 0,
    height: 0,
    userId: "",
  });

  // 入力欄の変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 状態の入れ替え
  const handleButton = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100">
      <NamePlateImage name={formData.name} place={formData.living} />

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
            name="living"
            value={formData.living}
            onChange={handleChange}
            placeholder="LIVING"
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
          <Button text={ButtonText.DONE} onClick={handleButton} />
          </div>
        </div>
      ) : (
        <div className="w-1/2">
        <Button text={ButtonText.EDIT} onClick={handleButton} />
        </div>
      )}
    </div>
  );
}
