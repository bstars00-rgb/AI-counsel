/* ========================================================================= */
/*                  사주로 보는 오늘의 여행지 추천 (오마이치 AI)                  */
/* ========================================================================= */

/** 12 시진 (사주에서 사용) */
export type BirthHour =
  | "자시" // 23:00 - 01:00
  | "축시" // 01:00 - 03:00
  | "인시" // 03:00 - 05:00
  | "묘시" // 05:00 - 07:00
  | "진시" // 07:00 - 09:00
  | "사시" // 09:00 - 11:00
  | "오시" // 11:00 - 13:00
  | "미시" // 13:00 - 15:00
  | "신시" // 15:00 - 17:00
  | "유시" // 17:00 - 19:00
  | "술시" // 19:00 - 21:00
  | "해시" // 21:00 - 23:00
  | "모름";

export interface BirthHourOption {
  value: BirthHour;
  /** "자시 (子時)" */
  label: string;
  /** "23:00 - 01:00" */
  range: string;
}

export const BIRTH_HOUR_OPTIONS: BirthHourOption[] = [
  { value: "자시", label: "자시 (子時)", range: "23:00 - 01:00" },
  { value: "축시", label: "축시 (丑時)", range: "01:00 - 03:00" },
  { value: "인시", label: "인시 (寅時)", range: "03:00 - 05:00" },
  { value: "묘시", label: "묘시 (卯時)", range: "05:00 - 07:00" },
  { value: "진시", label: "진시 (辰時)", range: "07:00 - 09:00" },
  { value: "사시", label: "사시 (巳時)", range: "09:00 - 11:00" },
  { value: "오시", label: "오시 (午時)", range: "11:00 - 13:00" },
  { value: "미시", label: "미시 (未時)", range: "13:00 - 15:00" },
  { value: "신시", label: "신시 (申時)", range: "15:00 - 17:00" },
  { value: "유시", label: "유시 (酉時)", range: "17:00 - 19:00" },
  { value: "술시", label: "술시 (戌時)", range: "19:00 - 21:00" },
  { value: "해시", label: "해시 (亥時)", range: "21:00 - 23:00" },
  { value: "모름", label: "모름", range: "—" },
];

export interface FortuneInput {
  name: string;
  /** YYYY-MM-DD */
  birthdate: string;
  /** 12 시진 또는 "모름" */
  birthtime: BirthHour;
}

export interface FortuneCategory {
  /** "여행운" | "재물운" | "인연운" | "건강운" */
  label: string;
  /** 1~5 */
  score: number;
  message: string;
}

export interface FortuneResponse {
  name: string;
  /** 한 줄 헤드라인 (인스타 공유 카드 톤) */
  headline: string;
  /** 1~5 */
  overall_score: number;
  /** 사주 풀이 톤이 살짝 들어간 종합 운세 (2~3문장) */
  fortune_summary: string;
  /** 가벼운 사주 키워드 (오행/시진 분위기 등 3~4개 짧은 단어/구) */
  saju_keywords: string[];
  /** 여행운, 재물운, 인연운, 건강운 4가지 */
  categories: FortuneCategory[];
  /** 사주 풀이가 가리키는 추천 여행지 */
  recommended_destination: {
    country: string;
    city: string;
    vibe: string;
    /** 1~5 */
    match_score: number;
    /** "오늘 OO 님 사주의 [기운]과 [도시 분위기]가 닿아 있어요" 형태 */
    reason: string;
    best_period: string;
    travel_tip: string;
    hidden_gem: string;
  };
  /** 추천 도시의 오마이호텔 Top 호텔 1~3개 (서버에서 자동 매칭) */
  recommended_hotels: {
    rank: number;
    code: string;
    name: string;
    city: string;
    address: string;
    country: "jp" | "kr" | "vn";
  }[];
  lucky: {
    color: string;
    time: string;
    number: string;
  };
  /** 추천 도시 언급 + 자연스러운 마무리 멘트 */
  closing_message: string;
}
