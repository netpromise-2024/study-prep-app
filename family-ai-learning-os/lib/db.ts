import "server-only";
import { neon } from "@neondatabase/serverless";

export function db() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  return neon(connectionString);
}

export type StudentSummary = {
  id: string;
  display_name: string;
  grade: number | null;
  assignment_count: number;
  open_error_count: number;
};

export async function readOverview() {
  const sql = db();
  const [students, settings] = await Promise.all([
    sql`SELECT s.id::text AS id, s.display_name,
      p.grade,
      (SELECT count(*)::int FROM assignments a WHERE a.student_id = s.id) AS assignment_count,
      (SELECT count(*)::int FROM error_events e WHERE e.student_id = s.id AND e.recheck_status <> 'MASTERED') AS open_error_count
      FROM students s
      LEFT JOIN LATERAL (SELECT grade FROM academic_profiles p
        WHERE p.student_id = s.id ORDER BY academic_year DESC LIMIT 1) p ON true
      WHERE s.active = true
      ORDER BY s.created_at ASC`,
    sql`SELECT automatic_release_enabled, automatic_schedule_enabled FROM system_settings WHERE singleton=true`,
  ]);
  return {
    students: students as StudentSummary[],
    automaticRelease: settings[0]?.automatic_release_enabled === true,
    automaticSchedule: settings[0]?.automatic_schedule_enabled === true,
  };
}

export async function readStudent(studentId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId)) return null;
  const sql = db();
  const [students, assignments, errors] = await Promise.all([
    sql`SELECT id::text, display_name FROM students WHERE id=${studentId}::uuid AND active=true LIMIT 1`,
    sql`SELECT id::text, title, status, created_at FROM assignments WHERE student_id=${studentId}::uuid ORDER BY created_at DESC LIMIT 20`,
    sql`SELECT error_type, recheck_status, created_at FROM error_events WHERE student_id=${studentId}::uuid ORDER BY created_at DESC LIMIT 20`,
  ]);
  if (!students[0]) return null;
  return { student: students[0], assignments, errors };
}
