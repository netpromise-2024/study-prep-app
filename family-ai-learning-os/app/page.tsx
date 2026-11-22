import Link from "next/link";
import { readOverview } from "../lib/db";
import { requireParent } from "../lib/require-parent";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  await requireParent();
  let overview: Awaited<ReturnType<typeof readOverview>> | null = null;
  try {
    overview = await readOverview();
  } catch {
    // Keep database credentials and detailed connection errors out of the UI.
  }
  return (
    <>
      <header className="top">
        <div className="brand">Family AI Learning OS<small>학부모 통합 학습 매니저 · 수학 파일럿</small></div>
        <span className="state">PRIVATE BETA</span>
      </header>
      <main>
        <h1>통합 학습 현황</h1>
        <p className="sub">학생별 성적·오답·과제를 하나의 DB에서 관리합니다. 학습 가능시간 확정 전에는 과제를 자동 배포하지 않습니다.</p>
        <div className="grid">
          <div className="card"><div className="kicker">등록된 학생</div><div className="big">{overview?.students.length ?? "—"}</div><div className="stat">실제 학습정보는 확인 후 등록</div></div>
          <div className="card"><div className="kicker">자동 과제 발송</div><span className={"state " + (!overview?.automaticRelease ? "off" : "")}>{overview?.automaticRelease ? "ON" : "OFF"}</span><p className="stat">학부모 승인 전 비활성화</p></div>
          <div className="card"><div className="kicker">정기 학습 실행</div><span className={"state " + (!overview?.automaticSchedule ? "off" : "")}>{overview?.automaticSchedule ? "ON" : "OFF"}</span><p className="stat">학습 시간 미입력</p></div>
        </div>
        <section className="section">
          <h2>학생별 학습 공간</h2>
          {overview === null ? (
            <div className="notice">Neon DB 연결 정보를 아직 확인할 수 없습니다. Vercel 환경변수 DATABASE_URL과 Neon 프로젝트 접근 권한을 확인하세요.</div>
          ) : overview.students.length === 0 ? (
            <div className="empty">아직 등록된 학생이 없습니다. 개인정보와 기존 오답 자료는 검증 후 이관할 예정입니다.</div>
          ) : (
            <div className="students">
              {overview.students.map((s) => (
                <Link className="card student" key={s.id} href={"/student/" + s.id}>
                  <div className="title">{s.display_name}</div>
                  <div className="meta">수학 · {s.grade ? s.grade + "학년" : "학년 미확인"}</div>
                  <div className="details"><span>과제 {s.assignment_count}건</span><span>확인할 오답 {s.open_error_count}건</span></div>
                </Link>
              ))}
            </div>
          )}
        </section>
        <section className="section"><div className="notice"><b>현재 운영 단계:</b> 수학 1과목에 대한 DB·조회 화면 파일럿입니다. 자동 출제, 서술형 채점, 학생 로그인, 과제 자동발송은 아직 연결하지 않았습니다.</div></section>
        <p className="small section">이 화면은 승인된 학부모 GitHub 계정으로 로그인했을 때만 조회할 수 있도록 구성되었습니다.</p>
      </main>
    </>
  );
}
