# 04 · AI 프롬프트 + 구조화 출력

## 4.1 시스템 프롬프트 (전체)

소스: [`lib/prompts.ts`](../lib/prompts.ts) `FORTUNE_SYSTEM_PROMPT`

```
당신은 오마이호텔 트래블쇼의 AI 도우미 "오마이치 AI(OHMYCHI AI)" 이고,
가벼운 사주(四柱) 풀이로 오늘의 여행지를 추천해주는 마케팅 미니 기능을 수행 중입니다.
캐릭터 컨셉: 선글라스를 쓴 동글동글한 오렌지 마스코트로,
따뜻하고 친근하며 살짝 들뜬 톤입니다.

[목적]
부스 방문 고객이 이름 / 생년월일 / 태어난시(12 시진) 만 입력하면,
오마이치가 사주를 가볍게 풀어주면서 오늘 어울리는 여행지 한 곳과
오마이호텔의 호텔을 골라줍니다.

[톤]
- 따뜻하고 긍정적이며 살짝 시적인 한국어
- 사주는 "가볍게 한 마디" 톤. 진지한 명리학자 풍이 아닌, 마스코트가 풀어주는 다정한 사주
- "~합니다" 보다 "~네요/~할 거예요/~좋겠어요"
- 부정적 단정/저주 금지 (예: "오늘은 운이 나빠요" X, "재물운이 낮아요" X)
- 종교적/정치적 단정 금지
- 이모지 사용 금지 (UI 에서 별/요소로 표현됨)

[사주 풀이 가이드라인 — 가볍게 한 마디 수준만]
- 생년월일과 태어난시(12 시진)로 가볍게 오행 분위기를 잡아본다 (정통 사주팔자 X).
- 천간/지지/오행은 한 두 마디만 자연스럽게
  (예: "불의 기운이 살짝 도는 사주", "묘시 태생이라 새싹 같은 기운").
- "모름" 시진이면 사주 키워드를 시진 대신 생년월일/계절감 위주로 풀어준다.
- saju_keywords 는 3~4개의 짧은 한국어 단어/구.
- 어려운 명리학 용어보다 누구나 이해할 수 있는 시적 표현을 우선.

[추천 도시 풀 — 반드시 이 중에서만 한 곳]
일본: 도쿄, 오사카, 교토, 후쿠오카, 삿포로, 오키나와, 고베, 나고야
한국: 서울, 부산, 제주, 여수, 속초, 강릉, 양양, 경주
베트남: 다낭, 나트랑, 호이안, 푸꾸옥, 하노이, 호치민, 달랏, 무이네, 사파

[작성 원칙]
1. 입력된 이름은 자연스럽게 호명 (예: "민지 님은…").
2. fortune_summary 는 2~3문장. 첫 문장에 사주 분위기 한 마디, 그 다음 오늘 흐름 풀이.
3. recommended_destination.reason 은
   "OO 님의 [사주 분위기/기운] 이 [도시의 분위기/요소] 와 닿아 있어요"
   같은 식으로 사주→도시 연결을 분명히.
4. recommended_destination.city 는 반드시 위 도시 풀의 한국어 라벨 그대로 사용.
   country 는 "일본"/"한국"/"베트남" 중 하나.
5. 점수는 1~5 정수, 평균 3.5~4.5 (마케팅 톤).
6. 카테고리는 정확히 4개: "여행운", "재물운", "인연운", "건강운".
7. lucky 의 색/시간/숫자는 구체적으로
   (색: "코랄"/"민트" 등, 시간: "오후 2시 ~ 4시", 숫자: "7" 또는 "3, 7").
8. closing_message 는 추천한 도시를 한 번 언급하며 오마이치 AI 의 안내로 자연스럽게 마무리.
9. recommended_hotels 필드는 빈 배열로 두거나 무시. 서버에서 자동으로 채웁니다.

[출력 형식]
응답은 반드시 정해진 JSON 스키마 단일 객체.
한국어 본문, JSON 키 영어 유지. JSON 외 다른 텍스트 금지.
```

### 4.1.1 프롬프트 캐싱

```ts
system: [
  {
    type: "text",
    text: FORTUNE_SYSTEM_PROMPT,
    cache_control: { type: "ephemeral" },   // 5분 TTL (Claude prompt caching)
  },
],
```

5분 내 반복 호출 시 시스템 프롬프트 토큰은 캐시 적중 (~90% 비용 절감). 부스 시연 중 다회 호출 시 효과적.

### 4.1.2 모델 선택

- 기본: `claude-opus-4-7` (env `ANTHROPIC_MODEL` 로 override 가능)
- 비용 절감: `claude-sonnet-4-6` 또는 `claude-haiku-4-5` 도 동일 스키마로 작동 (출력 품질 약간 단조로워짐)
- `output_config.format = json_schema` 는 4.6/4.7 family 에서 GA 지원

## 4.2 시진별 사주 매핑 (Mock 전용)

소스: [`lib/mockData.ts`](../lib/mockData.ts) `BIRTHHOUR_VIBE`

Claude API 응답에는 시진을 활용한 사주 멘트가 자동 생성되지만, **Mock 모드**에서는 아래 정적 매핑을 사용합니다.

| 시진 | phrase (사주 분위기) | keywords (3개) |
|---|---|---|
| 자시 | 깊은 밤의 차분한 물 기운이 도는 사주 | 깊은 통찰 · 차분한 흐름 · 물의 기운 |
| 축시 | 단단한 흙의 결을 품은 사주 | 단단한 결심 · 안정된 기반 · 흙의 기운 |
| 인시 | 새벽 나무가 기지개를 켜는 사주 | 새로운 시작 · 푸른 기운 · 도약의 결 |
| 묘시 | 이른 아침 새싹의 풋풋한 사주 | 풋풋한 활기 · 성장의 결 · 맑은 기운 |
| 진시 | 든든한 흙과 햇살이 만나는 사주 | 든든한 결단 · 안정과 도약 · 흙의 기운 |
| 사시 | 한낮을 향해 가는 따뜻한 불의 사주 | 따뜻한 인연 · 밝은 흐름 · 불의 기운 |
| 오시 | 한낮의 활기찬 불 기운이 도는 사주 | 활발한 에너지 · 환한 흐름 · 불의 기운 |
| 미시 | 오후의 부드러운 흙 기운을 품은 사주 | 부드러운 휴식 · 여유로운 결 · 흙의 기운 |
| 신시 | 단단한 쇠의 명료함이 빛나는 사주 | 명료한 판단 · 단정한 결 · 쇠의 기운 |
| 유시 | 노을빛 쇠의 풍성함이 묻어나는 사주 | 풍요로운 만남 · 결실의 결 · 쇠의 기운 |
| 술시 | 저녁 흙이 깊이를 더하는 사주 | 깊은 영감 · 차분한 결단 · 흙의 기운 |
| 해시 | 밤의 고요한 물이 흘러드는 사주 | 조용한 통찰 · 흐르는 직관 · 물의 기운 |
| 모름 | 오늘 흐름이 도드라지는 결 | 오늘의 흐름 · 마음의 신호 · 잔잔한 직관 |

### 4.2.1 오행 분포

- **불(火)**: 사시, 오시 → 활발/따뜻한 톤
- **흙(土)**: 축시, 진시, 미시, 술시 → 안정/단단함
- **나무(木)**: 인시, 묘시 → 시작/성장
- **쇠(金)**: 신시, 유시 → 명료함/풍성함
- **물(水)**: 자시, 해시 → 통찰/직관
- **모름**: 시진 대신 오늘 흐름 키워드

## 4.3 사용자 메시지 템플릿

API 호출 시 user 메시지 본문:

```
오늘 날짜: {YYYY-MM-DD}
이름: {name}
생년월일: {birthdate}
태어난 시(時): {birthtime}

위 정보로 시스템 프롬프트의 규칙에 따라 사주를 가볍게 풀어주고,
어울리는 여행지 한 곳을 추천하는 JSON 을 작성해주세요.
```

오늘 날짜를 명시적으로 전달해 Claude가 계절감/요일감을 반영할 수 있게 함.

## 4.4 JSON 스키마 (개요)

전체 스키마: [`lib/prompts.ts`](../lib/prompts.ts) `FORTUNE_RESPONSE_SCHEMA`

```jsonc
{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "name", "headline", "overall_score", "fortune_summary",
    "saju_keywords", "categories",
    "recommended_destination", "lucky", "closing_message"
  ],
  "properties": {
    "name": { "type": "string" },
    "headline": { "type": "string" },
    "overall_score": { "type": "integer", "minimum": 1, "maximum": 5 },
    "fortune_summary": { "type": "string" },
    "saju_keywords": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 3, "maxItems": 4
    },
    "categories": {
      "type": "array",
      "minItems": 4, "maxItems": 4,
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["label", "score", "message"],
        "properties": {
          "label": {
            "type": "string",
            "enum": ["여행운", "재물운", "인연운", "건강운"]
          },
          "score": { "type": "integer", "minimum": 1, "maximum": 5 },
          "message": { "type": "string" }
        }
      }
    },
    "recommended_destination": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "country", "city", "vibe", "match_score",
        "reason", "best_period", "travel_tip", "hidden_gem"
      ],
      "properties": {
        "country": {
          "type": "string",
          "enum": ["일본", "한국", "베트남"]
        },
        "city": {
          "type": "string",
          "enum": [
            "도쿄","오사카","교토","후쿠오카","삿포로","오키나와","고베","나고야",
            "서울","부산","제주","여수","속초","강릉","양양","경주",
            "다낭","나트랑","호이안","푸꾸옥","하노이","호치민","달랏","무이네","사파"
          ]
        },
        "vibe": { "type": "string" },
        "match_score": { "type": "integer", "minimum": 1, "maximum": 5 },
        "reason": { "type": "string" },
        "best_period": { "type": "string" },
        "travel_tip": { "type": "string" },
        "hidden_gem": { "type": "string" }
      }
    },
    "lucky": {
      "type": "object",
      "additionalProperties": false,
      "required": ["color", "time", "number"],
      "properties": {
        "color": { "type": "string" },
        "time": { "type": "string" },
        "number": { "type": "string" }
      }
    },
    "closing_message": { "type": "string" }
  }
}
```

`recommended_hotels` 는 스키마에 **포함되지 않음** — 서버 후처리.

## 4.5 응답 검증 / 후처리 (서버)

소스: [`app/api/fortune/route.ts`](../app/api/fortune/route.ts)

```ts
// 1. Claude 응답
const textBlock = response.content.find((b) => b.type === "text");
const parsed = JSON.parse(textBlock.text);

// 2. name 누락 시 입력값으로 보강
if (!parsed.name) parsed.name = name;

// 3. 도시명으로 호텔 자동 매칭
const dest = findDestinationByCity(parsed.recommended_destination?.city || "");
parsed.recommended_hotels = dest
  ? findHotelsForCities(dest.hotelCities, 3)
  : [];
```

## 4.6 오류 / 폴백

| 상황 | 처리 |
|---|---|
| Claude API 호출 실패 (네트워크/타임아웃/RateLimit) | catch → `mock-fallback` 모드로 Mock 응답 반환 (200) |
| JSON 파싱 실패 | 동일 — `mock-fallback` |
| 도시명이 풀 외 (이론상 enum으로 강제됨) | `findDestinationByCity` undefined → `recommended_hotels = []` |
| 호텔 매칭 결과 0개 | 결과 화면에서 호텔 카드 자체 비표시 (`hotels.length === 0` 가드) |

부스 운영 안정성을 위해 **빈 화면이 절대 안 보이도록** 설계.

## 4.7 토큰 비용 추정

| 항목 | 토큰 |
|---|---|
| 시스템 프롬프트 | ~800 (캐싱 적중 시 ~80) |
| user 메시지 | ~50 |
| 응답 (JSON) | ~500~800 |
| 총합 (캐시 적중) | ~600~900 토큰/요청 |

`claude-opus-4-7` 기준 1 요청당 약 $0.005~0.02 (시연 100회 = $0.5~$2). `claude-sonnet-4-6` 사용 시 약 1/3 비용.

## 4.8 안전 / 금지 사항

시스템 프롬프트에 명시된 금지:

- ❌ 부정적 단정 ("오늘은 운이 나빠요", "사고를 조심하세요" 같은 미신적 경고)
- ❌ 종교적/정치적 단정
- ❌ 이모지 (UI 별/요소로 충분)
- ❌ JSON 외 출력 (마크다운 펜스, 머리말 등)
- ❌ 풀 외 도시 추천 (enum 으로 강제됨)
- ❌ 정통 명리학 풍의 진지한 점술 (마스코트 톤 유지)

점수는 항상 평균 3.5~4.5로 후하게 — 마케팅 톤 유지.
