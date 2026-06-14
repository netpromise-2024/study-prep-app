const STUDENTS = [
  { id: "hyeon1", name: "큰아들" },
  { id: "hyeon2", name: "둘째아들" },
];

const TODAY = "2026-06-14";
const EXAM_DAYS = {
  "2026-07-07": ["국어", "영어", "사회"],
  "2026-07-08": ["수학", "과학"],
};

const SUBJECTS = {
  국어: {
    examDate: "2026-07-07",
    range: "문학과의 만남 ~ 세상을 이해하는 힘, p14~p142",
    type: "memory",
    totalPages: 129,
    color: "#2477f3",
  },
  영어: {
    examDate: "2026-07-07",
    range: "About you and me ~ Be safe everywhere, p10~p60",
    type: "memory",
    totalPages: 51,
    color: "#19a97b",
  },
  사회: {
    examDate: "2026-07-07",
    range: "아메리카 주요국 ~ 인간과 사회생활 ~ 민주주의와 시민, p132~p182",
    type: "memory",
    totalPages: 51,
    color: "#d88919",
  },
  수학: {
    examDate: "2026-07-08",
    range: "수와 연산 ~ 좌표평면과 그래프, p12~p138, p266~p271",
    type: "math",
    totalPages: 133,
    color: "#7b61ff",
  },
  과학: {
    examDate: "2026-07-08",
    range: "과학과 인류의 지속가능한 삶 ~ 열, p12~p100",
    type: "memory",
    totalPages: 89,
    color: "#d64545",
  },
};

const MEMORY_STAGES = [
  "교과서 1회독",
  "교과서 2회독",
  "교과서 3회독",
  "자습서 읽기",
  "기본 유형 풀기",
  "족보 1회",
  "족보 2회",
  "족보 3회",
];

const MATH_STAGES = ["과외 강의", "교과서 예제", "종합 문제", "족보 1회", "족보 2회", "족보 3회"];

const PLAN_WINDOWS = [
  { start: "2026-06-14", end: "2026-06-18", stage: "교과서 1회독", math: "교과서 예제" },
  { start: "2026-06-19", end: "2026-06-23", stage: "교과서 2회독", math: "교과서 예제" },
  { start: "2026-06-24", end: "2026-06-28", stage: "교과서 3회독", math: "종합 문제" },
  { start: "2026-06-29", end: "2026-07-02", stage: "자습서 읽기", math: "족보 1회" },
  { start: "2026-07-03", end: "2026-07-04", stage: "기본 유형 풀기", math: "족보 2회" },
  { start: "2026-07-05", end: "2026-07-06", stage: "족보 3회", math: "족보 3회" },
];

const STORAGE_KEY = "study-prep-records-v1";
const app = document.querySelector("#app");

let state = {
  selectedStudent: localStorage.getItem("study-prep-student") || "",
  view: "today",
  date: TODAY,
  editingTask: null,
  records: loadRecords(),
};

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function icon(name) {
  const paths = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-8"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    refresh: '<path d="M21 12a9 9 0 0 0-15-6.7L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/><path d="M21 21v-5h-5"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateDiff(from, to) {
  return Math.round((parseDate(to) - parseDate(from)) / 86400000);
}

function addDays(value, days) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dayName(value) {
  return ["일", "월", "화", "수", "목", "금", "토"][parseDate(value).getDay()];
}

function koreanDate(value) {
  const date = parseDate(value);
  return `${date.getMonth() + 1}/${date.getDate()} (${dayName(value)})`;
}

function compactRange(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  return {
    dates: `${startDate.getMonth() + 1}/${startDate.getDate()}~${endDate.getMonth() + 1}/${endDate.getDate()}`,
    days: `${dayName(start)}-${dayName(end)}`,
  };
}

function planWindow(date) {
  return PLAN_WINDOWS.find((item) => item.start <= date && date <= item.end) || PLAN_WINDOWS[PLAN_WINDOWS.length - 1];
}

function chunkText(subject, stage, date) {
  const subjectInfo = SUBJECTS[subject];
  if (subject === "국어") {
    return pageText("p14", "p142", subjectInfo.totalPages, date, stage);
  }
  if (subject === "영어") {
    return pageText("p10", "p60", subjectInfo.totalPages, date, stage);
  }
  if (subject === "사회") {
    return pageText("p132", "p182", subjectInfo.totalPages, date, stage);
  }
  if (subject === "과학") {
    return pageText("p12", "p100", subjectInfo.totalPages, date, stage);
  }
  if (stage === "과외 강의") return "과외 강의 수강, 선생님 숙제와 틀린 예제 표시";
  if (stage === "교과서 예제") return "p12~p138, p266~p271 예제와 유제 풀이";
  if (stage === "종합 문제") return "단원 종합 문제 풀이, 오답 번호 기록";
  return `${stage} 풀이 후 오답을 다시 풀 수 있게 표시`;
}

function pageText(startLabel, endLabel, totalPages, date, stage) {
  const start = Number(startLabel.replace("p", ""));
  const current = planWindow(date);
  const days = dateDiff(current.start, current.end) + 1;
  const index = Math.max(0, Math.min(days - 1, dateDiff(current.start, date)));
  const chunk = Math.ceil(totalPages / days);
  const from = start + chunk * index;
  const to = Math.min(start + totalPages - 1, from + chunk - 1);
  if (stage.includes("족보")) return `${stage} 전체 범위 풀이, 오답과 찍은 문제 별도 표시`;
  if (stage === "자습서 읽기") return `${startLabel}~${endLabel} 자습서 핵심 설명 읽기`;
  if (stage === "기본 유형 풀기") return `${startLabel}~${endLabel} 기본 유형 문제 풀이`;
  return `교과서 p${from}~p${to} ${stage.replace("교과서 ", "")}`;
}

function defaultTasks(date) {
  const window = planWindow(date);
  const tasks = Object.keys(SUBJECTS).map((subject) => {
    const isMath = subject === "수학";
    const stage = isMath ? window.math : window.stage;
    return {
      id: `${date}-${subject}-${stage}`,
      subject,
      stage,
      content: chunkText(subject, stage, date),
      targetMinutes: isMath ? 70 : 45,
    };
  });

  const day = parseDate(date).getDay();
  if (day === 2 || day === 5) {
    tasks.unshift({
      id: `${date}-수학-과외`,
      subject: "수학",
      stage: "과외 강의",
      content: chunkText("수학", "과외 강의", date),
      targetMinutes: 90,
    });
  }

  return tasks;
}

function taskRecordKey(studentId, taskId) {
  return `${studentId}__${taskId}`;
}

function getRecord(taskId) {
  return state.records[taskRecordKey(state.selectedStudent, taskId)] || {};
}

function setRecord(taskId, patch) {
  const key = taskRecordKey(state.selectedStudent, taskId);
  state.records[key] = { ...state.records[key], ...patch, updatedAt: new Date().toISOString() };
  saveRecords();
  render();
}

function allStudentRecords(studentId) {
  return Object.entries(state.records)
    .filter(([key]) => key.startsWith(`${studentId}__`))
    .map(([, value]) => value);
}

function tasksUntil(date) {
  const items = [];
  for (let cursor = TODAY; cursor <= date; cursor = addDays(cursor, 1)) {
    items.push(...defaultTasks(cursor));
  }
  return items;
}

function progressBySubject(studentId) {
  const records = state.records;
  return Object.keys(SUBJECTS).map((subject) => {
    const tasks = tasksUntil(SUBJECTS[subject].examDate).filter((task) => task.subject === subject);
    const done = tasks.filter((task) => records[taskRecordKey(studentId, task.id)]?.done).length;
    return { subject, done, total: tasks.length, rate: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
  });
}

function stageProgress(studentId, subject) {
  const stages = SUBJECTS[subject].type === "math" ? MATH_STAGES : MEMORY_STAGES;
  const tasks = tasksUntil(SUBJECTS[subject].examDate).filter((task) => task.subject === subject);
  return stages.map((stage) => {
    const related = tasks.filter((task) => task.stage === stage);
    const done = related.some((task) => state.records[taskRecordKey(studentId, task.id)]?.done);
    return { stage, done, count: related.length };
  });
}

function studentName(id = state.selectedStudent) {
  return STUDENTS.find((student) => student.id === id)?.name || id;
}

function renderStudentTabs(className = "student-tabs") {
  return `
    <div class="${className}" aria-label="아이 선택">
      ${STUDENTS.map(
        (student) => `
          <button class="${student.id === state.selectedStudent ? "active" : ""}" type="button" onclick="login('${student.id}')">
            <span>${student.name}</span>
            <small>${student.id}</small>
          </button>
        `,
      ).join("")}
    </div>
  `;
}

function login(studentId) {
  state.selectedStudent = studentId;
  localStorage.setItem("study-prep-student", studentId);
  render();
}

function showView(view) {
  state.view = view;
  render();
}

function setDate(value) {
  state.date = value;
  render();
}

function openEditor(taskId) {
  state.editingTask = defaultTasks(state.date).find((task) => task.id === taskId);
  render();
}

function closeEditor() {
  state.editingTask = null;
  render();
}

function saveEditor(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const minutes = Math.max(0, Math.round(Number(form.get("minutes") || 0)));
  setRecord(state.editingTask.id, {
    date: state.date,
    subject: state.editingTask.subject,
    stage: state.editingTask.stage,
    content: state.editingTask.content,
    actual: form.get("actual").trim(),
    minutes,
    memo: form.get("memo").trim(),
    done: form.get("done") === "on",
  });
  closeEditor();
}

function resetDemoData() {
  if (!confirm("현재 브라우저에 저장된 공부 기록을 초기화할까요?")) return;
  state.records = {};
  saveRecords();
  render();
}

function renderLogin() {
  app.innerHTML = `
    <main class="login">
      <div class="login-panel">
        <section class="login-hero">
          <div class="brand">
            <div class="brand-mark">S</div>
            <div>
              <h1>시험 준비 관리</h1>
              <p>2026년 7월 기말 대비</p>
            </div>
          </div>
          <h1>회독, 문제풀이, 족보까지 오늘 할 일을 바로 확인합니다.</h1>
          <p>암기과목은 교과서 3회독 후 자습서와 기본 유형, 마지막 족보 3회까지 기록합니다. 수학은 과외와 예제, 종합 문제, 족보 풀이 흐름으로 관리합니다.</p>
          <div class="mini-board" aria-hidden="true">
            <div><strong>국어</strong><span>교과서 1회독</span><b>D-23</b></div>
            <div><strong>수학</strong><span>교과서 예제</span><b>D-24</b></div>
            <div><strong>과학</strong><span>교과서 1회독</span><b>D-24</b></div>
          </div>
        </section>
        <section class="card login-card">
          <p class="eyebrow">아이디 선택</p>
          <h2>오늘 공부를 시작할 아이를 선택하세요</h2>
          <div class="login-options">
            ${STUDENTS.map(
              (student) => `
                <button type="button" onclick="login('${student.id}')">
                  <span>${student.name}</span>
                  <span>${student.id}</span>
                </button>
              `,
            ).join("")}
          </div>
        </section>
      </div>
    </main>
  `;
}

function renderShell(content) {
  const navItems = [
    ["today", "home", "오늘 공부"],
    ["dashboard", "chart", "대시보드"],
    ["subjects", "book", "과목 상세"],
  ];

  app.innerHTML = `
    <div class="app-shell">
      <aside class="side">
        <div class="brand">
          <div class="brand-mark">S</div>
          <div>
            <h1>시험 준비 관리</h1>
            <p>${studentName()} · ${state.selectedStudent}</p>
          </div>
        </div>
        <div class="student-switch">
          ${STUDENTS.map(
            (student) => `
              <button class="${student.id === state.selectedStudent ? "active" : ""}" type="button" onclick="login('${student.id}')">
                ${student.name}
              </button>
            `,
          ).join("")}
        </div>
        <nav class="nav">
          ${navItems
            .map(
              ([view, iconName, label]) => `
                <button class="${state.view === view ? "active" : ""}" type="button" onclick="showView('${view}')">
                  ${icon(iconName)} <span>${label}</span>
                </button>
              `,
            )
            .join("")}
        </nav>
        <div class="side-footer">
          암기과목 3회독, 자습서, 기본 유형, 족보 3회를 시험 전까지 추적합니다.
        </div>
      </aside>
      <main class="main">${content}</main>
    </div>
    ${state.editingTask ? renderModal() : ""}
  `;
}

function topbar(title, helper, actions = "") {
  return `
    <header class="topbar">
      <div>
        <p class="eyebrow">${studentName()} · ${state.selectedStudent}</p>
        <h2>${title}</h2>
        <small>${helper}</small>
        ${renderStudentTabs()}
      </div>
      ${actions ? `<div class="actions">${actions}</div>` : ""}
    </header>
  `;
}

function renderToday() {
  const tasks = defaultTasks(state.date);
  const done = tasks.filter((task) => getRecord(task.id).done).length;
  const minutes = tasks.reduce((sum, task) => sum + Number(getRecord(task.id).minutes || 0), 0);
  const rate = Math.round((done / tasks.length) * 100);

  renderShell(`
    ${topbar(
      `${koreanDate(state.date)} 오늘 공부`,
      "계획을 완료 처리하고 실제 공부 내용과 소요 시간을 기록하세요.",
      `
        <div class="date-select">
          <input type="date" min="${TODAY}" max="2026-07-08" value="${state.date}" onchange="setDate(this.value)" />
        </div>
        <button class="ghost" type="button" onclick="resetDemoData()" title="기록 초기화">${icon("refresh")}초기화</button>
      `,
    )}
    <section class="grid stats">
      <article class="card stat"><span>오늘 완료율</span><strong>${rate}%</strong><small>${done}/${tasks.length}개 완료</small></article>
      <article class="card stat"><span>실제 공부 시간</span><strong>${minutes}분</strong><small>아이 또는 부모 입력 기준</small></article>
      <article class="card stat"><span>국영사 시험</span><strong>D-${dateDiff(state.date, "2026-07-07")}</strong><small>2026-07-07</small></article>
      <article class="card stat"><span>수학/과학 시험</span><strong>D-${dateDiff(state.date, "2026-07-08")}</strong><small>2026-07-08</small></article>
    </section>
    <section class="grid two" style="margin-top:16px">
      <div class="card section">
        <div class="section-head">
          <h3>오늘 계획</h3>
          <span class="status-pill ${rate === 100 ? "done" : ""}">${rate === 100 ? "완료" : "진행중"}</span>
        </div>
        <div class="task-list">
          ${tasks.map(renderTask).join("")}
        </div>
      </div>
      <aside class="card section">
        <div class="section-head"><h3>시험 일정</h3>${icon("calendar")}</div>
        <div class="timeline">
          <div class="timeline-item"><strong>7/7 화</strong><p>1교시 국어, 2교시 영어, 3교시 사회</p></div>
          <div class="timeline-item"><strong>7/8 수</strong><p>1교시 수학, 2교시 자습, 3교시 과학</p></div>
        </div>
      </aside>
    </section>
  `);
}

function renderTask(task) {
  const record = getRecord(task.id);
  return `
    <article class="task ${record.done ? "done" : ""}">
      <div>
        <div class="task-title">
          <span class="subject-pill">${task.subject}</span>
          <span class="stage-pill">${task.stage}</span>
          <span class="status-pill ${record.done ? "done" : ""}">${record.done ? "완료" : "대기"}</span>
        </div>
        <p>${task.content}</p>
        <small>권장 ${task.targetMinutes}분 · ${SUBJECTS[task.subject].range}</small>
        ${record.actual ? `<small><strong>실제:</strong> ${escapeHtml(record.actual)}</small>` : ""}
      </div>
      <div class="task-controls">
        <button class="primary" type="button" onclick="setRecord('${task.id}', { done: ${!record.done}, date: '${state.date}', subject: '${task.subject}', stage: '${task.stage}', content: '${escapeAttr(task.content)}' })">
          ${icon("check")}${record.done ? "취소" : "완료"}
        </button>
        <button class="ghost" type="button" onclick="openEditor('${task.id}')">${icon("edit")}기록</button>
      </div>
    </article>
  `;
}

function renderDashboard() {
  const subjectProgress = progressBySubject(state.selectedStudent);
  const records = allStudentRecords(state.selectedStudent);
  const totalMinutes = records.reduce((sum, record) => sum + Number(record.minutes || 0), 0);
  const doneCount = records.filter((record) => record.done).length;
  const avg = subjectProgress.length
    ? Math.round(subjectProgress.reduce((sum, item) => sum + item.rate, 0) / subjectProgress.length)
    : 0;

  renderShell(`
    ${topbar(
      "시험 대비 대시보드",
      "과목별 진행률과 루틴 단계 완료 상태를 부모 관점에서 확인합니다.",
      `<button class="ghost" type="button" onclick="showView('today')">${icon("home")}오늘 공부</button>`,
    )}
    <section class="grid stats">
      <article class="card stat"><span>전체 진행률</span><strong>${avg}%</strong><small>과목별 평균</small></article>
      <article class="card stat"><span>완료 기록</span><strong>${doneCount}개</strong><small>현재 브라우저 저장</small></article>
      <article class="card stat"><span>누적 공부 시간</span><strong>${totalMinutes}분</strong><small>입력된 시간 합계</small></article>
      <article class="card stat"><span>남은 시험</span><strong>5과목</strong><small>국어, 영어, 사회, 수학, 과학</small></article>
    </section>
    <section class="card section" style="margin-top:16px">
      <div class="section-head"><h3>과목별 진행률</h3></div>
      <div class="progress-row">
        ${subjectProgress
          .map(
            (item) => `
              <div class="progress-item">
                <div class="progress-label"><span>${item.subject}</span><span>${item.rate}% · ${item.done}/${item.total}</span></div>
                <div class="bar"><span style="width:${item.rate}%"></span></div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
    <section class="card section" style="margin-top:16px">
      <div class="section-head"><h3>시험 전 운영 구간</h3></div>
      <div class="timeline">
        ${PLAN_WINDOWS.map(
          (item) => {
            const range = compactRange(item.start, item.end);
            return `
            <div class="timeline-item">
              <strong><span>${range.dates}</span><small>${range.days}</small></strong>
              <p>암기과목: ${item.stage} · 수학: ${item.math}</p>
            </div>
          `;
          },
        ).join("")}
      </div>
    </section>
  `);
}

function renderSubjects() {
  renderShell(`
    ${topbar(
      "과목 상세",
      "시험 범위와 루틴 단계가 어디까지 완료됐는지 확인합니다.",
      `<button class="ghost" type="button" onclick="showView('dashboard')">${icon("chart")}대시보드</button>`,
    )}
    <section class="card subjects">
      ${Object.keys(SUBJECTS)
        .map((subject) => {
          const subjectInfo = SUBJECTS[subject];
          const progress = stageProgress(state.selectedStudent, subject);
          const done = progress.filter((item) => item.done).length;
          const rate = Math.round((done / progress.length) * 100);
          return `
            <article class="subject-card">
              <header>
                <h3>${subject}</h3>
                <span class="subject-pill" style="background:${subjectInfo.color}22;color:${subjectInfo.color}">D-${dateDiff(state.date, subjectInfo.examDate)}</span>
              </header>
              <p>${subjectInfo.range}</p>
              <div class="bar"><span style="width:${rate}%"></span></div>
              <div class="stage-list">
                ${progress
                  .map(
                    (item) => `
                      <div class="stage-line">
                        <span class="check-dot ${item.done ? "done" : ""}">${item.done ? "✓" : ""}</span>
                        <span>${item.stage}</span>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </article>
          `;
        })
        .join("")}
    </section>
  `);
}

function renderModal() {
  const record = getRecord(state.editingTask.id);
  return `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <section class="card section modal">
        <div class="section-head">
          <h3>${state.editingTask.subject} 기록</h3>
          <button class="icon-button" type="button" onclick="closeEditor()" title="닫기">${icon("x")}</button>
        </div>
        <form class="form-grid" onsubmit="saveEditor(event)">
          <div class="field">
            <label>단계</label>
            <input value="${state.editingTask.stage}" readonly />
          </div>
          <div class="field">
            <label>소요 시간</label>
            <input name="minutes" type="number" min="0" step="1" inputmode="numeric" value="${record.minutes || state.editingTask.targetMinutes}" />
          </div>
          <div class="field full">
            <label>계획 내용</label>
            <textarea readonly>${state.editingTask.content}</textarea>
          </div>
          <div class="field full">
            <label>실제 공부 내용</label>
            <textarea name="actual" placeholder="예: p14~p31까지 읽음. 비유법이 헷갈림.">${record.actual || ""}</textarea>
          </div>
          <div class="field full">
            <label>부모 메모</label>
            <textarea name="memo" placeholder="예: 내일 같은 범위에서 핵심 개념 다시 확인">${record.memo || ""}</textarea>
          </div>
          <label class="field full" style="display:flex;align-items:center;gap:8px;grid-template-columns:auto 1fr">
            <input name="done" type="checkbox" ${record.done ? "checked" : ""} style="width:18px;min-height:18px" />
            완료 처리
          </label>
          <div class="field full">
            <button class="primary submit-button" type="submit">저장</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function render() {
  if (!state.selectedStudent) {
    renderLogin();
    return;
  }
  if (state.view === "dashboard") renderDashboard();
  else if (state.view === "subjects") renderSubjects();
  else renderToday();
}

window.login = login;
window.showView = showView;
window.setDate = setDate;
window.setRecord = setRecord;
window.openEditor = openEditor;
window.closeEditor = closeEditor;
window.saveEditor = saveEditor;
window.resetDemoData = resetDemoData;

render();
