# 개발 큐 계획

## Phase 1 — Static (로컬 고정 데이터)

### Queue 0: 프로젝트 셋업
- [x] Next.js 15 + TypeScript 초기화
- [x] shadcn/ui 설정
- [x] dnd-kit 설치
- [x] Jest + React Testing Library 설정
- [x] Zustand 설치
- [x] 폴더 구조 생성
- [x] 공통 타입 정의 (`src/types/`)
- [x] Mock 데이터 파일 작성
- [x] Mock 유저 컨텍스트 (로컬 auth)

### Queue 1: 랜딩 페이지 `/`
- [x] Header (로고, 검색창, 프로필)
- [x] Section1: 환영인사 + New Team 버튼 + 초대 링크로 참가 버튼
- [x] Section2: My Active Teams 카드 그리드 (static)
- [x] Section3: The Team Eisenhower Logic 4장 카드
- [x] TDD: 각 컴포넌트 렌더/인터랙션 테스트

### Queue 2: 마이페이지 `/my`
- [x] 헤더 + 레이아웃
- [x] Display Name 폼
- [x] 아바타 선택 (목록 UI, 선택 상태)
- [x] 팀 관리 카드 (exit/rename/delete 아이콘 — 관리자 여부 분기)
- [x] 테마 컬러 6개 선택
- [x] Light/Dark 모드 선택
- [x] 전체 단일 저장 버튼
- [x] TDD

### Queue 3: 팀 페이지 헤더 + 주차 로직 `/team/:id`
- [x] `20XX년 X월 X주차` 자동 계산 유틸 함수
- [x] 헤더 (팀명, 주차, Invite 버튼, 홈 아이콘)
- [x] Previous Week 버튼
- [x] **주차 계산 로직 TDD 우선** (월말, 연말 엣지케이스 포함)

### Queue 4: 팀 페이지 사이드바
- [x] Task Inbox 헤더
- [x] 태스크 입력 폼 (title, description, assignee, deadline)
- [x] 태스크 카드 컴포넌트
- [x] 태스크 목록 (static mock data)
- [x] TDD: 입력 → 목록 추가 흐름

### Queue 5: 아이젠하워 매트릭스 캔버스
- [x] 4분할 레이아웃 (Do First / Schedule / Delegate / Eliminate)
- [x] 각 사분면 드롭 영역
- [x] static task 카드 배치
- [x] 하단 참가 유저 아바타 바
- [x] TDD: 레이아웃 + 사분면 렌더

### Queue 6: 드래그앤드롭 (dnd-kit)
- [x] 사이드바 태스크 → 매트릭스 사분면 드래그 (핸들 아이콘 방식)
- [x] 드롭 시 사이드바에서 제거, 사분면으로 이동
- [x] 매트릭스 내 사분면 간 이동
- [x] TDD: dnd 상태 전이 테스트

### Queue 7: 태스크 상태 관리 (Zustand)
- [x] 태스크 생성/수정/삭제/완료 토글
- [x] 매트릭스 배치 상태 지속
- [x] `weekKey` 기반 필터링
- [x] 미완료 태스크 → 다음 주 자동 이동 로직
- [x] TDD

---

## Phase 2 — Dynamic (Firebase 연동)

### Queue 8: Firebase 데이터 레이어
- [x] Firestore 컬렉션 설계
- [x] Repository 패턴 구현 (teamRepository, taskRepository)
- [x] Firestore 복합 인덱스 설정 (`firestore.indexes.json`)

### Queue 9: 팀 생성 & 초대
- [x] 팀 생성 플로우
- [x] 초대 링크 생성 및 입장 처리 (`/join/[code]`, `/join`)

### Queue 10: 실시간 동기화
- [x] Firestore onSnapshot 실시간 반영 (`useRealtimeTasks`)
- [x] 접속 중인 유저 presence (`usePresence`)

### Queue 11: 주차 네비게이션 완성
- [x] Previous Week 모달 (이동할 주차 선택)
- [x] 이전 주차 read-only 처리

**보강 목표**
- 헤더의 이전 주차 진입 구조는 유지
- 최근 8주 제한을 제거하고, 원하는 과거 주차를 직접 선택 가능하도록 확장
- 팀별 과거 탐색 가능 범위는 DB에서 먼저 판단
- 현재 주차와 과거 주차 상태를 URL로 동기화하여 새로고침/공유/브라우저 뒤로가기까지 일관되게 동작

**1차 구현 결정**
- 별도 `teamWeeks` 메타 컬렉션은 만들지 않고, `tasks` 컬렉션에서 해당 팀의 가장 오래된 `weekKey`를 조회해 하한선으로 사용
- 선택 가능한 주차 범위는 `earliestWeekKey ~ currentWeekKey`
- 중간에 태스크가 없는 빈 주차도 선택은 허용하고, 진입 후 empty state로 처리
- 현재 주차는 canonical URL `/team/:id`, 과거 주차는 `/team/:id?week=YYYY-WNN`
- 과거 주차는 계속 read-only 유지

**UI/UX 흐름**
- 헤더의 `Previous Week` 버튼 클릭 시 모달 오픈
- 모달 내부는 단일 `Select` + 확인 버튼 구조로 유지
- `Select` 옵션은 DB에서 구한 `earliestWeekKey`부터 현재 주차까지 전체 범위를 생성
- 기본 선택값은 현재 보고 있는 `viewWeekKey`
- 확인 시 선택한 `weekKey`로 이동
- 현재 주차 복귀는 read-only 배너의 CTA 또는 `week` query 제거로 처리

**데이터/상태 흐름**
- `taskRepository.getEarliestWeekKey(teamId)` 추가
- Firestore 쿼리: `where('teamId', '==', teamId)` + `orderBy('weekKey', 'asc')` + `limit(1)`
- 팀 페이지는 로컬 `weekKey` state 대신 URL `searchParams.week`를 source of truth로 사용
- 잘못된 `week` 값 또는 미래 주차는 현재 주차로 fallback
- 현재 주차 선택 시에는 `?week=`를 제거해 canonical URL 유지

**구현 목록**
- [ ] `taskRepository.getEarliestWeekKey(teamId)` 추가
- [ ] `TeamPage` 에 `earliestWeekKey` 로딩 로직 추가
- [ ] `week.ts` 에 `isValidWeekKey`, `compareWeekKeys`, `getWeekRange` 유틸 추가
- [ ] `TeamPage` 의 `weekKey` 로컬 state 제거 후 `searchParams.week` 기반 `viewWeekKey` 도입
- [ ] `PreviousWeekModal` 을 최근 8주 버튼 목록에서 `Select + 확인 버튼` 구조로 변경
- [ ] `PreviousWeekModal` 에 `earliestWeekKey`, `selectedWeekKey` props 연결
- [ ] 현재 주차 복귀 시 `/team/:id` 로 이동하도록 정리
- [ ] 과거 주차 empty state 문구 추가
- [ ] TDD: `earliestWeekKey` 조회, URL query fallback, Select 옵션 범위, read-only 분기 테스트

**보류 사항**
- 실제로 태스크가 존재하는 주차만 정확히 보여줘야 하면 `teamWeeks` 인덱스 컬렉션 도입 검토
- 1차 구현에서는 쿼리 비용과 복잡도를 줄이기 위해 하한선 조회만 수행

### Queue 12: Google 소셜 로그인
- [x] Firebase Auth 연동
- [x] Mock 유저 → 실제 유저 교체

---

## Phase 3 — UX 고도화

### Queue 13: 헤더 검색 기능

**검색 범위**
- 현재 유저가 속한 팀의 태스크 (title, description)
- 현재 유저가 속한 팀 이름

**UX 패턴**
- 검색창 포커스 시 드롭다운 팝오버 표시
- 입력값 기준 debounce(300ms) 후 검색 실행
- 결과는 **Tasks** / **Teams** 섹션으로 구분
- 결과 없을 시 "검색 결과가 없습니다" 표시
- ESC 또는 외부 클릭 시 드롭다운 닫힘

**검색 방식**
- 태스크: Firestore prefix 쿼리 (`>=` / `<=`) — title 기준
- 팀: 이미 로드된 `useMyTeams` 데이터를 클라이언트 필터링

**결과 항목**
- 태스크: 제목 + 팀명 + 주차 → 클릭 시 `/team/:id` 이동
- 팀: 팀 이름 → 클릭 시 `/team/:id` 이동

**구현 목록**
- [x] `useSearch(query)` 훅 — debounce + Firestore 태스크 쿼리 + 팀 필터링
- [x] `SearchDropdown` 컴포넌트 — 결과 목록 UI (Tasks / Teams 섹션)
- [x] `SearchResultItem` 컴포넌트 — 아이콘 + 제목 + 부제목 + 클릭 핸들러
- [x] `Header` 컴포넌트 검색창에 포커스/블러/입력 상태 연결
- [x] `taskRepository`에 `searchTasksByTitle(teamIds, query)` 추가
- [x] TDD: `useSearch` 훅 debounce 및 결과 분기 테스트

### Queue 14: 우선순위 태그

- [x] `PriorityTag` 타입 + `Task.priorityTagId` + `Team.priorityTags` 추가
- [x] 기본 태그 6개 상수 (`src/lib/priority-tags.ts`)
- [x] Firestore 컨버터/레포지토리 업데이트 (toTask, toTeam, updatePriorityTags, updatePriorityTag)
- [x] 팀 생성 시 기본 태그 자동 세팅
- [x] `TaskForm` 태그 선택 드롭다운
- [x] `PriorityTagBadge` 공용 컴포넌트
- [x] `TaskCard` / `MatrixTaskCard` 태그 뱃지 표시
- [x] `PriorityTagManager` 모달 (태그 추가/삭제, 컬러 선택)
- [x] `TeamHeader` 태그 관리 버튼 (Tags 아이콘)
- [x] `TeamPage` 전체 연결 및 태그 저장 핸들러
- [x] TDD: PriorityTagManager 인터랙션 테스트

### Queue 15: 실시간 커서 공유

**목적**  
팀 페이지(/team/:id)에서 동시 접속 중인 팀원의 마우스 위치를 이름 태그로 표시

**동작 방식**
- 마우스 이동 이벤트를 50ms 쓰로틀링 후 RTDB `cursors/{teamId}/{userId}` 에 저장
- 위치값은 뷰포트 비율(%)로 저장 → 화면 크기 차이 무관
- 10초간 미갱신 커서는 stale로 간주하여 화면에서 제거
- 페이지 이탈 시 해당 유저의 커서 문서 즉시 삭제

**구현 목록**
- [x] `cursorRepository.ts` — `updateCursor`, `removeCursor`, `subscribeToCursors`
- [x] `useCursor.ts` — mousemove 감지 + 쓰로틀 + Firebase 동기화 훅
- [x] `CursorOverlay.tsx` — 타인 커서를 화살표 + 이름 태그로 렌더링 (pointer-events: none)
- [x] `TeamPage` 에 `useCursor` 훅 + `CursorOverlay` 통합
- [x] RTDB 스키마 문서화 (`cursors/{teamId}/{userId}`, `presence/{teamId}/{userId}`)

### Queue 16: i18n 기반 셋업

- [ ] `next-intl` v3 설치
- [ ] `src/i18n/routing.ts` — `locales: ['ko', 'en']`, `defaultLocale: 'ko'`
- [ ] `src/i18n/request.ts` — `getRequestConfig` (쿠키 `NEXT_LOCALE` 기반 locale 읽기)
- [ ] `src/middleware.ts` — `createMiddleware` (locale 감지 → 쿠키 세팅, `localePrefix: 'never'`)
- [ ] `messages/ko.json` — 전체 네임스페이스 초기 구조 + 한국어 문자열
- [ ] `messages/en.json` — 전체 네임스페이스 초기 구조 + 영어 문자열
- [ ] `next.config.ts` — `withNextIntl` 래핑
- [ ] `app/layout.tsx` — `NextIntlClientProvider` 주입

### Queue 17: 컴포넌트 문자열 추출

- [ ] `HeroSection` — 인사말, 버튼 텍스트
- [ ] `ActiveTeamsSection` — 섹션 제목, 빈 상태 메시지
- [ ] `EisenhowerLogicSection` — 4가지 분류 설명 카드
- [ ] `Header` — 검색 placeholder, 프로필 메뉴
- [ ] `TaskForm` — placeholder, 레이블, 버튼
- [ ] `TaskCard` / `MatrixTaskCard` — 상태 텍스트, 날짜 포맷
- [ ] `TaskSidebar` / `DroppableTaskSidebar` — 섹션 제목
- [ ] `TeamHeader` — 주차 표기, 버튼 레이블
- [ ] `PreviousWeekModal` — 제목, 안내 문구
- [ ] `PriorityTagManager` — 레이블, 버튼
- [ ] `NewTeamModal` — 제목, 입력 placeholder
- [ ] `TaskEditModal` — 레이블, 버튼
- [ ] `my/*` 전체 (DisplayNameForm, AvatarSelector, ThemeColorSelector, ColorSchemeSelector, TeamManagement)
- [ ] `AuthGuard`, `login/page`, `join/*` — 안내 문구
- [ ] `week.ts` `formatWeekLabel` 함수 locale 파라미터 분기 처리
- [ ] TDD: `formatWeekLabel` ko/en 양 언어 케이스 추가

### Queue 18: 언어 설정 UI

- [ ] `User` 타입에 `locale?: 'ko' | 'en'` 필드 추가
- [ ] `LanguageSelector.tsx` 컴포넌트 (ko/en 라디오 또는 셀렉트)
- [ ] `/my` 페이지에 언어 선택기 섹션 추가
- [ ] `userRepository.updateUserLocale(userId, locale)` 구현
- [ ] 저장 버튼 클릭 시 Firebase + 쿠키(`NEXT_LOCALE`) 동기화
- [ ] TDD: locale 변경 후 쿠키 업데이트 동작 확인

---

## Phase 4 — Deploy (Vercel + Firebase 운영 배포)

**배포 기본 전략**
- Next.js 16 앱은 `static export` 대신 **Node.js 서버 모드**로 배포
- 프론트엔드는 Vercel, 데이터/인증/실시간은 Firebase(Firestore/Auth/RTDB) 유지
- 환경은 최소 `local` / `preview` / `production` 3단계로 분리
- 브랜치 흐름은 `PR -> Preview Deploy`, `main -> Production Deploy` 기준으로 운영

### Queue 19: 배포 인프라 기준선

- [ ] 배포 타겟 확정: `Vercel + Firebase`
- [ ] Vercel 프로젝트 생성 및 Git 저장소 연결
- [ ] Firebase `dev` / `prod` 프로젝트 분리
- [ ] Vercel Environment Variables 등록 (`NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_FIREBASE_DATABASE_URL`)
- [ ] `.env.local.example` 기준 배포용 환경변수 체크리스트 문서화
- [ ] Firebase Auth Authorized Domains 에 Preview / Production 도메인 등록
- [ ] 커스텀 도메인 연결 전략 확정 (`app`, `www` 사용 여부 포함)

### Queue 20: Firebase 운영 보안 설정

- [ ] `firestore.rules` 작성 — 팀 멤버만 `tasks`, `teams` 읽기/쓰기 가능하도록 제한
- [ ] `database.rules.json` 작성 — `presence`, `cursors` 는 본인만 쓰기, 팀 멤버만 읽기
- [ ] `firebase.json` 에 Firestore / RTDB rules 경로 연결
- [ ] `firestore.indexes.json` 와 rules 배포 명령 정리 (`firebase deploy --only firestore,database`)
- [ ] Preview / Production Firebase 프로젝트별 환경변수 매핑 정리
- [ ] Firebase App Check 도입 여부 판단 및 필요 시 적용

### Queue 21: CI/CD 및 배포 게이트

- [ ] `.github/workflows/ci.yml` 생성
- [ ] PR 기준 `npm ci -> npm run lint -> npm test -> npm run build` 파이프라인 구성
- [ ] 실패 시 merge 차단되는 required checks 설정
- [ ] Vercel Preview Deploy 와 PR 상태 체크 연결
- [ ] 배포 전 체크리스트 문서화 (env, auth domain, rules, indexes, build)
- [ ] 운영 배포 runbook 초안 작성 (`docs/deployment.md`)

### Queue 22: 프로덕션 배포 및 운영 검증

- [ ] `main` 브랜치 production auto deploy 연결
- [ ] 최초 배포 후 smoke test: 로그인, 팀 생성, 초대 링크, 태스크 생성, DnD, 실시간 반영, presence / cursor, i18n
- [ ] Vercel 로그 / Firebase 콘솔 기반 장애 확인 플로우 정리
- [ ] 롤백 절차 정리 (Vercel 이전 배포 복구 + Firebase rules 재배포)
- [ ] 배포 후 모니터링 항목 정리 (에러율, Auth 실패, Firestore quota, RTDB 연결 수)
- [ ] 운영 오픈 체크리스트 완료 시점 정의
