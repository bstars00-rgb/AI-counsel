# 03 · 데이터 모델 + API 명세

## 3.1 TypeScript 타입 정의

소스: [`lib/types.ts`](../lib/types.ts)

### 3.1.1 12 시진

```ts
export type BirthHour =
  | "자시" | "축시" | "인시" | "묘시" | "진시" | "사시"
  | "오시" | "미시" | "신시" | "유시" | "술시" | "해시"
  | "모름";

export interface BirthHourOption {
  value: BirthHour;
  label: string;   // "자시 (子時)"
  range: string;   // "23:00 - 01:00"
}

export const BIRTH_HOUR_OPTIONS: BirthHourOption[];
```

| 시진 | 시간대 | 한자 |
|---|---|---|
| 자시 | 23:00 - 01:00 | 子時 |
| 축시 | 01:00 - 03:00 | 丑時 |
| 인시 | 03:00 - 05:00 | 寅時 |
| 묘시 | 05:00 - 07:00 | 卯時 |
| 진시 | 07:00 - 09:00 | 辰時 |
| 사시 | 09:00 - 11:00 | 巳時 |
| 오시 | 11:00 - 13:00 | 午時 |
| 미시 | 13:00 - 15:00 | 未時 |
| 신시 | 15:00 - 17:00 | 申時 |
| 유시 | 17:00 - 19:00 | 酉時 |
| 술시 | 19:00 - 21:00 | 戌時 |
| 해시 | 21:00 - 23:00 | 亥時 |
| 모름 | — | — |

### 3.1.2 입력

```ts
export interface FortuneInput {
  name: string;        // 1~40자
  birthdate: string;   // "YYYY-MM-DD" (1900-01-01 ~ 오늘)
  birthtime: BirthHour;
}
```

### 3.1.3 응답

```ts
export interface FortuneResponse {
  name: string;
  headline: string;             // 인스타 공유 헤드라인 (15~30자)
  overall_score: number;        // 1~5
  fortune_summary: string;      // 2~3문장
  saju_keywords: string[];      // 3~4개 (예: ["불의 기운", "따뜻한 인연"])
  categories: FortuneCategory[];   // 항상 4개

  recommended_destination: {
    country: string;            // "일본" | "한국" | "베트남"
    city: string;               // 25개 도시 중 하나
    vibe: string;
    match_score: number;        // 1~5
    reason: string;             // 사주 → 도시 연결 1~2문장
    best_period: string;
    travel_tip: string;
    hidden_gem: string;
  };

  recommended_hotels: {
    rank: number;               // 국가 전체 순위 (UI에는 도시 내 순서로 표시)
    code: string;
    name: string;
    city: string;
    address: string;
    country: "jp" | "kr" | "vn";
  }[];                          // 0~3개

  lucky: {
    color: string;
    time: string;
    number: string;
  };
  closing_message: string;
}

export interface FortuneCategory {
  label: "여행운" | "재물운" | "인연운" | "건강운";
  score: number;     // 1~5
  message: string;
}
```

## 3.2 JSON 스키마 (Claude API structured outputs)

소스: [`lib/prompts.ts`](../lib/prompts.ts) `FORTUNE_RESPONSE_SCHEMA`

전체 스키마는 `additionalProperties: false` 로 strict 모드. Claude가 정확히 이 스키마 그대로 응답하도록 강제.

### 3.2.1 enum 강제 필드

| 필드 | enum |
|---|---|
| `recommended_destination.country` | `["일본", "한국", "베트남"]` |
| `recommended_destination.city` | 25개 도시 (자세한 풀은 § 5 참조) |
| `categories[].label` | `["여행운", "재물운", "인연운", "건강운"]` |

### 3.2.2 길이 제약

| 필드 | 최소 | 최대 |
|---|---|---|
| `saju_keywords` (배열) | 3 | 4 |
| `categories` (배열) | 4 | 4 |
| `overall_score` / `score` / `match_score` | 1 | 5 |

### 3.2.3 Claude에게 채우지 않게 한 필드

`recommended_hotels` 는 스키마에 포함되어 있지만 시스템 프롬프트에서 "빈 배열로 두라" 고 안내. **서버가 응답 후 도시명으로 호텔 풀에서 자동 채움**. (Claude 컨텍스트에 호텔 데이터를 보내지 않아 토큰 절감)

## 3.3 API 명세

### 3.3.1 `POST /api/fortune`

**Endpoint**: `/api/fortune` (Next.js API Route, `app/api/fortune/route.ts`)

**Runtime**: Node.js (Edge 아님, `runtime = "nodejs"`)

**Method**: `POST`

**Content-Type**: `application/json`

#### Request Body

```json
{
  "name": "김민지",
  "birthdate": "1992-08-15",
  "birthtime": "오시"
}
```

| 필드 | 타입 | 검증 |
|---|---|---|
| `name` | string | 1 ~ 40자, trim 후 비공백 |
| `birthdate` | string | `/^\d{4}-\d{2}-\d{2}$/`, 1900~오늘 |
| `birthtime` | string | 12 시진 라벨 또는 `"모름"` |

#### 200 OK Response

```json
{
  "mode": "live",          // "live" | "mock" | "mock-fallback"
  "data": {
    "name": "김민지",
    "headline": "...",
    "overall_score": 4,
    "fortune_summary": "...",
    "saju_keywords": ["불의 기운", "따뜻한 인연", "밝은 흐름"],
    "categories": [
      { "label": "여행운", "score": 5, "message": "..." },
      { "label": "재물운", "score": 4, "message": "..." },
      { "label": "인연운", "score": 4, "message": "..." },
      { "label": "건강운", "score": 5, "message": "..." }
    ],
    "recommended_destination": {
      "country": "일본",
      "city": "도쿄",
      "vibe": "도시 & 쇼핑",
      "match_score": 5,
      "reason": "...",
      "best_period": "3월~5월, 9월~11월",
      "travel_tip": "...",
      "hidden_gem": "..."
    },
    "recommended_hotels": [
      {
        "rank": 2,
        "code": "581662",
        "name": "ICI HOTEL Tokyo Hatchobori",
        "city": "Tokyo",
        "address": "3-26-11 Hachobori, Chuo-ku",
        "country": "jp"
      }
    ],
    "lucky": {
      "color": "코랄",
      "time": "오후 2시 ~ 4시",
      "number": "7"
    },
    "closing_message": "..."
  }
}
```

| `mode` 값 | 의미 |
|---|---|
| `live` | Claude API 정상 호출, 실 응답 |
| `mock` | `ANTHROPIC_API_KEY` 가 비어있거나 `USE_MOCK=true` 일 때 Mock 응답 |
| `mock-fallback` | Claude API 호출 실패 → 자동으로 Mock 응답 반환 (현장 운영 중단 방지). `error` 필드에 실제 에러 메시지 포함 |

#### 4xx Error Response

```json
{ "error": "이름을 1~40자 사이로 입력해주세요." }
```

| 상태 | 상황 |
|---|---|
| 400 | JSON 본문 파싱 실패 |
| 400 | `name` 비어있거나 길이 초과 |
| 400 | `birthdate` 형식/범위 위반 |
| 400 | `birthtime` 12 시진 또는 "모름" 외 값 |

#### 처리 순서

```
1. JSON 본문 파싱
2. 입력 검증 (name, birthdate, birthtime)
3. Mock 모드인가? (USE_MOCK=true or API key 없음)
   ├─ Yes → buildMockFortune(input) 반환
   └─ No → Claude API 호출
4. Claude messages.create(
       model = ANTHROPIC_MODEL (기본: claude-opus-4-7),
       system = FORTUNE_SYSTEM_PROMPT (cache_control: ephemeral),
       output_config.format = json_schema (FORTUNE_RESPONSE_SCHEMA),
       messages = [user: 오늘 날짜 + 이름 + 생년월일 + 태어난시]
   )
5. text 블록 → JSON.parse
6. 서버 측 호텔 매칭:
     dest = findDestinationByCity(parsed.recommended_destination.city)
     parsed.recommended_hotels = findHotelsForCities(dest.hotelCities, 3)
7. 응답 반환
```

오류 발생 시 (Claude 호출 실패, JSON 파싱 실패 등) → `mock-fallback` 으로 Mock 응답 + 200 반환. **부스 현장에서 절대 빈 화면이 안 보이도록** 안전망.

### 3.3.2 Mock 동작

소스: [`lib/mockData.ts`](../lib/mockData.ts) `buildMockFortune()`

**결정론적 시드**:
```
seed = djb2Hash(`${name}|${birthdate}|${birthtime}|${YYYY-MM-DD 오늘}`)
```

같은 사람이 같은 날 두 번 누르면 **완전히 동일한 결과**. 다음 날에는 다른 결과.

**의사 코드**:
```
overall = 3..5 (seed)
sTravel, sMoney, sLove, sHealth = 3..5 (seed shifted)
dest = pick(DESTINATIONS, seed)
destScore = 4..5 (살짝 후하게)

vibe = BIRTHHOUR_VIBE[birthtime]      // 시진별 사주 문구
reason = "{name}님의 {vibe.phrase}이라, {city}의 {dest.vibe} 분위기가 잘 어울려요"
keywords = vibe.keywords              // 3개

summary = SUMMARIES[seed] with {vibe} 치환
headline = HEADLINES[seed]
closing = CLOSINGS[seed] with {city} 치환

hotels = findHotelsForCities(dest.hotelCities, 3)
```

자세한 시진 매핑은 [04-ai-prompt.md](./04-ai-prompt.md) §4.2 참조.

## 3.4 클라이언트 호출 예시

### 3.4.1 Next.js (`app/page.tsx`)

```ts
const res = await fetch("/api/fortune", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "김민지",
    birthdate: "1992-08-15",
    birthtime: "오시",
  }),
});
const json = await res.json();
if (!res.ok) throw new Error(json.error);
const result: FortuneResponse = json.data;
```

### 3.4.2 정적 단일 페이지 (`index.html`)

`index.html` 은 **API 호출 없이** 클라이언트 사이드에서 `buildMockFortune()` 동일 로직을 인라인 실행 (Mock 전용).

```js
// index.html 내 인라인 JS
state.result = buildMockFortune(state.input);
```

따라서 GitHub Pages 환경에서는 인터넷이 끊겨도 동작.

## 3.5 데이터 무결성

| 검증 지점 | 위치 |
|---|---|
| 입력 검증 | API route 및 클라이언트 동시 (defense in depth) |
| 응답 스키마 검증 | Claude API `output_config.format` (strict json_schema) |
| 호텔 매칭 | 서버에서 도시명 → `lib/destinations.ts` lookup → `lib/hotels.ts` 호텔 매칭 |
| Mock 폴백 | API 실패 시 200 + Mock 결과 (현장 운영 안정성) |
