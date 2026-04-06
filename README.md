# MoaMoa
> KB IT's Your Life 7기 25회차 7조 Skeleton Project (2026.04.07~2026.04.13)


## 🧭 Git convention

### 브랜치 전략
**Git Flow**
<img width="2911" height="1795" alt="Image" src="https://github.com/user-attachments/assets/1c988766-d0b1-4419-9391-ec16f5634afc" />

- **main**: 배포/운영 브랜치
- **develop**: 기능 통합 브랜치
- **feature**: 기능 개발 브랜치
  - 네이밍 규칙: `feat/{issue-number}-{description}`
  - ex) `feat/4-dashboard-chart`

### 작업 흐름
1. 작업 단위로 Issue 생성
2. develop 브랜치에서 분기한 작업 브랜치 생성
3. 생성한 브랜치에서 작업 진행
4. 작업 완료 후 기능 브랜치에 push → develop 브랜치로 Pull Request 생성
5. 최소 1명 이상 PR 승인 및 코드 리뷰 코멘트 → PR 생성자가 merge
6. 개발 완료 후 배포 가능한 상태의 develop 브랜치 코드 → main 브랜치로 PR merge

### Issue Title
`[type] 이슈 제목`
```
[feat] 거래 내역 조회 구현
```

### PR Title
`[type] #{이슈번호} PR 제목`
```
[fix] #35 거래 내역 필터 수정
```

### Commit Message
`type: #{issue-number} {commit title}`
```
feat: #12 수입 기록 삭제 기능 구현
```

#### commit type
| Type | 의미 | 사용 예시 |
| :--- | :--- | :--- |
| **feat** | 새로운 기능 추가 | `feat: #10 수입/지출 내역 등록 폼 UI 구현` |
| **fix** | 버그 수정 | `fix: #22 db.json 날짜 데이터 타입 불일치 수정` |
| **docs** | 문서 수정 | `docs: #2 README.md에 json-server 실행 방법 추가` |
| **style** | 코드 스타일 변경 (로직 영향 없음) | `style: #5 가계부 리스트 카드 컴포넌트 CSS 정렬` |
| **refactor** | 코드 리팩토링 (기능 변경 없음) | `refactor: #15 Axios instance를 이용한 API 공통화` |
| **test** | 테스트 코드 추가/수정 | `test: #30 Pinia 지출 내역 합계 계산 로직 단위 테스트` |
| **chore** | 빌드/설정/기타 작업 | `chore: #3 axios, pinia-plugin-persistedstate 설치` |
| **design** | UI/UX 디자인 변경 | `design: #12 메인 컬러 차트 테마 변경 (Dark mode)` |
| **comment** | 주석 추가/수정 | `comment: #18 복잡한 정기 구독 자동 결제 로직 주석 추가` |
| **rename** | 파일/폴더명 변경 | `rename: #7 TransactionList.vue → HistoryList.vue` |
| **remove** | 파일/코드 삭제 | `remove: #4 사용하지 않는 샘플 이미지 및 더미 데이터 삭제` |
| **init** | 프로젝트 초기 세팅 | `init: #1 Vue 3 + Vite + json-server 초기 환경 구축` |
| **merge** | 병합 | `merge: #8 메인 색상 변수 중복 정의 충돌 해결` |
| **!BREAKING CHANGE** | 하위 호환 불가 변경 | `!BREAKING CHANGE: #20 db.json 내 category 필드 구조 변경` |
| **!HOTFIX** | 운영 긴급 수정 | `!HOTFIX: #45 메인 화면 잔액 렌더링 무한 루프 긴급 수정` |
