# Family AI Learning OS · 수학 파일럿 (v0.1)

기존 `study-prep-app`의 데이터를 덮어쓰지 않고, 별도 Next.js 하위 앱으로 개발합니다.

## 현재 구현
- Next.js 16 + TypeScript, Neon PostgreSQL 읽기 전용 통합 대시보드
- GitHub OAuth + 승인된 학부모 GitHub 사용자 ID 허용목록
- 학생별 과제·오답 조회, DB 접속 상태 표시
- 일정 및 과제 자동 발송 OFF (DB 정책값 표시)
- 새로운 AI 작업, 실제 시험 성적 입력, 학생 로그인은 미구현

## Neon
- 프로젝트: `family-ai-learning-os`
- DB: `learning_os` (PostgreSQL 17, Singapore)
- 프로젝트 ID: `rapid-violet-15281733`
- 비밀 접속 문자열은 GitHub에 저장하지 않음
- 기존 수학/오답 원본은 검증 후 이관

## 로컬 환경
1. `npm install`
2. `.env.example`을 참고하여 `.env.local` 생성
3. GitHub OAuth App 등록 (callback: `http://localhost:3000/api/auth/callback/github`)
4. `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `PARENT_GITHUB_ID`, `DATABASE_URL` 설정
5. `npm run dev` 후 `http://localhost:3000`에서 GitHub 로그인

## Vercel 연동
1. GitHub `study-prep-app` 저장소를 Vercel로 가져오기
2. 배포 루트 디렉터리: `family-ai-learning-os`
3. 위의 5개 환경변수를 Vercel 프로젝트 환경변수에 설정
4. GitHub OAuth callback 주소: `https://<your-domain>/api/auth/callback/github`
5. OAuth Client Secret은 Vercel에만 저장하고 GitHub에는 커밋하지 않음
6. 배포 후 먼저 인증/권한 검증을 수행할 것. 승인되지 않은 계정은 접근 불가능해야 함
7. 기존 정적 `study-prep-app` 배포 설정을 변경하지 말 것

**중요:** GitHub 코드 저장소가 공개여도 OAuth 비밀키 및 Neon 접속 문자열은 커밋되지 않습니다. 이 앱은 부모 전용 초기 파일럿이며 학생용 로그인과 문항 생성/채점은 아직 구현되지 않았습니다.

## 향후 개발
1. 학생 계정/역할별 접근 권한 및 DB RLS
2. 수학 선생님 출제 → 독립 검증 → 배정
3. 답안 제출·자동채점·오답 재출제
4. 학습시간 설정 후 부모 승인 기반 예약 실행
5. E2E 테스트, 안전성 및 배포 검증

## 안전 정책
- 아이 이름·성적·답안 등 개인정보는 소스코드에 기입하지 않음
- DATABASE_URL 등 모든 비밀값은 서버 환경변수에만 배치
- 실제 학생 기록은 출처/진위를 검증한 뒤 입력
- 관리자 인증 실패 시 학습 조회 API는 401
- 외부 자동 학습 발송은 구현하지 않고 운영 DB에서 OFF로 유지
