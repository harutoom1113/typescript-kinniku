"use server";

import { adminDb } from "@/lib/firebase/admin";

/**
 * ユーザーをフォローする
 * @param userId フォローするユーザーのID
 * @param followingUserId フォロー対象のユーザーID
 */
export async function addFollowing(
  userId: string,
  followingUserId: string
): Promise<void> {
  const followingRef = adminDb
    .collection("following")
    .doc(userId)
    .collection("users")
    .doc(followingUserId);

  await followingRef.set({
    followedAt: new Date(),
    createdAt: new Date(),
  });
}

/**
 * ユーザーのフォローを解除する
 * @param userId フォロー解除するユーザーのID
 * @param followingUserId フォロー解除対象のユーザーID
 */
export async function removeFollowing(
  userId: string,
  followingUserId: string
): Promise<void> {
  const followingRef = adminDb
    .collection("following")
    .doc(userId)
    .collection("users")
    .doc(followingUserId);

  await followingRef.delete();
}

/**
 * フォロー状態を確認する
 * @param userId フォローしているユーザーのID
 * @param followingUserId フォロー対象のユーザーID
 * @returns フォロー中の場合true
 */
export async function isFollowing(
  userId: string,
  followingUserId: string
): Promise<boolean> {
  const followingRef = adminDb
    .collection("following")
    .doc(userId)
    .collection("users")
    .doc(followingUserId);

  const doc = await followingRef.get();
  return doc.exists;
}

/**
 * フォロー中のユーザーリストを取得する
 * @param userId ユーザーID
 * @returns フォロー中のユーザーIDリスト
 */
export async function getFollowingList(
  userId: string
): Promise<string[]> {
  const followingRef = adminDb
    .collection("following")
    .doc(userId)
    .collection("users");

  const snapshot = await followingRef.get();
  return snapshot.docs.map((doc) => doc.id);
}
