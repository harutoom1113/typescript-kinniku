"use server";

import { adminDb } from "@/lib/firebase/admin";

// トレーニングセッションの型定義
export interface UserTrain {
  startTrain: Date;
  finishTrain?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * トレーニングを開始
 * @param userId ユーザーID
 * @returns セッションID
 */
export async function startTraining(userId: string): Promise<string> {
  try {
    const now = new Date();
    const sessionRef = adminDb
      .collection("user-train")
      .doc(userId)
      .collection("sessions")
      .doc();

    await sessionRef.set({
      startTrain: now,
      createdAt: now,
      updatedAt: now,
    });

    return sessionRef.id;
  } catch (error) {
    console.error("Error starting training:", error);
    throw new Error("Failed to start training");
  }
}

/**
 * トレーニングを終了
 * @param userId ユーザーID
 * @param sessionId セッションID
 */
export async function finishTraining(
  userId: string,
  sessionId: string
): Promise<void> {
  try {
    const sessionRef = adminDb
      .collection("user-train")
      .doc(userId)
      .collection("sessions")
      .doc(sessionId);

    await sessionRef.update({
      finishTrain: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error finishing training:", error);
    throw new Error("Failed to finish training");
  }
}

/**
 * ユーザーのトレーニングセッション一覧を取得
 * @param userId ユーザーID
 * @returns トレーニングセッション配列
 */
export async function getUserTrainingSessions(
  userId: string
): Promise<(UserTrain & { id: string })[]> {
  try {
    const sessionsSnapshot = await adminDb
      .collection("user-train")
      .doc(userId)
      .collection("sessions")
      .orderBy("createdAt", "desc")
      .get();

    return sessionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        startTrain: data.startTrain.toDate(),
        finishTrain: data.finishTrain?.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });
  } catch (error) {
    console.error("Error fetching training sessions:", error);
    throw new Error("Failed to fetch training sessions");
  }
}
