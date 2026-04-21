# Firestore 컬렉션 설계

## users/{userId}

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 표시 이름 |
| avatar | string | 아바타 ID (예: 'avatar-1') |
| themeColor | string | 테마 색상 |

## teams/{teamId}

| 필드 | 타입 | 설명 |
|------|------|------|
| name | string | 팀 이름 |
| memberIds | string[] | 멤버 userId 목록 |
| inviteCode | string | 초대 코드 (랜덤 8자) |
| createdAt | Timestamp | 생성 시각 |

## tasks/{taskId}

| 필드 | 타입 | 설명 |
|------|------|------|
| teamId | string | 소속 팀 ID |
| weekKey | string | 주차 키 (예: '2026-W17') |
| title | string | 태스크 제목 |
| description | string | 설명 |
| assigneeId | string | 담당자 userId |
| deadline | string | 마감기한 (ISO date: 'YYYY-MM-DD') |
| status | 'todo' \| 'done' | 완료 여부 |
| matrixPosition | 'do' \| 'schedule' \| 'delegate' \| 'eliminate' \| null | 매트릭스 위치 (null = 사이드바) |
| createdAt | Timestamp | 생성 시각 |

## 인덱스

| 컬렉션 | 복합 인덱스 | 용도 |
|--------|------------|------|
| tasks | teamId ASC + weekKey ASC | 팀 주차별 태스크 조회 |
| teams | memberIds ARRAY_CONTAINS + createdAt DESC | 사용자 팀 목록 조회 |

## 보안 규칙 (기본)

```
tasks: 해당 teamId의 멤버만 읽기/쓰기
teams: 멤버만 읽기, 생성자만 수정/삭제
users: 본인만 수정
```

---

# Realtime Database 경로 설계

## presence/{teamId}/{userId}

| 필드 | 타입 | 설명 |
|------|------|------|
| teamId | string | 팀 ID |
| userId | string | 유저 ID |
| name | string | 표시 이름 |
| avatar | string | 아바타 ID |
| lastSeen | number | 입장 시각 (epoch ms) |

> `onDisconnect().remove()` — 연결 끊김 시 자동 삭제 (하트비트 불필요)

## cursors/{teamId}/{userId}

| 필드 | 타입 | 설명 |
|------|------|------|
| teamId | string | 팀 ID |
| userId | string | 유저 ID |
| name | string | 표시 이름 |
| avatar | string | 아바타 ID (커서 색상 결정) |
| x | number | 뷰포트 X 위치 (0–100%) |
| y | number | 뷰포트 Y 위치 (0–100%) |
| updatedAt | number | 마지막 갱신 시각 (epoch ms) |

> `onDisconnect().remove()` — 퇴장 시 자동 삭제  
> 10초간 미갱신 시 클라이언트에서 stale 필터링
