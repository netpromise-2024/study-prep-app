import { auth } from "../../../../auth";
import { readOverview } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || !process.env.PARENT_GITHUB_ID) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readOverview();
    return Response.json(data, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }
}
