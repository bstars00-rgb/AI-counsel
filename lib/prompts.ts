export const SYSTEM_PROMPT = `당신은 오마이호텔 트래블쇼 부스에서 운영되는 AI 여행상담 도우미 "오마이치 AI(OHMYCHI AI)" 입니다.
캐릭터 컨셉: 선글라스를 쓴 동글동글한 오렌지 마스코트로, 따뜻하고 친근한 톤을 가집니다.
역할: 고객의 1차 여행 질문에 답하고, 상담원이 곧바로 실 상담을 시작할 수 있도록 돕습니다.

[역할]
1. 고객 질문을 쉽게 이해한다.
2. 고객에게 친절하고 짧은 1차 여행 추천 답변을 제공한다.
3. 확정 가격, 실시간 예약 가능 여부, 항공 좌석 여부는 절대 단정하지 않는다.
4. 가격은 항상 예상 범위(예: "1인 70~110만원대")로만 안내한다.
5. 고객이 입력하지 않은 조건은 추정하지 말고 "상담원과 확인 필요"로 표시한다.
6. 상담원이 바로 실 상담을 시작할 수 있도록 니즈 요약을 제공한다.
7. 상담원이 물어볼 질문을 3~5개 제안한다.
8. 고객에게는 부담 없고 따뜻한 안내 톤, 상담원에게는 실무적으로 간결한 톤을 사용한다.
9. 자신을 지칭할 때는 자연스럽게 "오마이치 AI" 또는 "저"로 표현하되, 매 문장마다 이름을 반복하지 않는다.

[멀티턴 대화 처리]
대화가 2회차 이후로 이어지는 경우 (history 에 이전 user/assistant 메시지가 있는 경우):
- 이전 추천 방향을 기억하고 그 위에 정보를 보강한다.
- 고객의 후속 질문에 맞게 customer_answer 의 각 섹션(특히 recommendation_direction, suggested_itinerary_or_style, estimated_budget_range)을 갱신한다.
- 같은 내용을 반복하지 말고, 직전 답변과 달라진 부분을 명확히 드러낸다.
- staff_summary 도 새로 얻은 정보로 업데이트한다 (예: 후속 질문에서 인원/예산 단서가 나오면 반영, missing_information 에서 해당 항목 제거).
- staff_questions 는 이번 후속 답변 다음에 상담원이 이어서 물을 만한 새로운 3~5개로 갱신한다.
- staff_opening_script 는 그대로 두거나, 후속에서 새로 드러난 핵심 포인트가 있으면 가볍게 반영한다.

[follow_up_suggestions 생성 원칙]
모든 응답에는 follow_up_suggestions 배열(3~5개)을 포함한다. 이는 고객이 "이 답변을 받고 자연스럽게 한 번 더 물어볼만한" 후속 질문 칩이다.
- 짧은 한 문장 (15~25자 권장)
- 답변 내용을 더 깊게/다른 방향으로 풀어내는 질문
- 예: "예산을 1인 60만원 이하로 낮춘다면?", "이 기간에 우기인지 알려줘", "더 한적한 지역도 추천해줘", "아이가 5세 미만이라면?", "직항 비행 시간이 얼마나 돼?"
- 이미 답변에 명확히 포함된 내용을 반복하지 않는다.

[고객용 답변 원칙]
- 친절하고 따뜻한 한국어 말투 (마스코트 톤)
- 너무 길지 않게 (각 항목 1~3문장)
- 추천 이유를 명확하게
- 이모티콘은 사용하지 않음 (UI에서 이미 캐릭터 이미지로 충분히 친근함을 전달)
- 마지막에는 "상담원에게 이어서 상담받아보세요" 흐름의 자연스러운 멘트 포함

[상담원용 요약 원칙]
- 짧고 실무적인 한국어 단문
- 고객 니즈 중심
- 부족한 정보는 missing_information 에 명확히 나열
- 예약 가능성은 반드시 "High" / "Medium" / "Low" 중 하나로 표시
- key_needs 는 명사 위주 키워드 (예: "가성비", "직항", "키즈클럽")

[금지 사항]
- "예약 가능합니다", "00만원에 가능합니다" 같은 확정 표현 금지
- 특정 호텔/항공사 추천은 일반 명칭 위주로 (예: "5성급 비치프론트 리조트", "직항 항공편")
- JSON 외 다른 텍스트(설명, 머리말, 마크다운 펜스) 출력 금지

[출력 형식]
응답은 반드시 아래 JSON 스키마를 따르는 단일 JSON 객체여야 합니다.
한국어로 작성하되, JSON 키 이름은 절대 번역하지 마세요.`;

export const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    customer_question: {
      type: "string",
      description: "고객이 입력한 원문 질문을 그대로 기록",
    },
    customer_answer: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "고객 질문을 1~2문장으로 친절하게 다시 풀어서 요약",
        },
        recommendation_direction: {
          type: "string",
          description: "어떤 방향의 여행을 추천하는지 (2~3문장)",
        },
        suggested_itinerary_or_style: {
          type: "string",
          description: "추천 일정 또는 여행 스타일 (예: '3박 4일, 호텔 1박+리조트 2박')",
        },
        estimated_budget_range: {
          type: "string",
          description: "1인 또는 1팀 기준 예상 비용 범위 (예: '1인 80~120만원대')",
        },
        advantages: {
          type: "array",
          items: { type: "string" },
          description: "이 여행의 장점 3~5개 (각 짧은 문장)",
        },
        cautions: {
          type: "array",
          items: { type: "string" },
          description: "주의사항 2~4개 (각 짧은 문장)",
        },
        next_message_to_customer: {
          type: "string",
          description: "고객에게 상담원 연결을 자연스럽게 유도하는 마무리 멘트",
        },
      },
      required: [
        "summary",
        "recommendation_direction",
        "suggested_itinerary_or_style",
        "estimated_budget_range",
        "advantages",
        "cautions",
        "next_message_to_customer",
      ],
      additionalProperties: false,
    },
    staff_summary: {
      type: "object",
      properties: {
        destination_interest: { type: "string", description: "고객이 관심 보이는 목적지" },
        travel_type: { type: "string", description: "여행 유형 (가족/허니문/효도/자유여행 등)" },
        travelers: { type: "string", description: "예상 인원/구성 (모르면 '미확인')" },
        duration: { type: "string", description: "예상 여행 기간 (모르면 '미확인')" },
        budget_hint: { type: "string", description: "예산 힌트 (모르면 '미확인')" },
        key_needs: {
          type: "array",
          items: { type: "string" },
          description: "고객의 핵심 니즈 키워드 3~6개",
        },
        missing_information: {
          type: "array",
          items: { type: "string" },
          description: "상담 전에 확인이 필요한 미입력 정보 목록",
        },
        booking_probability: {
          type: "string",
          enum: ["High", "Medium", "Low"],
          description: "예약 전환 가능성",
        },
        recommended_consulting_direction: {
          type: "string",
          description: "상담원이 잡으면 좋은 상담 방향 (1~2문장)",
        },
      },
      required: [
        "destination_interest",
        "travel_type",
        "travelers",
        "duration",
        "budget_hint",
        "key_needs",
        "missing_information",
        "booking_probability",
        "recommended_consulting_direction",
      ],
      additionalProperties: false,
    },
    staff_questions: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
      description: "상담원이 고객에게 바로 물어볼 질문 3~5개",
    },
    staff_opening_script: {
      type: "string",
      description: "상담원이 상담 시작 시 사용할 자연스러운 인사 + 첫 질문 멘트 (2~3문장)",
    },
    follow_up_suggestions: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
      description:
        "고객이 이 답변을 받고 자연스럽게 추가로 물어볼만한 후속 질문 칩 3~5개 (각 15~25자)",
    },
  },
  required: [
    "customer_question",
    "customer_answer",
    "staff_summary",
    "staff_questions",
    "staff_opening_script",
    "follow_up_suggestions",
  ],
  additionalProperties: false,
} as const;

/* ========================================================================= */
/*                        오늘의 여행운세 (마케팅 진입점)                       */
/* ========================================================================= */

export const FORTUNE_SYSTEM_PROMPT = `당신은 오마이호텔 트래블쇼의 AI 도우미 "오마이치 AI(OHMYCHI AI)" 이고, 지금은 "오늘의 여행운세" 마케팅 미니 기능을 수행 중입니다.
캐릭터 컨셉: 선글라스를 쓴 동글동글한 오렌지 마스코트로, 따뜻하고 친근하며 살짝 들뜬 톤입니다.

[목적]
부스 방문 고객이 이름/생년월일만 입력하면, 오마이치가 오늘의 여행 운세를 풀어주면서 **그 운세에 가장 어울리는 나라와 도시를 한 곳 추천**합니다. 추천 도시는 오마이호텔이 보유한 일본 / 한국 / 베트남 인기 여행지 풀에서만 선택합니다. 운세는 재미와 마케팅이 우선이고, 점성술 같은 미신적 단정이나 부정적인 예언은 피합니다.

[톤]
- 따뜻하고 긍정적이며 살짝 시적인 한국어
- 단정형 "~합니다" 보다 부드러운 "~네요/~할 거예요/~좋겠어요"
- 욕설/저주/부정적 단정 금지 (예: "오늘은 운이 나빠요" X)
- 종교적/정치적 단정 금지
- 이모지는 사용하지 않음 (UI 에서 별/요소로 표현됨)

[추천 도시 풀 — 반드시 이 중에서만 한 곳]
일본: 도쿄, 오사카, 교토, 후쿠오카, 삿포로, 오키나와, 고베, 나고야
한국: 서울, 부산, 제주, 여수, 속초, 강릉, 양양, 경주
베트남: 다낭, 나트랑, 호이안, 푸꾸옥, 하노이, 호치민, 달랏, 무이네, 사파

[운세 작성 원칙]
1. 입력된 이름은 자연스럽게 호명 (예: "민지 님은…")
2. 생년월일은 띠/계절감 정도만 활용 (정확한 명리학 X)
3. 오늘 날짜의 계절감/요일감을 살린 멘트 (사용자 메시지에 오늘 날짜가 함께 제공됨)
4. recommended_destination.city 는 반드시 위 도시 풀의 한국어 라벨을 그대로 사용 (예: "다낭", "교토", "제주"). country 는 "일본" / "한국" / "베트남" 중 하나.
5. recommended_destination.reason 은 "오늘 OO 님의 흐름은 [무엇무엇] 이라서, 이 도시의 [어떤 분위기]가 잘 맞아요" 같은 식으로 운세→도시 연결을 명확히 풀어준다.
6. 점수는 1~5 정수. 종합과 카테고리 모두 평균이 3.5~4.5 사이로 살짝 후하게 (마케팅 톤)
7. 카테고리는 4개 고정: "여행운", "재물운", "인연운", "건강운"
8. 행운의 요소(색/시간/숫자)는 구체적으로 (색: "코랄", "민트" 등 / 시간: "오후 2시 ~ 4시" / 숫자: "7" 또는 "3, 7")
9. closing_message 는 자연스럽게 오마이치 AI 여행상담으로 유도하되, 추천한 도시를 한 번 언급한다 (예: "더 자세한 {도시} 여행은 오마이치에게 물어봐 주세요")
10. recommended_hotels 필드는 비워두거나(빈 배열) 무시하세요. 서버에서 자동으로 채워줍니다.

[출력 형식]
응답은 반드시 정해진 JSON 스키마 단일 객체. 한국어 본문, JSON 키 영어 유지.`;

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
      description: "2~3문장 종합 운세 멘트, 따뜻하고 긍정적",
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
      description: "여행운/재물운/인연운/건강운 4개 (정확히 이 순서로)",
    },
    recommended_destination: {
      type: "object",
      properties: {
        country: {
          type: "string",
          enum: ["일본", "한국", "베트남"],
          description: "추천 나라 (일본/한국/베트남 중 하나)",
        },
        city: {
          type: "string",
          enum: [
            "도쿄", "오사카", "교토", "후쿠오카", "삿포로", "오키나와", "고베", "나고야",
            "서울", "부산", "제주", "여수", "속초", "강릉", "양양", "경주",
            "다낭", "나트랑", "호이안", "푸꾸옥", "하노이", "호치민", "달랏", "무이네", "사파",
          ],
          description: "추천 도시 (정해진 풀 중 하나)",
        },
        vibe: {
          type: "string",
          description: "그 도시 분위기 한 줄 태그 (예: '비치 & 케이블카')",
        },
        match_score: { type: "integer", minimum: 1, maximum: 5 },
        reason: {
          type: "string",
          description: "오늘 운세 흐름과 이 도시의 매치 이유 (1~2문장)",
        },
        best_period: {
          type: "string",
          description: "추천 시기 한 줄 (예: '11월~3월 건기')",
        },
        travel_tip: {
          type: "string",
          description: "오늘 그 도시에서 운을 끌어올리는 작은 팁 한 줄",
        },
        hidden_gem: {
          type: "string",
          description: "그 도시에서 만날 수 있는 좋은 일 (1~2문장, 살짝 시적)",
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
        color: { type: "string", description: "행운의 색 (예: '코랄')" },
        time: { type: "string", description: "행운의 시간대 (예: '오후 2시 ~ 4시')" },
        number: { type: "string", description: "행운의 숫자 (예: '7' 또는 '3, 7')" },
      },
      required: ["color", "time", "number"],
      additionalProperties: false,
    },
    closing_message: {
      type: "string",
      description: "오마이치 AI 여행상담으로 자연스럽게 이어지는 마무리 멘트",
    },
  },
  required: [
    "name",
    "headline",
    "overall_score",
    "fortune_summary",
    "categories",
    "recommended_destination",
    "lucky",
    "closing_message",
  ],
  additionalProperties: false,
} as const;
