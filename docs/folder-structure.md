# 폴더 구조

```
messages/
  ko.json                   # 한국어 메시지 (기본)
  en.json                   # 영어 메시지

src/
  app/
    page.tsx                  # / 랜딩 페이지
    layout.tsx                # 루트 레이아웃 (MockAuthProvider, ThemeApplier)
    globals.css               # 전역 스타일 + 테마 CSS 변수
    team/
      [id]/
        page.tsx              # /team/:id 팀 페이지 (드래그앤드롭, 실시간 동기화)
    my/
      page.tsx                # /my 마이페이지 (프로필, 테마, 팀 관리)
    join/
      page.tsx                # /join 초대 링크 입력 페이지
      [code]/
        page.tsx              # /join/:code 초대 코드로 팀 참가

  components/
    layout/
      LanguageSelector.tsx  # 언어 선택기 (ko/en, Queue 18)
      Header.tsx              # 공통 헤더 (로고, 검색, 프로필)
    home/                     # 랜딩 페이지 섹션 컴포넌트
      HeroSection.tsx
      ActiveTeamsSection.tsx
      EisenhowerLogicSection.tsx
      NewTeamModal.tsx
    team/                     # 팀 페이지 컴포넌트
      TeamHeader.tsx
      TaskSidebar.tsx / DroppableTaskSidebar.tsx
      TaskCard.tsx / DraggableTaskCard.tsx
      TaskForm.tsx
      MatrixCanvas.tsx / DndMatrixCanvas.tsx
      MatrixTaskCard.tsx / DraggableMatrixTaskCard.tsx
      DroppableQuadrant.tsx
      OnlineUsersBar.tsx
      CursorOverlay.tsx         # 실시간 타인 커서 오버레이 (이름 태그 포함)
      PreviousWeekModal.tsx
    my/                       # 마이페이지 컴포넌트
      DisplayNameForm.tsx
      AvatarSelector.tsx
      ThemeColorSelector.tsx
      ColorSchemeSelector.tsx
      TeamManagement.tsx
    ThemeApplier.tsx          # themeColor/colorScheme → <html> 속성 주입
    ui/                       # shadcn/ui 자동 생성 컴포넌트

  i18n/
    routing.ts              # locales, defaultLocale 상수
    request.ts              # getRequestConfig (쿠키 기반 locale)
  middleware.ts             # next-intl locale 감지 미들웨어

  hooks/
    useRealtimeTasks.ts       # Firestore onSnapshot → Zustand 동기화
    usePresence.ts            # 팀 페이지 접속 유저 presence
    useCursor.ts              # 마우스 위치 추적 + Firebase 동기화 (50ms 쓰로틀)
    useMyTeams.ts             # 현재 유저의 팀 목록 조회

  lib/
    firebase/
      config.ts               # Firebase 초기화
      teamRepository.ts       # 팀 CRUD (createTeam, getTeam, deleteTeam, leaveTeam 등)
      taskRepository.ts       # 태스크 CRUD + onSnapshot 구독
      presenceRepository.ts   # presence 상태 관리
      cursorRepository.ts     # 실시간 커서 위치 저장/구독 (cursors 컬렉션)
      converters.ts           # Firestore ↔ 타입 변환
    utils/
      week.ts                 # weekKey 계산, 변환, 이전 주차 목록
      dnd.ts                  # 드래그앤드롭 상태 전이 (applyDragEnd)
      taskMigration.ts        # 미완료 태스크 다음 주차 이동
      presence.ts             # presence 순수 함수 (Firebase 의존 없음)
    mock-auth.tsx             # MockAuthProvider, useAuth
    mock-data.ts              # MOCK_USERS, MOCK_TASKS, AVATARS 등

  stores/
    taskStore.ts              # Zustand 태스크 스토어

  types/
    index.ts                  # 공통 타입 정의 (User, Team, Task 등)

  __tests__/
    components/               # 컴포넌트 인터랙션 테스트
    lib/utils/                # 유틸 함수 단위 테스트
    stores/                   # Zustand 스토어 테스트

firestore.indexes.json        # Firestore 복합 인덱스 정의
firebase.json                 # Firebase CLI 설정
```
