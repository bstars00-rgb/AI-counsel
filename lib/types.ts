export type BookingProbability = "High" | "Medium" | "Low";

export interface CustomerAnswer {
  summary: string;
  recommendation_direction: string;
  suggested_itinerary_or_style: string;
  estimated_budget_range: string;
  advantages: string[];
  cautions: string[];
  next_message_to_customer: string;
}

export interface StaffSummary {
  destination_interest: string;
  travel_type: string;
  travelers: string;
  duration: string;
  budget_hint: string;
  key_needs: string[];
  missing_information: string[];
  booking_probability: BookingProbability;
  recommended_consulting_direction: string;
}

export interface ConsultResponse {
  customer_question: string;
  customer_answer: CustomerAnswer;
  staff_summary: StaffSummary;
  staff_questions: string[];
  staff_opening_script: string;
  /**
   * 후속 질문 칩 (3~5개). 고객이 답변을 받은 뒤 한 번 더 물어볼만한 자연스러운 후속 질문.
   * 예: "예산을 줄이면 어떤 옵션이 있나요?", "다른 지역도 알려주세요"
   */
  follow_up_suggestions: string[];
}

/**
 * Claude API messages 형식과 동일. 멀티턴 대화를 위해 클라이언트가 누적 관리.
 * - user: 고객 질문 (첫 질문 또는 후속 질문)
 * - assistant: 직전 AI 응답을 JSON 문자열로 직렬화
 */
export interface ConsultTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ConsultHistoryItem {
  id: string;
  createdAt: string;
  question: string;
  response: ConsultResponse;
  note?: string;
}

/* ========================================================================= */
/*                        오늘의 여행운세 (마케팅 진입점)                       */
/* ========================================================================= */

export interface FortuneInput {
  name: string;
  /** YYYY-MM-DD */
  birthdate: string;
}

export interface FortuneCategory {
  /** "여행운" | "재물운" | "인연운" | "건강운" 등 */
  label: string;
  /** 1~5 */
  score: number;
  /** 한 줄 멘트 */
  message: string;
}

export interface FortuneResponse {
  /** 입력 이름 (검증 후 그대로 반사) */
  name: string;
  /** 한 줄 헤드라인 — 인스타 공유 카드용 */
  headline: string;
  /** 1~5 */
  overall_score: number;
  /** 2~3문장 종합 운세 멘트 */
  fortune_summary: string;
  /** 4가지 카테고리 (여행운/재물운/인연운/건강운) */
  categories: FortuneCategory[];
  /** 오마이치가 오늘의 운세 흐름에 맞춰 추천하는 여행지 (나라 + 도시) */
  recommended_destination: {
    /** 나라명 (예: "베트남", "일본") */
    country: string;
    /** 도시명 (예: "다낭", "교토") */
    city: string;
    /** 한 줄 분위기 태그 (예: "비치 & 케이블카") */
    vibe: string;
    /** 1~5 — 오늘 운세와 이 도시의 매치 점수 */
    match_score: number;
    /** 왜 오늘 당신에게 이 도시가 어울리는지 (1~2문장) */
    reason: string;
    /** 추천 시기 한 줄 */
    best_period: string;
    /** 그 도시에서 오늘의 운을 끌어올리는 작은 팁 한 줄 */
    travel_tip: string;
    /** 그 도시에서 만날 수 있는 좋은 일 (살짝 시적, 1~2문장) */
    hidden_gem: string;
  };
  /** 행운의 요소들 */
  lucky: {
    color: string;
    /** "오후 2시 ~ 4시" 같은 시간대 */
    time: string;
    /** "7" 또는 "3, 7" 같은 숫자 */
    number: string;
  };
  /** 오마이치 AI 상담 유도 마무리 멘트 */
  closing_message: string;
}
