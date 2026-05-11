import type { BirthHour, FortuneInput, FortuneResponse } from "./types";
import { DESTINATIONS } from "./destinations";
import { findHotelsForCities } from "./hotels";

/* ========================================================================= */
/*                  사주로 보는 오늘의 여행지 추천 — Mock                        */
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
  "사주가 길을 가만히 알려주는 하루",
  "오늘 결의 한 자락이 길을 트는 날",
  "마음의 나침반이 또렷해지는 하루",
  "익숙한 길 위에서 만나는 작은 운",
  "햇살처럼 부드러운 인연이 다가오는 날",
  "오늘만큼은 망설임 없이 떠나도 좋은 날",
  "조용한 풍경 속에서 빛나는 하루",
  "잊고 있던 설렘이 깨어나는 하루",
];

/** 시진별 사주 분위기 — fortune_summary 첫 문장에 사용 */
const BIRTHHOUR_VIBE: Record<BirthHour, { phrase: string; keywords: string[] }> = {
  자시: { phrase: "깊은 밤의 차분한 물 기운이 도는 사주", keywords: ["깊은 통찰", "차분한 흐름", "물의 기운"] },
  축시: { phrase: "단단한 흙의 결을 품은 사주", keywords: ["단단한 결심", "안정된 기반", "흙의 기운"] },
  인시: { phrase: "새벽 나무가 기지개를 켜는 사주", keywords: ["새로운 시작", "푸른 기운", "도약의 결"] },
  묘시: { phrase: "이른 아침 새싹의 풋풋한 사주", keywords: ["풋풋한 활기", "성장의 결", "맑은 기운"] },
  진시: { phrase: "든든한 흙과 햇살이 만나는 사주", keywords: ["든든한 결단", "안정과 도약", "흙의 기운"] },
  사시: { phrase: "한낮을 향해 가는 따뜻한 불의 사주", keywords: ["따뜻한 인연", "밝은 흐름", "불의 기운"] },
  오시: { phrase: "한낮의 활기찬 불 기운이 도는 사주", keywords: ["활발한 에너지", "환한 흐름", "불의 기운"] },
  미시: { phrase: "오후의 부드러운 흙 기운을 품은 사주", keywords: ["부드러운 휴식", "여유로운 결", "흙의 기운"] },
  신시: { phrase: "단단한 쇠의 명료함이 빛나는 사주", keywords: ["명료한 판단", "단정한 결", "쇠의 기운"] },
  유시: { phrase: "노을빛 쇠의 풍성함이 묻어나는 사주", keywords: ["풍요로운 만남", "결실의 결", "쇠의 기운"] },
  술시: { phrase: "저녁 흙이 깊이를 더하는 사주", keywords: ["깊은 영감", "차분한 결단", "흙의 기운"] },
  해시: { phrase: "밤의 고요한 물이 흘러드는 사주", keywords: ["조용한 통찰", "흐르는 직관", "물의 기운"] },
  모름: { phrase: "오늘 흐름이 도드라지는 결", keywords: ["오늘의 흐름", "마음의 신호", "잔잔한 직관"] },
};

const SUMMARIES = [
  "{vibe}이에요. 오늘은 작은 결심 하나가 여행의 방향을 바꿔놓을지도 모르겠네요.",
  "{vibe}으로, 오늘은 평온 속에 숨은 기회를 발견하기 좋은 날이에요. 서두르기보다 한 박자 천천히 움직여 보세요.",
  "{vibe}이라, 익숙한 풍경에서도 새로운 영감을 발견할 수 있어요. 카메라보다 마음으로 먼저 담아보세요.",
  "{vibe}이에요. 작은 친절이 큰 인연으로 이어지는 날이니, 여행 같은 일상을 만끽해 보세요.",
  "{vibe}이라, 결단력이 빛나는 하루입니다. 미뤄둔 여행 계획을 한 발 앞당겨도 좋겠어요.",
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
  "사주가 가리킨 {city}, 오마이호텔과 함께라면 더 편안하게 다녀오실 수 있어요.",
  "오늘의 결이 가리키는 {city}, 오마이호텔의 추천 호텔과 함께 떠나보세요.",
  "{city} 여행을 더 깊게 풀어보고 싶다면, 오마이치가 곁에서 도와드릴게요.",
];

export function buildMockFortune(input: FortuneInput): FortuneResponse {
  const today = new Date().toISOString().slice(0, 10);
  const seedStr = `${input.name}|${input.birthdate}|${input.birthtime}|${today}`;
  const seed = seedHash(seedStr);

  const overall = scoreFromSeed(seed, 3, 5);
  const sTravel = scoreFromSeed(seed >> 1, 3, 5);
  const sMoney = scoreFromSeed(seed >> 2, 3, 5);
  const sLove = scoreFromSeed(seed >> 3, 3, 5);
  const sHealth = scoreFromSeed(seed >> 4, 3, 5);

  const dest = pick(DESTINATIONS, seed >> 5);
  const destScore = scoreFromSeed(seed >> 6, 4, 5);

  const vibe = BIRTHHOUR_VIBE[input.birthtime] || BIRTHHOUR_VIBE["모름"];
  const summaryTpl = pick(SUMMARIES, seed >> 8);
  const reason = `${input.name} 님의 ${vibe.phrase}이라, ${dest.city}의 ${dest.vibe} 분위기가 잘 어울려요.`;

  return {
    name: input.name,
    headline: pick(HEADLINES, seed >> 7),
    overall_score: overall,
    fortune_summary: summaryTpl.replace("{vibe}", vibe.phrase),
    saju_keywords: vibe.keywords,
    categories: [
      { label: "여행운", score: sTravel, message: pick(TRAVEL_MSGS[sTravel], seed >> 9) },
      { label: "재물운", score: sMoney, message: pick(MONEY_MSGS[sMoney], seed >> 10) },
      { label: "인연운", score: sLove, message: pick(LOVE_MSGS[sLove], seed >> 11) },
      { label: "건강운", score: sHealth, message: pick(HEALTH_MSGS[sHealth], seed >> 12) },
    ],
    recommended_destination: {
      country: dest.country,
      city: dest.city,
      vibe: dest.vibe,
      match_score: destScore,
      reason,
      best_period: dest.period,
      travel_tip: dest.tip,
      hidden_gem: dest.gem,
    },
    recommended_hotels: findHotelsForCities(dest.hotelCities, 3),
    lucky: {
      color: pick(LUCKY_COLORS, seed >> 13),
      time: pick(LUCKY_TIMES, seed >> 14),
      number: pick(LUCKY_NUMBERS, seed >> 15),
    },
    closing_message: pick(CLOSINGS, seed >> 16).replace("{city}", dest.city),
  };
}
