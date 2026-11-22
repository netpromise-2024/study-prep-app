import Link from "next/link";
import { notFound } from "next/navigation";
import { requireParent } from "../../../lib/require-parent";
import { readStudent } from "../../../lib/db";

export const dynamic = "force-dynamic";

export default async function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireParent();
  const { id } = await params;
  const data = await readStudent(id);
  if (!data) notFound();
  return (
    <>
      <header className="top"><div className="brand">Family AI Learning OS<small>수학 학습 기록 · 부모 전용</small></div><span className="state">PRIVATE</span></header>
      <main>
        <Link href="/" className="back">← 통합 대시보드</Link>
        <h1>{String(data.student.display_name)}의 수학 학습</h1>
        <p className="sub">과제 진행과 취약 개념을 학생별로 독립 관리합니다.</p>
        <section className="section">
          <h2>최근 학습과제</h2>
          {data.assignments.length === 0 ? <div className="empty">등록된 학습과제가 없습니다.</div> :
            <div className="card"><table className="table"><thead><tr><th>과제</th><th>상태</th><th>생성일</th></tr></thead><tbody>
              {data.assignments.map(a=><tr key={String(a.id)}><td>{String(a.title)}</td><td>{String(a.status)}</td><td>{new Date(String(a.created_at)).toLocaleDateString("ko-KR", {timeZone:"Asia/Seoul"})}</td></tr>)}
            </tbody></table></div>}
        </section>
        <section className="section">
          <h2>최근 오답</h2>
          {data.errors.length === 0 ? <div className="empty">검증된 오답 기록이 없습니다.</div> :
            <div className="card"><table className="table"><thead><tr><th>오류 분류</th><th>재학습 상태</th></tr></thead><tbody>
              {data.errors.map((e,i)=><tr key={i}><td>{String(e.error_type)}</td><td>{String(e.recheck_status)}</td></tr>)}
            </tbody></table></div>}
        </section>
      </main>
    </>
  );
}
