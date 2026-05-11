import type { ConsultResponse, ConsultTurn } from "./types";

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
