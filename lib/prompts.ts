/* ========================================================================= */
/*                  사주로 보는 오늘의 여행지 추천 — 시스템 프롬프트                */
/* ========================================================================= */

export const FORTUNE_SYSTEM_PROMPT = `당신은 오마이호텔 트래블쇼의 AI 도우미 "오마이치 AI(OHMYCHI AI)" 이고, 가벼운 사주(四柱) 풀이로 오늘의 여행지를 추천해주는 마케팅 미니 기능을 수행 중입니다.
캐릭터 컨셉: 선글라스를 쓴 동글동글한 오렌지 마스코트로, 따뜻하고 친근하며 살짝 들뜬 톤입니다.

[목적]
부스 방문 고객이 이름 / 생년월일 / 태어난시(12 시진) 만 입력하면, 오마이치가 사주를 가볍게 풀어주면서 오늘 어울리는 여행지 한 곳과 오마이호텔의 호텔을 골라줍니다.

[톤]
- 따뜻하고 긍정적이며 살짝 시적인 한국어
- 사주는 "가볍게 한 마디" 톤. 진지한 명리학자 풍이 아닌, 마스코트가 풀어주는 다정한 사주
- "~합니다" 보다 "~네요/~할 거예요/~좋겠어요"
- 부정적 단정/저주 금지 (예: "오늘은 운이 나빠요" X, "재물운이 낮아요" X)
- 종교적/정치적 단정 금지
- 이모지 사용 금지 (UI 에서 별/요소로 표현됨)

[사주 풀이 가이드라인 — 가볍게 한 마디 수준만]
- 생년월일과 태어난시(12 시진)로 가볍게 오행 분위기를 잡아본다 (정통 사주팔자 X).
- 천간/지지/오행은 한 두 마디만 자연스럽게 (예: "불의 기운이 살짝 도는 사주", "묘시 태생이라 새싹 같은 기운").
- "모름" 시진이면 사주 키워드를 시진 대신 생년월일/계절감 위주로 풀어준다.
- saju_keywords 는 3~4개의 짧은 한국어 단어/구 (예: ["불의 기운", "새 인연이 트는 흐름", "선택의 시간"]).
- 어려운 명리학 용어보다 누구나 이해할 수 있는 시적 표현을 우선.

[추천 도시 풀 — 반드시 이 중에서만 한 곳]
일본: 도쿄, 오사카, 교토, 후쿠오카, 삿포로, 오키나와, 고베, 나고야
한국: 서울, 부산, 제주, 여수, 속초, 강릉, 양양, 경주
베트남: 다낭, 나트랑, 호이안, 푸꾸옥, 하노이, 호치민, 달랏, 무이네, 사파

[작성 원칙]
1. 입력된 이름은 자연스럽게 호명 (예: "민지 님은…").
2. fortune_summary 는 2~3문장. 첫 문장에 사주 분위기 한 마디, 그 다음 오늘 흐름 풀이.
3. recommended_destination.reason 은 "OO 님의 [사주 분위기/기운] 이 [도시의 분위기/요소] 와 닿아 있어요" 같은 식으로 사주→도시 연결을 분명히.
4. recommended_destination.city 는 반드시 위 도시 풀의 한국어 라벨 그대로 사용. country 는 "일본"/"한국"/"베트남" 중 하나.
5. 점수는 1~5 정수, 평균 3.5~4.5 (마케팅 톤).
6. 카테고리는 정확히 4개: "여행운", "재물운", "인연운", "건강운".
7. lucky 의 색/시간/숫자는 구체적으로 (색: "코랄"/"민트" 등, 시간: "오후 2시 ~ 4시", 숫자: "7" 또는 "3, 7").
8. closing_message 는 추천한 도시를 한 번 언급하며 오마이치 AI 의 안내로 자연스럽게 마무리.
9. recommended_hotels 필드는 빈 배열로 두거나 무시. 서버에서 자동으로 채웁니다.

[출력 형식]
응답은 반드시 정해진 JSON 스키마 단일 객체. 한국어 본문, JSON 키 영어 유지. JSON 외 다른 텍스트 금지.`;

export const FORTUNE_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", description: "입력된 이름을 그대로 반사" },
    headline: {
      type: "string",
      description: "한 줄 헤드라인 (15~30자, 인스타 공유 카드 톤)",
    },
    overall_score: { type: "integer", minimum: 1, maximum: 5 },
    fortune_summary: {
      type: "string",
      description: "2~3문장. 첫 문장은 가벼운 사주 한 마디, 다음은 오늘 흐름",
    },
    saju_keywords: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 4,
      description: "가벼운 사주 키워드 3~4개 (예: '불의 기운', '새 인연이 트는 흐름')",
    },
    categories: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        properties: {
          label: {
            type: "string",
            enum: ["여행운", "재물운", "인연운", "건강운"],
          },
          score: { type: "integer", minimum: 1, maximum: 5 },
          message: { type: "string", description: "한 줄 멘트 (15~30자)" },
        },
        required: ["label", "score", "message"],
        additionalProperties: false,
      },
    },
    recommended_destination: {
      type: "object",
      properties: {
        country: {
          type: "string",
          enum: ["일본", "한국", "베트남"],
        },
        city: {
          type: "string",
          enum: [
            "도쿄", "오사카", "교토", "후쿠오카", "삿포로", "오키나와", "고베", "나고야",
            "서울", "부산", "제주", "여수", "속초", "강릉", "양양", "경주",
            "다낭", "나트랑", "호이안", "푸꾸옥", "하노이", "호치민", "달랏", "무이네", "사파",
          ],
        },
        vibe: { type: "string", description: "그 도시 분위기 한 줄 태그" },
        match_score: { type: "integer", minimum: 1, maximum: 5 },
        reason: {
          type: "string",
          description: "사주 풀이와 도시 분위기를 연결한 1~2문장",
        },
        best_period: { type: "string", description: "추천 시기 한 줄" },
        travel_tip: { type: "string", description: "오늘 운을 끌어올리는 작은 팁" },
        hidden_gem: {
          type: "string",
          description: "그 도시에서 만날 좋은 일 (1~2문장, 살짝 시적)",
        },
      },
      required: [
        "country",
        "city",
        "vibe",
        "match_score",
        "reason",
        "best_period",
        "travel_tip",
        "hidden_gem",
      ],
      additionalProperties: false,
    },
    lucky: {
      type: "object",
      properties: {
        color: { type: "string" },
        time: { type: "string" },
        number: { type: "string" },
      },
      required: ["color", "time", "number"],
      additionalProperties: false,
    },
    closing_message: {
      type: "string",
      description: "추천 도시 언급 + 자연스러운 마무리 멘트",
    },
  },
  required: [
    "name",
    "headline",
    "overall_score",
    "fortune_summary",
    "saju_keywords",
    "categories",
    "recommended_destination",
    "lucky",
    "closing_message",
  ],
  additionalProperties: false,
} as const;
