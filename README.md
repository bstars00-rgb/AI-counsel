# 트래블쇼 AI 여행상담 웹앱

부스 방문 고객이 직접 여행 질문을 입력하면 **AI가 1차 상담 답변**을 제공하고, **상담원이 그 답변을 보고 곧바로 실 상담을 시작**할 수 있도록 돕는 단순한 웹앱입니다.

- 예약/결제/CRM 시스템이 **아닙니다.**
- 호텔/항공 API 연동 시스템이 **아닙니다.**
- **AI 상담 진입 도구**입니다.

## 🚀 GitHub Pages 라이브 데모

**Mock 데이터 기반 프로토타입**이 GitHub Pages 로 배포되어 있습니다.

→ https://bstars00-rgb.github.io/AI-counsel/

`index.html` 단일 파일이라 npm install 없이 더블클릭으로 열어도 동일하게 동작합니다.

## 두 가지 형태

| 파일/디렉토리 | 용도 | 동작 방식 |
|---|---|---|
| `index.html` | **이해관계자 데모 / 시연용 프로토타입** | Mock 데이터로만 동작. GitHub Pages 로 자동 배포됨. API 키 불필요. |
| `app/`, `lib/`, `package.json` 등 | **부스 현장 운영용 Next.js 풀스택** | Claude API 실제 호출. 로컬 `npm run dev` 또는 Vercel/Render 등에 배포. |

## GitHub Pages 배포 절차

이미 `index.html` 이 repo root 에 있으면 다음 절차로 활성화됩니다.

1. GitHub repo 페이지로 이동: https://github.com/bstars00-rgb/AI-counsel
2. **Settings** → 왼쪽 메뉴 **Pages** 클릭
3. **Source** 를 `Deploy from a branch` 로 설정
4. **Branch** 를 `main` / `(root)` 로 선택 후 **Save**
5. 1~2 분 후 https://bstars00-rgb.github.io/AI-counsel/ 에서 접속 가능

### 처음 푸시할 때 명령어

```powershell
# 프로젝트 폴더에서
git init
git branch -M main
git add .
git commit -m "AI 여행상담 프로토타입 + Next.js 앱"
git remote add origin https://github.com/bstars00-rgb/AI-counsel.git
git push -u origin main
```

> 한 번이라도 푸시해본 적이 없다면 GitHub 가 push 시 인증을 요구합니다. 브라우저 로그인 또는 [Personal Access Token](https://github.com/settings/tokens) 을 사용하세요.

이후 수정 사항은:

```powershell
git add .
git commit -m "수정 메시지"
git push
```

## 로컬 실행 (Next.js 풀스택 버전)

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (선택)
cp .env.example .env
# .env 파일 열어서 ANTHROPIC_API_KEY 입력
# 키를 입력하지 않으면 자동으로 Mock 응답 모드로 동작합니다.

# 3. 개발 서버 실행
npm run dev
# → http://localhost:3000

# 4. 빌드 / 프로덕션
npm run build
npm run start
```

부스 현장 PC/태블릿에서는 그냥 `npm run start` 후 브라우저로 `http://localhost:3000` 띄워두면 됩니다.

## 환경변수 (Next.js 버전만)

| 키 | 설명 | 기본값 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API 키. 비어 있으면 Mock 모드 | (없음) |
| `ANTHROPIC_MODEL` | 사용할 모델 | `claude-opus-4-7` |
| `USE_MOCK` | `true` 면 API 키가 있어도 Mock 강제 사용 | `false` |

**비용을 줄이려면** `ANTHROPIC_MODEL=claude-sonnet-4-6` 또는 `claude-haiku-4-5` 로 변경하세요.

## 기능

1. 고객 질문 입력 + 빠른 질문 8개 버튼
2. AI 상담받기 (로딩 표시)
3. 고객용 AI 답변 카드 (7개 섹션)
4. 답변 복사 / 다시 질문하기
5. 상담원 화면 전환 (니즈 분석 / 바로 물어볼 질문 / 시작 멘트 / 메모)
6. 최근 상담 기록 5건 localStorage 저장 + 다시 불러오기
7. 메모 자동 저장

## 사용자 흐름

```
[입력] → [AI 답변 (고객용)] → "상담원과 이어서 상담하기" → [상담원 화면]
   ↑                                                            ↓
   └────────────── "다시 질문하기" ─────────────────────────────┘
```

## 화면 구성

### 첫 화면
- 타이틀 / 부제 / 입력창 (placeholder 포함) / 빠른 질문 8개 / "AI 상담받기" 버튼 / 최근 상담 기록

### AI 답변 화면 (고객용)
1. 고객 질문 요약
2. 추천 여행 방향
3. 추천 일정 또는 여행 스타일
4. 예상 예산대
5. 장점
6. 주의사항
7. 상담원에게 이어서 확인하면 좋은 내용

하단 버튼: 상담원과 이어서 상담하기 / 답변 복사 / 다시 질문하기

### 상담원 화면
1. 고객 질문 원문
2. AI 답변 요약
3. 상담원용 니즈 분석 (목적지/유형/인원/일정/예산/핵심 니즈/미확인 정보/예약 가능성/추천 상담 방향)
4. 바로 물어볼 질문 3~5개
5. 상담 시작 멘트
6. 상담 메모 (자동 localStorage 저장)

## AI 응답 JSON 구조

```json
{
  "customer_question": "",
  "customer_answer": {
    "summary": "",
    "recommendation_direction": "",
    "suggested_itinerary_or_style": "",
    "estimated_budget_range": "",
    "advantages": [],
    "cautions": [],
    "next_message_to_customer": ""
  },
  "staff_summary": {
    "destination_interest": "",
    "travel_type": "",
    "travelers": "",
    "duration": "",
    "budget_hint": "",
    "key_needs": [],
    "missing_information": [],
    "booking_probability": "High | Medium | Low",
    "recommended_consulting_direction": ""
  },
  "staff_questions": [],
  "staff_opening_script": ""
}
```

이 JSON 스키마는 [lib/prompts.ts](lib/prompts.ts) 의 `RESPONSE_SCHEMA` 에 정의되어 있으며, Claude API 의 `output_config.format` (structured outputs) 으로 강제됩니다.

## 파일 구조

```
index.html            ← GitHub Pages 진입점 (Mock 단일 파일 프로토타입)

app/                  ← Next.js 풀스택 앱
  layout.tsx
  page.tsx
  globals.css
  api/consult/
    route.ts          Claude API 호출 + Mock 폴백
lib/
  types.ts            ConsultResponse 등 타입 정의
  prompts.ts          시스템 프롬프트 + JSON 스키마
  mockData.ts         API 없이도 시연 가능한 Mock 응답
```

## 운영 팁

- 부스 현장에서는 **Wi-Fi 끊김에 대비**해 `USE_MOCK=true` 로 한 번 점검 후 시연하세요. (또는 GitHub Pages 버전을 미리 PC 에 저장해두면 오프라인에서도 동작합니다.)
- 메모는 localStorage 에만 저장되므로 브라우저 캐시를 비우면 사라집니다.
- 같은 PC 에서 여러 고객이 사용할 때는 "다시 질문하기" 만 누르면 됩니다 (개인정보는 입력받지 않음).

## 절대 포함하지 않은 기능 (의도적 미포함)

- 실시간 예약 / 결제
- 호텔/항공 API 연동
- 고객 DB / CRM
- 관리자 페이지 / 상품 등록
- 직원 KPI / 대시보드
- 자동 견적서 발송
- 외부 검색엔진 연동
- 복잡한 로그인
