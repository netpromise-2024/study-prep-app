# Family AI Learning OS — Vercel 배포 체크리스트

> 현재 상태: GitHub + Neon DB 준비. Vercel 프로젝트 생성/실서비스 로그인 검증은 미완료.

## 1. GitHub 코드 가져오기

1. https://vercel.com/new/import 에서 GitHub로 로그인
2. `netpromise-2024/study-prep-app` 가져오기
3. **프로젝트 이름:** `family-ai-learning-os` (사용 가능 시)
4. **Framework Preset:** Next.js
5. **Root Directory:** `family-ai-learning-os` (필수)
6. **Production Branch:** `main`
7. **Functions Region:** `sin1` (Singapore) 지원 여부 확인 후 선택

루트 디렉터리를 저장소 최상위로 지정하면 기존 정적 학습 앱이 선택되므로 주의.

## 2. 비밀 환경변수 설정 (Production)

| 변수 | 값의 출처 |
|------|------------|
| `DATABASE_URL` | Neon `family-ai-learning-os` 프로젝트의 `learning_os` DB용 TLS 접속 문자열. 원본은 Neon Console에서 복사 |
| `AUTH_SECRET` | 로컬 터미널에서 `openssl rand -base64 32` 로 생성 |
| `AUTH_GITHUB_ID` | GitHub OAuth App의 Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App의 Client Secret |
| `PARENT_GITHUB_ID` | 부모로 허용할 GitHub 계정의 **숫자** 사용자 ID |
| `AUTOMATIC_RELEASE_ENABLED` | `false` |
| `AUTOMATIC_SCHEDULE_ENABLED` | `false` |

비밀값을 GitHub 이슈, PR, 채팅창, 소스코드, `.env.example` 에 넣지 말 것.

## 3. GitHub OAuth App 설정

- https://github.com/settings/developers → OAuth Apps → New OAuth App
- Application name: `Family AI Learning OS`
- Homepage URL: **실제 배포 도메인** `https://<actual-domain>.vercel.app`
- Authorization callback URL: `https://<actual-domain>.vercel.app/api/auth/callback/github`
- OAuth App 생성 후 Client ID 및 새 Client Secret을 Vercel 환경변수에 저장
- 도메인이 결정되기 전에 OAuth App을 먼저 만드는 경우, 배포 후 정확한 주소로 callback을 수정
- 변경한 환경변수가 새 배포에 반영되도록 Redeploy

## 4. 배포 후 확인

1. 로그아웃 상태로 `/` 접속 → GitHub 로그인 페이지로 이동하는지 확인
2. 승인되지 않은 계정으로 로그인 → 접근 거부 여부 확인
3. 승인된 부모 GitHub 계정으로 로그인 → 대시보드 표시
4. 최초 데이터 0명 표시는 정상. DB에 실학생 정보를 검증하기 전까지 저장하지 않음
5. `/api/manager/overview` → 승인된 부모에게만 자료 제공
6. `/api/health` → 승인된 부모에게만 상태 응답
7. Neon `system_settings`: automatic_release_enabled / automatic_schedule_enabled 모두 false인지 확인

## 5. 운영 제한

- 현재 MVP에는 학부모 전용 조회만 구현. **실제 자동출제·자동채점·발송 및 학생 로그인은 미구현**
- GitHub 로그인은 계정 확인을 위한 임시 방식이며 학생용 로그인은 추후 별도 설계
- DB RLS와 세부 권한 설계 전에는 실제 학생 성적/개인자료를 임의 이관하지 않을 것
- 앱의 빌드 통과는 보안 테스트/실제 로그인 성공을 의미하지 않음
