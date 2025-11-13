import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { UserProvider, type User } from "@/lib/auth/user-context";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) redirect("/");

  let user: User | null = null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    user = {
      uid: decodedClaims.uid,
      email: decodedClaims.email || null,
      displayName: decodedClaims.name || null,
      photoURL: decodedClaims.picture || null,
    };
  } catch {
    redirect("/");
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}
