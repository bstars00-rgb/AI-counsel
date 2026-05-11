import type {
  ConsultResponse,
  ConsultTurn,
  FortuneInput,
  FortuneResponse,
} from "./types";

export function buildMockResponse(
  question: string,
  history: ConsultTurn[] = [],
): ConsultResponse {
  const q = question.trim();
  const isFollowUp = history.length > 0;

  // 키워드에 따라 약간씩 다른 mock 을 반환해서 데모가 자연스럽게 보이도록 처리
  const lower = q.toLowerCase();
  const isFamily = q.includes("아이") || q.includes("가족") || q.includes("초등");
  const isParents =
    q.includes("부모님") ||
    q.includes("효도") ||
    q.includes("어머니") ||
    q.includes("아버지");
  const isHoneymoon = q.includes("허니문") || q.includes("신혼");
  const isJapan =
    q.includes("일본") ||
    q.includes("오사카") ||
    q.includes("도쿄") ||
    q.includes("후쿠오카");
  const isJeju = q.includes("제주");
  const isDanang = q.includes("다낭");
  const isPhuquoc = q.includes("푸꾸옥") || lower.includes("phu");
  const isNhatrang = q.includes("나트랑") || q.includes("나짱");

  let destination = "동남아 휴양지";
  let travelType = "휴양 여행";
  if (isJapan) destination = "일본";
  else if (isJeju) destination = "제주";
  else if (isDanang) destination = "베트남 다낭";
  else if (isPhuquoc && isNhatrang) destination = "베트남 푸꾸옥/나트랑 비교";
  else if (isPhuquoc) destination = "베트남 푸꾸옥";
  else if (isNhatrang) destination = "베트남 나트랑";

  if (isFamily) travelType = "가족여행";
  else if (isParents) travelType = "효도여행";
  else if (isHoneymoon) travelType = "허니문";

  // 후속 질문 키워드 감지로 살짝 답변 변형
  const wantsCheaper = q.includes("저렴") || q.includes("싸게") || q.includes("줄이");
  const wantsPremium = q.includes("프리미엄") || q.includes("럭셔리") || q.includes("올인");
  const wantsRainy = q.includes("우기") || q.includes("비");

  let summaryPrefix = "";
  if (isFollowUp) {
    summaryPrefix = "추가로 알려주신 조건을 반영해서 다시 정리해드릴게요. ";
  }

  return {
    customer_question: q || "여행 추천을 요청하셨습니다.",
    customer_answer: {
      summary:
        summaryPrefix +
        `${destination} 방향의 ${travelType}을 알아보고 계신 것으로 이해했어요.`,
      recommendation_direction: wantsCheaper
        ? `예산을 낮춰도 만족도가 높은 ${destination} 지역과 시즌 오프 일정을 추천드려요. 4성 호텔 + 직항 비수기 조합이 가성비가 좋습니다.`
        : wantsPremium
          ? `프리미엄 옵션으로 ${destination}의 5성급 풀빌라/오션뷰 리조트 + 다이닝 패키지를 추천드려요.`
          : `편안하게 쉬면서도 인기 명소를 함께 즐길 수 있는 ${destination} 일정을 추천드려요. 이동이 짧고 한국인 편의시설이 잘 갖춰진 지역 위주로 잡으면 만족도가 높습니다.`,
      suggested_itinerary_or_style: wantsPremium
        ? "5박 7일 / 5성급 리조트 + 프라이빗 다이닝 + 헬리투어 1회"
        : wantsCheaper
          ? "3박 4일 / 4성 호텔 비수기 + 자유일정 위주"
          : "3박 5일 / 호텔 또는 리조트 중심 + 반나절 시내 투어 1회",
      estimated_budget_range: wantsCheaper
        ? "1인 60~90만원대 (비수기/4성 기준)"
        : wantsPremium
          ? "1인 200~280만원대 (5성 풀빌라 기준)"
          : isHoneymoon
            ? "1인 130~180만원대 (5성급 리조트 기준, 시즌에 따라 변동)"
            : isFamily
              ? "1인 90~140만원대 (4성 패밀리 리조트 기준)"
              : "1인 80~120만원대 (4~5성 호텔 기준)",
      advantages: [
        "직항편이 있어 이동이 편안합니다",
        "한국어 서비스가 가능한 호텔/리조트 선택이 가능합니다",
        "기후가 안정적이라 일정 변동 부담이 적습니다",
        isFamily
          ? "키즈클럽/풀빌라 옵션이 다양합니다"
          : "휴양과 관광의 균형이 좋은 일정으로 구성할 수 있습니다",
      ],
      cautions: [
        wantsRainy
          ? "우기에는 오후 스콜이 잦아 실내 옵션을 함께 챙기시면 좋아요"
          : "성수기에는 항공/숙박 가격이 빠르게 오릅니다",
        "여권 유효기간 6개월 이상이 필요합니다",
        "현지 환율과 카드 사용 가능 여부는 출발 전 확인 권장",
      ],
      next_message_to_customer: isFollowUp
        ? "조정해드린 방향으로 상담원에게 이어서 상담받아보세요. 출발일과 인원이 확정되면 더 빠르게 견적을 잡아드릴 수 있어요."
        : "이 방향이 마음에 드시면, 상담원에게 이어서 상담받아보세요. 출발 날짜와 인원만 알려주시면 더 정확한 견적을 안내해드릴 수 있어요.",
    },
    staff_summary: {
      destination_interest: destination,
      travel_type: travelType,
      travelers: isFamily ? "성인 2 + 아동 1~2 추정 (확인 필요)" : "미확인",
      duration: "3박 5일 추정 (미확인)",
      budget_hint: wantsCheaper
        ? "가성비 선호 — 60~90만원대"
        : wantsPremium
          ? "프리미엄 선호 — 200만원 이상"
          : isHoneymoon
            ? "프리미엄 선호 추정"
            : "중상 가격대 추정 (미확인)",
      key_needs: [
        travelType,
        wantsCheaper ? "가성비" : "균형",
        wantsPremium ? "프리미엄" : "직항 선호",
        isFamily ? "키즈프렌들리" : "휴양 중심",
        "한국인 응대",
      ],
      missing_information: [
        "정확한 출발일/복귀일",
        "정확한 인원 및 연령",
        wantsCheaper || wantsPremium ? "여행 우선순위 (가격 vs 경험)" : "1인/총 예산 한도",
        "비행기 직항/경유 선호",
        "호텔 등급 선호",
      ],
      booking_probability: isFollowUp ? "High" : "Medium",
      recommended_consulting_direction: isFollowUp
        ? "고객이 후속 조건을 명확히 해주셨으니, 해당 조건에 맞는 항공+호텔 패키지 2~3개를 바로 비교 제안해주세요."
        : "고객이 직접 입력해주신 키워드 위주로 가격대/등급을 확인한 뒤, 출발일 가용 항공편부터 잡고 호텔 옵션을 3개 정도 비교 제안해주세요.",
    },
    staff_questions: isFollowUp
      ? [
          "확정 가능한 출발일이 정해지셨나요?",
          "지금 알려주신 예산이 1인 기준인지 전체 기준인지요?",
          "추가로 결정 시 가장 중요한 포인트는 무엇인가요? (가격/일정/등급)",
          "함께 가시는 분 중 멀미/식이 등 특이사항 있으세요?",
        ]
      : [
          "출발 가능한 날짜는 언제이신가요?",
          "총 몇 분이 함께 가시나요? (아이가 있다면 나이도 함께)",
          "1인 또는 전체 예산은 대략 어느 정도 생각하고 계세요?",
          "직항을 꼭 원하시는지, 경유라도 괜찮은지요?",
          "호텔/리조트 등급은 어느 정도를 선호하시나요?",
        ],
    staff_opening_script:
      "안녕하세요, 트래블쇼 방문해주셔서 감사합니다. 오마이치 AI가 1차로 추천드린 방향 보셨죠? 제가 이어서 출발일과 인원만 먼저 확인하면, 바로 가능한 항공과 호텔 옵션을 골라 비교해드릴게요.",
    follow_up_suggestions: isFollowUp
      ? [
          "다른 지역도 같이 비교해줘",
          "더 한적한 곳을 원해",
          "여행 기간을 늘리면?",
          "기내식/좌석 등급도 안내해줘",
        ]
      : isFamily
        ? [
            "예산을 1인 60만원 이하로 낮추면?",
            "아이가 5세 미만이라면?",
            "키즈클럽이 좋은 리조트 추천해줘",
            "우기 피하려면 언제 가야 해?",
            "더 한적한 가족여행지도 알려줘",
          ]
        : isHoneymoon
          ? [
              "프라이빗 풀빌라 추천해줘",
              "포토스팟이 많은 곳은?",
              "5박 이상 일정으로 늘리면?",
              "신혼 특전 받을 수 있는 곳은?",
            ]
          : [
              "예산을 더 낮추면 어떤 옵션이 있어?",
              "프리미엄 등급으로 올리면?",
              "다른 지역도 비교해줘",
              "우기와 건기 추천 시기는?",
              "직항 비행 시간이 얼마나 돼?",
            ],
  };
}

/* ========================================================================= */
/*                          오늘의 여행운세 Mock                                */
/* ========================================================================= */

/** djb2 해시 — 같은 입력으로 동일 결과 보장 */
function seedHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function scoreFromSeed(seed: number, min = 3, max = 5): number {
  return min + (seed % (max - min + 1));
}

const HEADLINES = [
  "새로운 발견이 기다리는 하루",
  "마음의 나침반이 또렷해지는 날",
  "익숙한 길 위에서 만나는 작은 행운",
  "햇살처럼 부드러운 인연이 다가오는 날",
  "오늘만큼은 망설임 없이 떠나도 좋은 날",
  "조용한 풍경 속에서 빛나는 하루",
  "여행 가방을 가볍게 꾸리고 싶은 날",
  "잊고 있던 설렘이 깨어나는 하루",
];

const SUMMARIES = [
  "{name} 님, 오늘은 평소 관심 두지 않던 풍경에 마음이 끌리는 날이에요. 작은 결심 하나가 여행의 방향을 바꿔놓을지도 몰라요.",
  "{name} 님, 오늘은 평온 속에 숨은 기회를 발견하기 좋은 날이에요. 서두르기보다 한 박자 천천히 움직여 보세요.",
  "{name} 님, 오늘은 익숙한 풍경에서도 새로운 영감을 발견할 수 있어요. 카메라보다 마음으로 먼저 담아보세요.",
  "{name} 님, 오늘은 작은 친절이 큰 인연이 되는 날이에요. 여행 같은 일상을 만끽해 보세요.",
  "{name} 님, 오늘은 결단력이 빛나는 날입니다. 미뤄둔 여행 계획을 한 발 앞당겨도 좋겠어요.",
];

const TRAVEL_MSGS: Record<number, string[]> = {
  5: ["떠나기 가장 좋은 흐름이에요", "지도 위 어디든 당신 편이에요"],
  4: ["좋은 흐름이 살짝 보여요", "여행 운이 부드럽게 흘러요"],
  3: ["무난하지만 알찬 하루예요", "기대보다 만족스러운 작은 여행"],
};
const MONEY_MSGS: Record<number, string[]> = {
  5: ["뜻밖의 할인이 다가올 수도", "지갑이 가벼워질 일이 적은 날"],
  4: ["계획적인 소비가 빛나는 날", "여유 자금이 또렷해지는 날"],
  3: ["과한 소비만 피하면 OK", "꼭 필요한 곳에 집중해 보세요"],
};
const LOVE_MSGS: Record<number, string[]> = {
  5: ["가까운 인연이 더 깊어져요", "낯선 곳에서 좋은 만남"],
  4: ["부드러운 인연이 다가와요", "마음이 통하는 대화가 있어요"],
  3: ["편안한 동행이 어울리는 날", "혼자 시간도 충분히 빛나요"],
};
const HEALTH_MSGS: Record<number, string[]> = {
  5: ["컨디션이 최고조에요", "활력이 넘치는 하루"],
  4: ["가벼운 산책이 잘 맞아요", "충분히 자면 더 좋은 하루"],
  3: ["무리하지 않는 게 베스트", "수분과 휴식이 핵심"],
};

const COUNTRY_TIPS: Record<string, { period: string; tip: string; gem: string }> = {
  일본: {
    period: "4월 벚꽃 시즌, 10~11월 단풍 시즌",
    tip: "현지 작은 카페에서 모닝 커피 한 잔으로 운을 켜보세요",
    gem: "골목 안 작은 신사에서 만난 한 줄기 햇살이 오늘의 작은 선물이 될 거예요.",
  },
  "베트남 다낭": {
    period: "11월~3월 건기",
    tip: "한 강변에서 해 질 녘 산책을 30분만 즐겨보세요",
    gem: "비치프론트 카페에서 우연히 마주친 한국인 가족과의 짧은 대화가 마음에 오래 남을 거예요.",
  },
  "베트남 푸꾸옥": {
    period: "11월~3월 건기",
    tip: "야시장에서 직접 고른 망고로 운을 채워보세요",
    gem: "케이블카 위에서 본 바다가 평소 답답하던 결정을 가볍게 만들어줄 거예요.",
  },
  "베트남 나트랑": {
    period: "1월~4월",
    tip: "롱비치에서 새벽 산책 10분, 마음이 맑아져요",
    gem: "리조트 풀사이드에서 만난 작은 새 한 마리가 오늘의 행운 사인이 되어줄 거예요.",
  },
  "태국 (방콕/푸켓)": {
    period: "11월~2월 건기",
    tip: "현지 마사지 한 번이 오늘의 피로를 풀어줄 거예요",
    gem: "노점에서 우연히 찍은 사진 한 장이 SNS 인기 게시물이 될지도 몰라요.",
  },
  "필리핀 (세부/보라카이)": {
    period: "12월~5월 건기",
    tip: "스노클링 한 시간이면 마음이 한결 가벼워져요",
    gem: "현지 가이드가 알려준 숨겨진 비치에서 평생 기억할 노을을 만날 수 있어요.",
  },
  "인도네시아 발리": {
    period: "5월~9월 건기",
    tip: "우붓 어딘가에서 요가 클래스를 한 번 들어보세요",
    gem: "라이스 테라스에서 만난 작은 바람 한 줄기가 오늘 결정에 답을 줄 거예요.",
  },
  싱가포르: {
    period: "2월~4월, 6월~8월",
    tip: "가든스 바이 더 베이의 야간 라이트쇼를 챙겨보세요",
    gem: "호커 센터에서 처음 시도한 메뉴 하나가 인생 메뉴가 될 수 있어요.",
  },
  대만: {
    period: "10월~4월",
    tip: "야시장에서 인기 메뉴 하나를 골라보세요",
    gem: "지우펀 골목 어느 찻집에서 만난 풍경이 영화처럼 마음에 남을 거예요.",
  },
  홍콩: {
    period: "10월~12월",
    tip: "트램 2층 창가 자리에서 30분 풍경을 즐겨보세요",
    gem: "피크 트램 위에서 본 야경이 평소 고민의 무게를 덜어줄 거예요.",
  },
  제주: {
    period: "4월~6월, 9월~10월",
    tip: "오름 하나 천천히 오르면 마음이 환해져요",
    gem: "해변 카페 창가에서 잠시 본 수평선이 오늘 답을 알려줄지도 몰라요.",
  },
  "미국령 괌/사이판": {
    period: "12월~5월 건기",
    tip: "이른 아침 호텔 비치에서 산호 모래를 밟아보세요",
    gem: "선셋 시간 비행기 한 대가 지나가는 풍경이 오늘의 시그널이 될 거예요.",
  },
  "미국 하와이": {
    period: "4월~10월",
    tip: "노스쇼어 드라이브로 마음을 트여주세요",
    gem: "와이키키 어느 카페에서 우연히 들은 노래가 오래 마음에 머물 거예요.",
  },
  "유럽 (프랑스/이탈리아 등)": {
    period: "5월~9월",
    tip: "현지 시장에서 작은 빵 하나로 아침을 시작해 보세요",
    gem: "낯선 광장에서 들은 거리 음악이 여행의 BGM이 될 거예요.",
  },
  호주: {
    period: "9월~11월, 3월~5월",
    tip: "본다이 비치 산책로를 끝까지 걸어보세요",
    gem: "오페라 하우스 앞 벤치에서 본 갈매기 한 마리가 오늘의 미소를 만들어줄 거예요.",
  },
};

const FALLBACK_COUNTRY_TIP = {
  period: "출발하기 좋은 가벼운 시기",
  tip: "현지의 작은 골목 하나 깊게 걸어보세요",
  gem: "익숙하지 않은 풍경 속에서 오늘만의 작은 신호를 발견할 수 있어요.",
};

const LUCKY_COLORS = ["코랄", "민트", "라벤더", "올리브", "샌드 베이지", "스카이 블루", "선셋 오렌지", "포레스트 그린"];
const LUCKY_TIMES = [
  "오전 10시 ~ 12시",
  "오후 2시 ~ 4시",
  "오후 6시 ~ 8시",
  "해 질 녘 30분",
  "이른 아침 9시 전후",
];
const LUCKY_NUMBERS = ["3", "5", "7", "3, 7", "5, 9", "2, 8", "1, 6"];

const CLOSINGS = [
  "더 자세한 {country} 여행 일정은 오마이치 AI 여행상담에서 이어서 받아보세요.",
  "오늘 운세에 맞춘 {country} 추천 일정이 궁금하다면 오마이치에게 물어봐 주세요.",
  "{country} 여행을 더 깊게 풀어보고 싶다면, 오마이치 AI 상담이 도움이 될 거예요.",
];

export function buildMockFortune(input: FortuneInput): FortuneResponse {
  const today = new Date().toISOString().slice(0, 10);
  const seedStr = `${input.name}|${input.birthdate}|${input.country}|${today}`;
  const seed = seedHash(seedStr);

  const overall = scoreFromSeed(seed, 3, 5);
  const sTravel = scoreFromSeed(seed >> 1, 3, 5);
  const sMoney = scoreFromSeed(seed >> 2, 3, 5);
  const sLove = scoreFromSeed(seed >> 3, 3, 5);
  const sHealth = scoreFromSeed(seed >> 4, 3, 5);

  const countryInfo = COUNTRY_TIPS[input.country] || FALLBACK_COUNTRY_TIP;
  const countryScore = scoreFromSeed(seed >> 5, 3, 5);

  const summaryTpl = pick(SUMMARIES, seed >> 6);
  const headline = pick(HEADLINES, seed >> 7);
  const closingTpl = pick(CLOSINGS, seed >> 8);
  const luckyColor = pick(LUCKY_COLORS, seed >> 9);
  const luckyTime = pick(LUCKY_TIMES, seed >> 10);
  const luckyNumber = pick(LUCKY_NUMBERS, seed >> 11);

  return {
    name: input.name,
    country: input.country,
    headline,
    overall_score: overall,
    fortune_summary: summaryTpl.replace("{name}", input.name),
    categories: [
      { label: "여행운", score: sTravel, message: pick(TRAVEL_MSGS[sTravel], seed >> 12) },
      { label: "재물운", score: sMoney, message: pick(MONEY_MSGS[sMoney], seed >> 13) },
      { label: "인연운", score: sLove, message: pick(LOVE_MSGS[sLove], seed >> 14) },
      { label: "건강운", score: sHealth, message: pick(HEALTH_MSGS[sHealth], seed >> 15) },
    ],
    country_match: {
      country: input.country,
      match_score: countryScore,
      best_period: countryInfo.period,
      travel_tip: countryInfo.tip,
      hidden_gem: countryInfo.gem,
    },
    lucky: {
      color: luckyColor,
      time: luckyTime,
      number: luckyNumber,
    },
    closing_message: closingTpl.replace("{country}", input.country),
  };
}
