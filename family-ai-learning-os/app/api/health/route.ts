import { auth } from "../../../auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || !process.env.PARENT_GITHUB_ID) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ status: "ok", application: "family-ai-learning-os" }, { headers: { "Cache-Control": "no-store" } });
}
