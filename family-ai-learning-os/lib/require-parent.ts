import "server-only";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export async function requireParent() {
  const session = await auth();
  if (!session?.user || !process.env.PARENT_GITHUB_ID) redirect("/api/auth/signin");
  return session;
}
