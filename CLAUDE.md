# Team Eisenhower Matrix — Claude 참고 문서

## 프로젝트 개요
팀이 함께 할일을 작성하고 아이젠하워 매트릭스로 우선순위를 관리하는 실시간 협업 이슈관리 서비스.

## 참고 문서

| 문서 | 내용 |
|------|------|
| [기술 스택](docs/tech-stack.md) | 사용 라이브러리 및 프레임워크 |
| [데이터 모델](docs/data-model.md) | 타입 정의, weekKey 규칙, 주차 이동 규칙 |
| [폴더 구조](docs/folder-structure.md) | src/ 디렉토리 구성 |
| [큐 계획](docs/queue-plan.md) | Phase 1~2 전체 개발 큐 체크리스트 |
| [요구사항](README.md) | 원본 요구사항 및 페이지별 구성 |

## 핵심 규칙

### 개발 방식
- **고정 데이터 → 가변 데이터** 순서로 제작 (Phase 1 static → Phase 2 Firebase)
- **TDD 채용**: 로직 및 유틸 함수는 테스트 먼저 작성
- **큐 단위**로 작업, 한 큐 완료 후 다음 큐 진행

### 기술 제약
- Next.js 15 App Router 사용
- 반응형 필수 (Tailwind 기준)
- UI 컴포넌트는 shadcn/ui 우선 사용
- 드래그앤드롭은 dnd-kit만 사용
- 상태관리: Phase 1은 Zustand, Phase 2에서 Firebase로 교체

### 인증
- Phase 1: 로컬 Mock 유저 컨텍스트
- Phase 2 마지막: Google OAuth (Firebase Auth)

### 태스크 동작 규칙
- 태스크는 사이드바 또는 매트릭스 사분면 중 하나에만 위치 (중복 없음)
- 드래그 시 사이드바에서 제거 → 매트릭스로 이동
- `status: 'todo'` + 주차 종료 → 다음 weekKey로 자동 이동
- 이전 주차 페이지는 읽기 전용

### 현재 진행 큐
`docs/queue-plan.md` 의 체크리스트 기준으로 진행 상황 확인
