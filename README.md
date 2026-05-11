# 오마이치가 봐주는 사주 여행지

OHMYHOTEL & CO 트래블쇼 부스용 마케팅 미니 웹앱.
방문 고객이 **이름 / 생년월일 / 태어난 시(時)** 만 알려주면, 오마이치 AI가 사주를 가볍게 풀어주고
오늘 어울리는 **여행지 한 곳** 과 그 도시의 **오마이호텔 Top 호텔 3개** 를 골라줍니다.

- 예약/결제/CRM 시스템이 **아닙니다.**
- AI 여행상담 시스템이 **아닙니다.** (이전 버전에서 제거됨)
- **부스 마케팅 전용** 의 단순한 운세 + 호텔 추천 도구입니다.

## 🚀 라이브 데모

- GitHub Pages — https://bstars00-rgb.github.io/AI-counsel/
- `index.html` 단일 파일이라 npm 없이 더블클릭으로도 동작합니다.

## 두 가지 형태

| 파일/디렉토리 | 용도 | 동작 방식 |
|---|---|---|
| `index.html` | **부스 현장 / 이해관계자 데모** | Mock 데이터로만 동작. GitHub Pages 로 자동 배포. API 키 불필요. |
| `app/`, `lib/`, `package.json` 등 | **Next.js 풀스택 (선택)** | Claude API 실제 호출. 더 풍부한 사주 풀이. Vercel/Render 등에 배포. |

## 부스 운영 (이틀 안에 시작하는 가장 빠른 방법)

### 옵션 A — GitHub Pages (가장 단순)

이미 활성화되어 있다면 URL만 열어 두면 끝.

1. https://bstars00-rgb.github.io/AI-counsel/ 접속
2. 부스 PC/태블릿 브라우저를 전체화면(F11) 모드로
3. 인터넷이 끊겨도 동작하도록 페이지를 1회 로드 후 비행기 모드에서도 확인

### 옵션 B — 로컬 파일 (오프라인 부스)

1. `index.html` 파일 하나만 부스 PC에 복사
2. 더블클릭으로 열기 → 끝

### 옵션 C — Next.js 풀스택 (실제 Claude API)

```bash
npm install
cp .env.example .env       # ANTHROPIC_API_KEY 입력 (없으면 Mock)
npm run dev                # http://localhost:3000
# 또는 빌드/프로덕션
npm run build && npm run start
```

## 환경변수 (Next.js 버전만)

| 키 | 설명 | 기본값 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API 키. 비어 있으면 Mock 모드 | (없음) |
| `ANTHROPIC_MODEL` | 사용할 모델 | `claude-opus-4-7` |
| `USE_MOCK` | `true` 면 API 키가 있어도 Mock 강제 사용 | `false` |

## 사용자 흐름

```
[입력] 이름 / 생년월일 / 태어난 시(12 시진 또는 모름)
   ↓
[로딩] 0.7~1.2초
   ↓
[결과] 헤드라인 + 종합 별점 + 사주 키워드
       → 카테고리 4종 (여행운 / 재물운 / 인연운 / 건강운)
       → 오마이치가 사주로 골라준 오늘의 여행지 (나라 + 도시 + 매치 점수 + 이유)
       → 오마이호텔 추천 호텔 TOP 3
       → 행운의 색 / 시간 / 숫자
       → 다른 사주로 다시 보기 / 처음으로
```

## 12 시진 옵션

| 시진 | 시간대 |
|---|---|
| 자시 (子時) | 23:00 - 01:00 |
| 축시 (丑時) | 01:00 - 03:00 |
| 인시 (寅時) | 03:00 - 05:00 |
| 묘시 (卯時) | 05:00 - 07:00 |
| 진시 (辰時) | 07:00 - 09:00 |
| 사시 (巳時) | 09:00 - 11:00 |
| 오시 (午時) | 11:00 - 13:00 |
| 미시 (未時) | 13:00 - 15:00 |
| 신시 (申時) | 15:00 - 17:00 |
| 유시 (酉時) | 17:00 - 19:00 |
| 술시 (戌時) | 19:00 - 21:00 |
| 해시 (亥時) | 21:00 - 23:00 |
| 모름 | 시진 대신 생년월일 위주로 풀이 |

## 추천 여행지 풀 (25개)

| 일본 (8) | 한국 (8) | 베트남 (9) |
|---|---|---|
| 도쿄, 오사카, 교토, 후쿠오카, 삿포로, 오키나와, 고베, 나고야 | 서울, 부산, 제주, 여수, 속초, 강릉, 양양, 경주 | 다낭, 나트랑, 호이안, 푸꾸옥, 하노이, 호치민, 달랏, 무이네, 사파 |

## 호텔 데이터

- 출처: `Hotel data/Hotel Top List - May 2026.xlsx` (오마이호텔 Top 100, 일본/한국/베트남)
- 도시별 상위 5개씩 [lib/hotels.ts](lib/hotels.ts) 에 임베드 (총 118개 / 27 도시)
- 운세 결과의 도시에 자동 매칭 → 상위 3개 호텔 표시

## AI 응답 JSON 구조

```json
{
  "name": "",
  "headline": "",
  "overall_score": 1,
  "fortune_summary": "",
  "saju_keywords": [],
  "categories": [{ "label": "여행운", "score": 4, "message": "" }],
  "recommended_destination": {
    "country": "일본",
    "city": "",
    "vibe": "",
    "match_score": 4,
    "reason": "",
    "best_period": "",
    "travel_tip": "",
    "hidden_gem": ""
  },
  "recommended_hotels": [
    { "rank": 2, "code": "", "name": "", "city": "", "address": "", "country": "vn" }
  ],
  "lucky": { "color": "", "time": "", "number": "" },
  "closing_message": ""
}
```

스키마 정의는 [lib/prompts.ts](lib/prompts.ts), 호텔 매칭은 [lib/destinations.ts](lib/destinations.ts) + [lib/hotels.ts](lib/hotels.ts).

## 파일 구조

```
index.html              ← GitHub Pages 진입점 (Mock 단일 파일, 자체 완결)
Hotel data/             ← 원본 xlsx 호텔 데이터

app/                    ← Next.js 풀스택
  layout.tsx
  page.tsx              ← 입력 → 로딩 → 결과 단일 흐름
  globals.css
  api/fortune/route.ts  ← Claude API 호출 + 호텔 자동 매칭 (서버 측)
lib/
  types.ts              ← FortuneInput / FortuneResponse / 12 시진 옵션
  prompts.ts            ← 사주 풀이 시스템 프롬프트 + JSON 스키마
  destinations.ts       ← 25개 도시 풀 (한국어/영문/호텔 매칭 키)
  hotels.ts             ← 호텔 데이터 + findHotelsForCities()
  mockData.ts           ← buildMockFortune (시드 기반 결정론)
```

## 운영 팁

- **오프라인 대비**: 인터넷 끊김에 대비해 `index.html` 을 USB 에도 백업, 또는 `USE_MOCK=true` 로 점검 후 시연
- **재현성**: 같은 이름·생년월일·시·날짜로는 항상 같은 결과 (Mock 시드 기반)
- **개인정보**: 입력은 메모리에만 머물고 서버 저장 없음. 부스에서 안내 가능
- **다음 손님**: "처음으로" 버튼 한 번으로 깔끔하게 초기화

## 의도적으로 미포함

- 실시간 예약 / 결제
- 호텔/항공 API 연동 (호텔 데이터는 정적 xlsx)
- 고객 DB / CRM / 입력 저장
- AI 여행상담 (이전 버전 제거)
- 관리자 페이지 / KPI / 대시보드
- 복잡한 로그인 / 회원가입
