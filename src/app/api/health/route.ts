import { connection } from "next/server";

import { getDb } from "@/lib/db";

export async function GET() {
  // Always run at request time, so this reflects the live database.
  await connection();
  const row = getDb().prepare("SELECT COUNT(*) AS count FROM tasks").get() as {
    count: number;
  };
  return Response.json({ ok: true, tasks: row.count });
}
