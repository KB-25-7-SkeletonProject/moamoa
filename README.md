# MoaMoa
> KB IT's Your Life 7기 25회차 7조 Skeleton Project (2026.04.07~2026.04.13)

## 💸 프로젝트 소개

**모아모아**는 일상 속 수입·지출을 쉽고 빠르게 기록하고, 캘린더·통계·필터 등을 통해 소비 흐름까지 직관적으로 확인할 수 있는 Vue 기반 **가계부 서비스**입니다.

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/2e225a1c-2766-4e84-a3c0-129b4fd3e411" />


### 프로젝트 목적
- 학습 기술의 실전 적용
- 전체 개발 프로세스 경험
- 협업 및 문제 해결 능력 향상

### 주요 기능
- 수입/지출 기록
- 거래 내역 조회
- 월별 재정 요약
- 출석체크, 캘린더, 광고, 엑셀 추출

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/fca99d41-d28e-4028-8bb1-637290ef8bb3" />


## 🫂 팀 소개

<table>

  <!-- 사진 행 -->
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/kimtaehwan8246-del" width="100px" alt="김태환" />
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/orinuguri26" width="100px" alt="강제욱" />
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/yunhacandy" width="100px" alt="박윤하" />
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/yjhss" width="100px" alt="홍유진" />
    </td>
  </tr>

  <!-- 이름 행 (링크 포함) -->
  <tr>
    <td align="center"><a href="https://github.com/kimtaehwan8246-del"><b>김태환(팀장)</b></a></td>
    <td align="center"><a href="https://github.com/orinuguri26 "><b>강제욱</b></a></td>
    <td align="center"><a href="https://github.com/yunhacandy"><b>박윤하</b></a></td>
    <td align="center"><a href="https://github.com/yjhss"><b>홍유진</b></a></td>

  </tr>

  <!-- 역할 상세 행 -->
  <tr>
    <td valign="top" style="width:25%; min-width:25%; padding:8px; text-align:left;">
      - 로그인<br/> - 홈(출석, 광고)<br/>
    </td>
    <td valign="top" style="width:25%; min-width:25%; padding:8px; text-align:left;">
      - 기록 추가/수정/삭제<br/> - 설정(비밀번호 변경, 로그아웃, 엑셀 추출)<br/>
    </td>
    <td valign="top" style="width:25%; min-width:25%; padding:8px; text-align:left;">
      - 통계<br/> - 홈(오늘 기록, 그래프)<br/> - 공통 레이아웃<br/>
    </td>
    <td valign="top" style="width:25%; min-width:25%; padding:8px; text-align:left;">
      - 기록 상세 조회<br/> - 거래 내역 조회<br/> - 공통 컴포넌트<br/>
    </td>
  </tr>

</table>

## 🚀 기술 스택

### Frontend

<p>
  <img src="https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/vite-9135FF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>
  <img src="https://img.shields.io/badge/pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=white"/>
</p>



### Backend

<img src="https://img.shields.io/badge/node.js-5FA04E?style=for-the-badge&logo=node.js&logoColor=white"/>

### DB

<img src="https://img.shields.io/badge/db.json-000000?style=for-the-badge&logo=json&logoColor=white"/>


### Design

<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/>

### Collaboration
<p>
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"/>
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"/>
  <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>
</p>


| 구분 | 기술 | 사용 이유 |
|------|------|----------|
| **Language** | JavaScript (ES6+) | 웹 프론트엔드 생태계 표준으로 개발 접근성이 높고 생산성이 좋음 |
| **Framework** | Vue 3 | 컴포넌트 기반 구조로 재사용성과 유지보수성을 높이기 좋음 |
| **Core Pattern** | Composition API | 로직을 기능 단위로 분리해 확장성과 가독성을 확보하기 좋음 |
| **Routing** | Vue Router | SPA 내 화면 전환과 접근 제어를 일관되게 관리 가능 |
| **State Management** | Pinia | 전역 상태를 단순하고 명확하게 관리하기에 적합 |
| **HTTP Client** | Axios | API 통신을 표준화하고 에러 처리를 일관되게 구성 가능 |
| **Build Tool** | Vite | 빠른 개발 서버와 번들링 성능으로 개발 효율 향상 |
| **Styling** | Scoped CSS + CSS Variables | 스타일 충돌을 줄이고 디자인 일관성을 유지하기 용이 |
| **Backend Runtime** | Node.js | 경량 서버 구성이 쉽고 프론트와 연동 속도가 빠름 |
| **Data Storage** | JSON 파일 기반 저장소 | 초기 단계에서 구조 검증과 기능 구현 속도를 높이기 적합 |
| **Auth Storage** | sessionStorage | 세션 단위 상태 유지에 간단하고 적용이 쉬움 |

## 🏗️ 아키텍처

<img width="455" height="197" alt="Image" src="https://github.com/user-attachments/assets/dc8b1d11-64c6-4b67-8d0b-6c4c71b378f6" />


## 📊 데이터 구조
<img width="364" height="307" alt="Image" src="https://github.com/user-attachments/assets/704fdd0b-4527-4778-94bf-84f5af0cf220" />

```
users: { id, email, password, name, createdAt, updatedAt }
records: { id, userId, type, amount, categoryId, memo, date, createdAt, updatedAt }
categories: { id, name, type }
attendances: { id, userId, date, createdAt }
ads: { id, title, imageUrl, link, createdAt }
```

## 🏛️ 프로젝트 구조

```
moamoa/                               # 프로젝트 루트 (frontend + backend)
├── backend/                          # Node 기반 API 서버
│   ├── server.js                     # 백엔드 엔트리, 라우팅/CRUD 처리
│   ├── db.json                       # 로컬 데이터 저장 파일
│   └── package.json                  # 백엔드 의존성/스크립트
├── frontend/                         # Vue(Vite) 프론트엔드 앱
│   ├── public/                       # 정적 파일
│   │   └── ads/                      # 광고 이미지 리소스
│   ├── src/                          # 프론트 소스 코드
│   │   ├── assets/                   # 이미지/아이콘 등 리소스
│   │   ├── components/               # 재사용 UI 컴포넌트 모음
│   │   │   ├── common/               # 버튼/카드/모달 등 공통 컴포넌트
│   │   │   ├── layout/               # 헤더/네비/공통 레이아웃
│   │   │   ├── dashboard/            # 홈(대시보드) 전용 컴포넌트
│   │   │   ├── statistics/           # 통계 화면 전용 컴포넌트
│   │   │   └── transactions/         # 거래내역 화면 전용 컴포넌트
│   │   ├── constants/                # 카테고리/맵/고정 상수
│   │   ├── pages/                    # 라우팅 단위 페이지 컴포넌트
│   │   ├── router/                   # Vue Router 설정
│   │   ├── services/                 # API 통신 로직(axios 래핑)
│   │   ├── stores/                   # 전역 상태(Pinia)
│   │   ├── utils/                    # 공통 유틸 함수
│   │   ├── App.vue                   # 루트 앱 컴포넌트
│   │   └── main.js                   # 프론트 엔트리 포인트
│   ├── .env                          # 프론트 환경변수
│   ├── jsconfig.json                 # 경로 별칭/IDE 인식 설정
│   ├── package.json                  # 프론트 의존성/스크립트
│   └── vite.config.js                # Vite 빌드/개발 서버 설정
└── README.md                         # 프로젝트 설명 문서

```

## 📌 Git convention

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
