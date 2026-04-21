# 데이터 모델

## 타입 정의

```ts
type ThemeColor = 'violet' | 'blue' | 'green' | 'orange' | 'rose' | 'slate'

type ColorScheme = 'light' | 'dark'

type User = {
  id: string
  name: string
  avatar: string        // 선택 가능한 아바타 목록 중 하나
  themeColor: ThemeColor
  colorScheme: ColorScheme
}

type Team = {
  id: string
  name: string
  memberIds: string[]   // 팀원 userId 배열
  inviteCode?: string   // 초대 코드 (Firestore 저장)
  creatorId?: string    // 팀 생성자 userId (관리자 판별용)
}

type MatrixPosition = 'do' | 'schedule' | 'delegate' | 'eliminate'

type TaskStatus = 'todo' | 'done'

type Task = {
  id: string
  teamId: string
  weekKey: string       // 예: '2026-W16'
  title: string
  description: string
  assigneeId: string
  deadline: string      // ISO date string
  status: TaskStatus
  matrixPosition: MatrixPosition | null  // null이면 사이드바에 있음
  // createdAt: Timestamp (Firestore 저장용, 클라이언트 타입에서 제외)
}

type WeekPage = {
  teamId: string
  weekKey: string
}

// 실시간 커서 데이터 (RTDB: cursors/{teamId}/{userId})
type CursorData = {
  teamId: string
  userId: string
  name: string
  avatar: string
  x: number    // 뷰포트 너비 기준 % (0–100)
  y: number    // 뷰포트 높이 기준 % (0–100)
  updatedAt: number  // epoch ms
}
```

## Firestore 컬렉션 구조

### `teams`
| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 팀 이름 |
| memberIds | string[] | 팀원 userId 배열 |
| inviteCode | string | 초대 코드 |
| creatorId | string | 생성자 userId |
| createdAt | Timestamp | 생성 시각 |

### `tasks`
| 필드 | 타입 | 설명 |
|------|------|------|
| teamId | string | 소속 팀 ID |
| weekKey | string | ISO 주차 키 |
| title | string | 태스크 제목 |
| description | string | 설명 |
| assigneeId | string | 담당자 userId |
| deadline | string | 마감일 |
| status | 'todo' \| 'done' | 완료 여부 |
| matrixPosition | MatrixPosition \| null | 사분면 위치 |
| createdAt | Timestamp | 생성 시각 (정렬 기준) |

## 주차 이동 규칙

- `status: 'todo'` + 현재 주차 종료 → 다음 `weekKey`로 자동 이동
- `status: 'done'` → 해당 주차에 고정, 이동 없음
- 이전 주차 페이지는 **읽기 전용**

## weekKey 포맷

- ISO week 기준: `YYYY-WNN`
- 화면 표시: `20XX년 X월 X주차` (자동 변환)
