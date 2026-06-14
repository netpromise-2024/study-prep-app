# 형제 시험 준비 관리 앱

큰아들 `hyeon1`, 둘째아들 `hyeon2`의 2026년 7월 시험 준비 루틴을 관리하는 정적 웹앱입니다.

## 핵심 기능

- 아이디 선택: `hyeon1`, `hyeon2`
- 오늘 공부 계획 자동 생성
- 암기과목 루틴: 교과서 1회독, 2회독, 3회독, 자습서, 기본 유형, 족보 1~3회
- 수학 루틴: 주 2회 과외, 교과서 예제, 종합 문제, 족보 1~3회
- 실제 공부 내용, 소요 시간, 부모 메모 저장
- 과목별 진행률과 단계별 완료 여부 확인

## 로컬 실행

`index.html`을 브라우저로 열면 바로 사용할 수 있습니다.

정적 서버로 확인하려면:

```bash
node local-server.js
```

## Render 배포

1. 이 폴더를 GitHub 저장소에 올립니다.
2. Render에서 **New +** → **Static Site**를 선택합니다.
3. GitHub 저장소를 연결합니다.
4. 설정값:
   - Build Command: 비워두기
   - Publish Directory: `.`
5. 배포 후 제공되는 Render URL로 접속합니다.

## GitHub 저장소 생성 순서

Git이 설치된 PC에서 이 폴더 안에서 아래 순서로 실행합니다.

```bash
git init
git add .
git commit -m "Initial study prep app"
git branch -M main
git remote add origin https://github.com/YOUR_ID/study-prep-app.git
git push -u origin main
```

## 데이터 저장 방식

현재 버전은 브라우저의 `localStorage`에 기록을 저장합니다. 같은 기기와 같은 브라우저에서는 기록이 유지됩니다.

다음 버전에서는 부모 계정, 아이 계정, 서버 DB, 여러 기기 동기화를 추가할 수 있습니다.
