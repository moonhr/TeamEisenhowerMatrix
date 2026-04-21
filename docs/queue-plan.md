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
