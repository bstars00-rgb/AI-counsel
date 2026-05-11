/**
 * 운세 추천 destination 풀.
 * 일본 / 한국 / 베트남 인기 여행지 25개. 각 항목은 호텔 데이터(lib/hotels.ts)와
 * 영문 도시명 배열(`hotelCities`)로 매칭됩니다.
 */

export interface Destination {
  /** 한국어 나라 */
  country: string;
  /** 한국어 도시 */
  city: string;
  /** 분위기 한 줄 태그 */
  vibe: string;
  /** 추천 시기 */
  period: string;
  /** 오늘 운을 끌어올리는 작은 팁 */
  tip: string;
  /** 그 도시에서 만날 좋은 일 (시적) */
  gem: string;
  /** 호텔 데이터 매칭용 영문 도시명 배열 (Hotel Top List 와 일치) */
  hotelCities: string[];
}

export const DESTINATIONS: Destination[] = [
  // ───── 일본 ─────
  { country: "일본", city: "도쿄", vibe: "도시 & 쇼핑", period: "3월~5월, 9월~11월", tip: "진보초 책방 한 곳에서 30분", gem: "신주쿠 어느 모퉁이에서 찍은 사진 한 장이 인스타 인기 게시물이 될지도 몰라요.", hotelCities: ["Tokyo"] },
  { country: "일본", city: "오사카", vibe: "도시 & 푸드 투어", period: "3월~5월, 10월~11월", tip: "도톤보리에서 처음 시도하는 메뉴 하나", gem: "골목 어딘가 작은 이자카야에서 만난 풍경이 영화처럼 마음에 남을 거예요.", hotelCities: ["Osaka"] },
  { country: "일본", city: "교토", vibe: "전통 & 단풍/벚꽃", period: "10월~11월 단풍, 3월~4월 벚꽃", tip: "기온 골목 찻집에서 30분", gem: "후시미이나리 작은 신사 옆 그림자 속에서 오늘의 답이 살짝 드러날 거예요.", hotelCities: ["Kyoto"] },
  { country: "일본", city: "후쿠오카", vibe: "푸드 & 야경", period: "3월~5월, 10월~11월", tip: "나카스 야경 산책 20분", gem: "텐진 골목 카페에서 우연히 들은 음악이 오래 마음에 머물 거예요.", hotelCities: ["Fukuoka"] },
  { country: "일본", city: "삿포로", vibe: "눈축제 & 라멘", period: "12월~2월 설경, 6월~8월 청량", tip: "오도리 공원 산책 한 바퀴", gem: "스스키노 골목 어딘가 라멘집에서 만난 풍경이 마음에 오래 남을 거예요.", hotelCities: ["Sapporo"] },
  { country: "일본", city: "오키나와", vibe: "에메랄드 바다 & 리조트", period: "4월~6월, 9월~10월", tip: "츄라우미 수족관 앞 바다 30분", gem: "코우리 대교 위에서 본 바다가 평소 답답하던 결정을 가볍게 만들어줄 거예요.", hotelCities: ["Naha", "Chatan"] },
  { country: "일본", city: "고베", vibe: "야경 & 와규", period: "3월~5월, 10월~11월", tip: "롯코산에서 본 야경 30분", gem: "구거류지 거리 어딘가 베이커리에서 우연히 만난 향이 오래 기억에 남을 거예요.", hotelCities: ["Kobe"] },
  { country: "일본", city: "나고야", vibe: "성과 미소카츠", period: "3월~5월, 10월~11월", tip: "오스 상점가 한 골목 30분", gem: "노리타케 정원 산책 끝에 만난 풍경이 오늘 마음을 가볍게 풀어줄 거예요.", hotelCities: ["Nagoya"] },

  // ───── 한국 ─────
  { country: "한국", city: "서울", vibe: "도시 & 카페 & 한옥", period: "4월~6월, 9월~11월", tip: "북촌 골목 한 곳에서 30분", gem: "남산타워에서 본 야경이 평소 답답하던 마음을 시원하게 풀어줄 거예요.", hotelCities: ["Seoul"] },
  { country: "한국", city: "부산", vibe: "해운대 & 광안리 야경", period: "5월~10월", tip: "광안대교 야경 산책 30분", gem: "감천문화마을 어느 골목에서 본 풍경이 마음에 오래 남을 거예요.", hotelCities: ["Busan"] },
  { country: "한국", city: "제주", vibe: "오름 & 바다", period: "4월~6월, 9월~10월", tip: "오름 하나 천천히 오르기", gem: "해변 카페 창가에서 잠시 본 수평선이 오늘 답을 알려줄지도 몰라요.", hotelCities: ["Jeju City", "Seogwipo"] },
  { country: "한국", city: "여수", vibe: "밤바다 & 케이블카", period: "5월~10월", tip: "여수 밤바다 산책로 30분", gem: "오동도 동백숲에서 만난 바람 한 줄기가 오늘 결정에 답을 줄 거예요.", hotelCities: ["Yeosu"] },
  { country: "한국", city: "속초", vibe: "설악산 & 해변", period: "4월~6월, 9월~11월", tip: "속초해수욕장 일출 30분", gem: "설악산 어귀에서 마신 차 한 잔이 오늘 답을 알려줄지도 몰라요.", hotelCities: ["Sokcho"] },
  { country: "한국", city: "강릉", vibe: "커피 & 바다", period: "5월~10월", tip: "안목해변 카페거리 30분", gem: "경포대 호숫가에서 본 풍경이 평소 답답하던 마음을 풀어줄 거예요.", hotelCities: ["Gangneung"] },
  { country: "한국", city: "양양", vibe: "서핑 & 자연", period: "5월~9월", tip: "죽도해변에서 발만 담그기 10분", gem: "낙산사 어느 모퉁이에서 본 바다가 오늘 마음을 활짝 열어줄 거예요.", hotelCities: ["Yangyang"] },
  { country: "한국", city: "경주", vibe: "역사 & 한옥", period: "4월~5월 벚꽃, 10월~11월 단풍", tip: "동궁과 월지 야경 30분", gem: "첨성대 근처 돌담길에서 본 풍경이 마음에 오래 남을 거예요.", hotelCities: ["Gyeongju"] },

  // ───── 베트남 ─────
  { country: "베트남", city: "다낭", vibe: "비치 & 케이블카", period: "11월~3월 건기", tip: "한 강변 일몰 산책 30분", gem: "비치프론트 카페에서 마주친 한국인 가족과의 짧은 대화가 마음에 오래 남을 거예요.", hotelCities: ["Da Nang"] },
  { country: "베트남", city: "나트랑", vibe: "롱비치 & 머드 스파", period: "1월~4월", tip: "롱비치에서 새벽 산책 10분", gem: "리조트 풀사이드에서 만난 작은 새 한 마리가 오늘의 행운 사인이 되어줄 거예요.", hotelCities: ["Nha Trang"] },
  { country: "베트남", city: "호이안", vibe: "랜턴 골목 & 올드타운", period: "2월~5월", tip: "올드타운 작은 랜턴 한 개를 손에", gem: "강 위로 띄운 등불이 평소 답답하던 마음을 가볍게 풀어줄 거예요.", hotelCities: ["Hoi An"] },
  { country: "베트남", city: "푸꾸옥", vibe: "프라이빗 리조트 & 야시장", period: "11월~3월 건기", tip: "야시장에서 직접 고른 망고 한 봉지", gem: "케이블카 위에서 본 바다가 답답하던 결정을 가볍게 만들어줄 거예요.", hotelCities: ["Phu Quoc"] },
  { country: "베트남", city: "하노이", vibe: "올드 쿼터 & 호수", period: "10월~4월", tip: "호안끼엠 호수 산책 30분", gem: "구시가지 어느 골목에서 마신 베트남 커피 한 잔이 오늘 답을 알려줄지도 몰라요.", hotelCities: ["Hanoi"] },
  { country: "베트남", city: "호치민", vibe: "도시 & 카페", period: "12월~4월 건기", tip: "벤탄 시장에서 처음 시도하는 메뉴 하나", gem: "사이공 강변 카페에서 우연히 들은 음악이 오래 마음에 머물 거예요.", hotelCities: ["Ho Chi Minh City"] },
  { country: "베트남", city: "달랏", vibe: "고원 도시 & 꽃", period: "12월~3월", tip: "쑤언흐엉 호수 산책 30분", gem: "달랏 어느 카페에서 본 안개 낀 산이 평소 답답하던 마음을 풀어줄 거예요.", hotelCities: ["Da Lat"] },
  { country: "베트남", city: "무이네", vibe: "사막 & 어촌", period: "12월~4월", tip: "화이트 샌듄 일출 30분", gem: "어촌 바닷가에서 본 바스켓 보트가 오늘의 작은 미소를 만들어줄 거예요.", hotelCities: ["Phan Thiet"] },
  { country: "베트남", city: "사파", vibe: "산악 트레킹 & 라이스 테라스", period: "3월~5월, 9월~11월", tip: "캣캣 마을 한 바퀴 산책", gem: "함롱 산에서 본 안개 낀 라이스 테라스가 평소 답답하던 결정을 가볍게 만들어줄 거예요.", hotelCities: ["Sa Pa"] },
];

/** Claude API 에게 도시 풀을 안내할 때 사용할 라벨 목록 (한국어 도시명) */
export const DESTINATION_CITY_LABELS: string[] = DESTINATIONS.map((d) => d.city);

/** 한국어 도시명으로 destination 찾기 */
export function findDestinationByCity(cityKo: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.city === cityKo);
}
