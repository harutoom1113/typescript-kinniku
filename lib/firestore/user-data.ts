"use server";

import { adminDb } from "@/lib/firebase/admin";
import { ProfileColor } from "@/lib/constants/colors";

// ユーザーデータの型定義
export interface UserData {
  userId: string;
  name: string;
  email: string;
  place?: string;
  height?: number;
  weight?: number;
  profileColor?: ProfileColor;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ユーザーデータを取得
 * @param userId ユーザーID
 * @returns ユーザーデータまたはnull
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const docRef = adminDb.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      userId,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as UserData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data");
  }
}

/**
 * ユーザーデータを作成または更新
 * @param userId ユーザーID
 * @param data 更新するデータ
 */
export async function updateUserData(
  userId: string,
  data: Partial<Omit<UserData, "userId" | "createdAt" | "updatedAt">>
): Promise<void> {
  try {
    const docRef = adminDb.collection("users").doc(userId);
    const doc = await docRef.get();

    if (!doc.exists) {
      // 新規作成
      await docRef.set({
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // 更新
      await docRef.update({
        ...data,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    throw new Error("Failed to update user data");
  }
}

/**
 * ユーザーデータを削除
 * @param userId ユーザーID
 */
export async function deleteUserData(userId: string): Promise<void> {
  try {
    await adminDb.collection("users").doc(userId).delete();
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw new Error("Failed to delete user data");
  }
}
