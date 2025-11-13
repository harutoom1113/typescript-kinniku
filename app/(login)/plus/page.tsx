"use client";

import NamePlate from "@/app/component/namePlate";
import WhiteButton, { WhiteButtonText } from "./ui/whiteButton";
import CalendarTileJP from "./ui/calendarTile";
import RiveAnimation from "@/app/component/riveAnimation";
import Button, { ButtonText } from "@/app/component/button";
import { useUser } from "@/lib/auth/user-context";
import { startTraining, finishTraining } from "@/lib/firestore/user-train";
import { useState } from "react";

type SelectedButton = WhiteButtonText | null;

export default function Plus() {
  const { user } = useUser();
  const [selectedButton, setSelectedButton] = useState<SelectedButton>(null);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // RUN/WEIGHTボタンのクリックハンドラー
  const handleButtonClick = (button: WhiteButtonText) => {
    if (isTrainingActive) return; // トレーニング中は選択変更不可
    setSelectedButton((prev) => (prev === button ? null : button));
  };

  // TRAINボタンのクリックハンドラー
  const handleTrainClick = async () => {
    if (!user || !selectedButton || isSaving) return;

    setIsSaving(true);
    try {
      const sessionId = await startTraining(user.uid);
      console.log("Training started with session ID:", sessionId);
      setCurrentSessionId(sessionId);
      setIsTrainingActive(true);
    } catch (error) {
      console.error("Failed to start training:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // FINISHボタンのクリックハンドラー
  const handleFinishClick = async () => {
    if (!user || !currentSessionId || isSaving) return;

    setIsSaving(true);
    try {
      await finishTraining(user.uid, currentSessionId);
      console.log("Training finished for session ID:", currentSessionId);
      setIsTrainingActive(false);
      setCurrentSessionId(null);
      setSelectedButton(null); // 選択状態をリセット
    } catch (error) {
      console.error("Failed to finish training:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-12">
      <NamePlate name="Jane" place="san flancisco" />
      <CalendarTileJP />
      <div className="flex flex-col mt-10  gap-4 justify-center items-center w-1/2">
        <WhiteButton
          text={WhiteButtonText.RUN}
          isSelected={selectedButton === WhiteButtonText.RUN}
          onClick={() => handleButtonClick(WhiteButtonText.RUN)}
        />
        <WhiteButton
          text={WhiteButtonText.WEIGHT}
          isSelected={selectedButton === WhiteButtonText.WEIGHT}
          onClick={() => handleButtonClick(WhiteButtonText.WEIGHT)}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <RiveAnimation isPlaying={isTrainingActive} />
        </div>
        {/* TRAIN/FINISHボタン - Riveアニメーションの上に重なる */}
        <div className="fixed bottom-32 w-1/2 z-10">
          <div className={!selectedButton && !isTrainingActive ? "opacity-50" : ""}>
            <Button
              text={isTrainingActive ? ButtonText.FINISH : ButtonText.TRAIN}
              onClick={isTrainingActive ? handleFinishClick : handleTrainClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
