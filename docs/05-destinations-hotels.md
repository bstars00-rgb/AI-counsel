# 05 · 도시 풀 + 호텔 매칭

## 5.1 도시 풀 (25개)

소스: [`lib/destinations.ts`](../lib/destinations.ts)

### 5.1.1 데이터 구조

```ts
export interface Destination {
  country: string;           // 한국어 ("일본" | "한국" | "베트남")
  city: string;              // 한국어 (Claude enum 값)
  vibe: string;              // 분위기 태그 (예: "도시 & 쇼핑")
  period: string;            // 추천 시기
  tip: string;               // 오늘의 작은 팁
  gem: string;               // 여행지에서 만날 좋은 일
  hotelCities: string[];     // 호텔 데이터 매칭 키 (영문, xlsx와 일치)
}
```

### 5.1.2 전체 도시 (25개)

#### 일본 (8개)

| 도시 | vibe | period | hotelCities |
|---|---|---|---|
| 도쿄 | 도시 & 쇼핑 | 3월~5월, 9월~11월 | `["Tokyo"]` |
| 오사카 | 도시 & 푸드 투어 | 3월~5월, 10월~11월 | `["Osaka"]` |
| 교토 | 전통 & 단풍/벚꽃 | 10월~11월 단풍, 3월~4월 벚꽃 | `["Kyoto"]` |
| 후쿠오카 | 푸드 & 야경 | 3월~5월, 10월~11월 | `["Fukuoka"]` |
| 삿포로 | 눈축제 & 라멘 | 12월~2월 설경, 6월~8월 청량 | `["Sapporo"]` |
| 오키나와 | 에메랄드 바다 & 리조트 | 4월~6월, 9월~10월 | `["Naha", "Chatan"]` |
| 고베 | 야경 & 와규 | 3월~5월, 10월~11월 | `["Kobe"]` |
| 나고야 | 성과 미소카츠 | 3월~5월, 10월~11월 | `["Nagoya"]` |

#### 한국 (8개)

| 도시 | vibe | period | hotelCities |
|---|---|---|---|
| 서울 | 도시 & 카페 & 한옥 | 4월~6월, 9월~11월 | `["Seoul"]` |
| 부산 | 해운대 & 광안리 야경 | 5월~10월 | `["Busan"]` |
| 제주 | 오름 & 바다 | 4월~6월, 9월~10월 | `["Jeju City", "Seogwipo"]` |
| 여수 | 밤바다 & 케이블카 | 5월~10월 | `["Yeosu"]` |
| 속초 | 설악산 & 해변 | 4월~6월, 9월~11월 | `["Sokcho"]` |
| 강릉 | 커피 & 바다 | 5월~10월 | `["Gangneung"]` |
| 양양 | 서핑 & 자연 | 5월~9월 | `["Yangyang"]` |
| 경주 | 역사 & 한옥 | 4월~5월 벚꽃, 10월~11월 단풍 | `["Gyeongju"]` |

#### 베트남 (9개)

| 도시 | vibe | period | hotelCities |
|---|---|---|---|
| 다낭 | 비치 & 케이블카 | 11월~3월 건기 | `["Da Nang"]` |
| 나트랑 | 롱비치 & 머드 스파 | 1월~4월 | `["Nha Trang"]` |
| 호이안 | 랜턴 골목 & 올드타운 | 2월~5월 | `["Hoi An"]` |
| 푸꾸옥 | 프라이빗 리조트 & 야시장 | 11월~3월 건기 | `["Phu Quoc"]` |
| 하노이 | 올드 쿼터 & 호수 | 10월~4월 | `["Hanoi"]` |
| 호치민 | 도시 & 카페 | 12월~4월 건기 | `["Ho Chi Minh City"]` |
| 달랏 | 고원 도시 & 꽃 | 12월~3월 | `["Da Lat"]` |
| 무이네 | 사막 & 어촌 | 12월~4월 | `["Phan Thiet"]` |
| 사파 | 산악 트레킹 & 라이스 테라스 | 3월~5월, 9월~11월 | `["Sa Pa"]` |

### 5.1.3 헬퍼 함수

```ts
/** 한국어 도시명으로 destination 찾기 */
export function findDestinationByCity(cityKo: string): Destination | undefined;

/** Claude 프롬프트 안내용 도시 라벨 배열 (25개) */
export const DESTINATION_CITY_LABELS: string[];
```

## 5.2 호텔 데이터

### 5.2.1 원본

| 항목 | 값 |
|---|---|
| 파일 | [`Hotel data/Hotel Top List - May 2026.xlsx`](../Hotel%20data/) |
| 시트 | `JP Top 100`, `KR Top 100`, `VN Top 100` |
| 컬럼 | `Top`, `Hotel Code`, `Hotel Name`, `Hotel City`, `Address` |
| 행 | 각 시트 100개씩 (총 300개) |

### 5.2.2 빌드된 데이터

소스: [`lib/hotels.ts`](../lib/hotels.ts) (자동 생성)

각 도시별 **상위 5개**까지만 추출. 운세 추천 도시 풀(§5.1)에 속하는 도시만 포함.

```ts
export interface Hotel {
  rank: number;        // 해당 국가 Top 100 내 순위
  code: string;        // OTA 시스템용 호텔 코드
  name: string;
  city: string;        // 영문 (xlsx 그대로)
  address: string;
  country: "jp" | "kr" | "vn";
}

export const HOTELS_BY_CITY: Record<string, Hotel[]>;
```

### 5.2.3 도시별 호텔 수

총 **118개 호텔 / 27개 영문 도시키** (제주와 오키나와는 영문 키 2개씩 매핑됨).

| 영문 도시키 | 호텔 수 | 국가 | 매핑되는 한국어 도시 |
|---|---|---|---|
| Osaka | 5 | jp | 오사카 |
| Tokyo | 5 | jp | 도쿄 |
| Kyoto | 5 | jp | 교토 |
| Fukuoka | 5 | jp | 후쿠오카 |
| Kobe | 5 | jp | 고베 |
| Naha | 4 | jp | 오키나와 |
| Chatan | 2 | jp | 오키나와 |
| Sapporo | 5 | jp | 삿포로 |
| Nagoya | 3 | jp | 나고야 |
| Seoul | 5 | kr | 서울 |
| Busan | 5 | kr | 부산 |
| Jeju City | 5 | kr | 제주 |
| Seogwipo | 5 | kr | 제주 |
| Yeosu | 5 | kr | 여수 |
| Sokcho | 5 | kr | 속초 |
| Gangneung | 3 | kr | 강릉 |
| Yangyang | 3 | kr | 양양 |
| Gyeongju | 1 | kr | 경주 |
| Da Nang | 5 | vn | 다낭 |
| Nha Trang | 5 | vn | 나트랑 |
| Hoi An | 5 | vn | 호이안 |
| Phu Quoc | 4 | vn | 푸꾸옥 |
| Ho Chi Minh City | 5 | vn | 호치민 |
| Hanoi | 5 | vn | 하노이 |
| Da Lat | 5 | vn | 달랏 |
| Phan Thiet | 4 | vn | 무이네 |
| Sa Pa | 4 | vn | 사파 |

⚠️ **주의**: 경주는 1개만 매칭됨 (호텔 풀에 `Gyeongju` 호텔이 1개뿐). 결과 화면에 TOP 1만 표시됨.

## 5.3 매칭 로직

소스: [`lib/hotels.ts`](../lib/hotels.ts)

```ts
/**
 * 영문 도시키 배열로 호텔을 찾아 rank 오름차순 정렬 + 중복 제거 후 상위 N개 반환.
 *
 * @example
 * findHotelsForCities(["Naha", "Chatan"], 3)
 *   // 오키나와는 Naha + Chatan 두 도시키. 둘 다 검색해서 합친 뒤 rank 순.
 */
export function findHotelsForCities(
  cityEnList: string[],
  limit: number = 3,
): Hotel[] {
  const seen = new Set<string>();
  const out: Hotel[] = [];
  for (const c of cityEnList) {
    for (const h of HOTELS_BY_CITY[c] || []) {
      if (seen.has(h.code)) continue;
      seen.add(h.code);
      out.push(h);
    }
  }
  out.sort((a, b) => a.rank - b.rank);
  return out.slice(0, limit);
}
```

### 5.3.1 호출 흐름

```
Claude/Mock 응답 → recommended_destination.city = "오키나와"
       ↓
findDestinationByCity("오키나와") → { hotelCities: ["Naha", "Chatan"], ... }
       ↓
findHotelsForCities(["Naha", "Chatan"], 3)
       ├─ HOTELS_BY_CITY["Naha"] = [rank 27, 31, 70, 95]
       ├─ HOTELS_BY_CITY["Chatan"] = [rank 33, 96]
       └─ 합치고 rank 정렬 → [27, 31, 33] 상위 3개
       ↓
recommended_hotels = [
  { rank: 27, name: "...", city: "Naha", ... },
  { rank: 31, name: "...", city: "Naha", ... },
  { rank: 33, name: "...", city: "Chatan", ... },
]
```

### 5.3.2 UI 표시 순위

호텔 카드의 `TOP {n}` 라벨은 **데이터의 `rank` 가 아닌, 배열 인덱스 + 1** 사용.

```tsx
{result.recommended_hotels.map((h, i) => (
  <li>
    <span>TOP {i + 1}</span>
    <div>{h.name}</div>
    ...
))}
```

이유: 사용자 입장에서 "도쿄 추천 TOP 1, 2, 3" 이 직관적. 데이터의 `rank` 는 국가 전체 순위 (예: 도쿄는 일본 2위, 3위, 5위 호텔) 이므로 UI 에는 노출하지 않음.

## 5.4 데이터 갱신 절차

호텔 Top List 가 업데이트되면:

### 5.4.1 xlsx 교체

```
1. 새 xlsx 파일을 Hotel data/ 폴더에 덮어쓰기 (파일명 유지 권장)
2. 컬럼이 동일한지 확인: Top / Hotel Code / Hotel Name / Hotel City / Address
3. 시트명이 동일한지 확인: JP Top 100 / KR Top 100 / VN Top 100
```

### 5.4.2 lib/hotels.ts 재생성

자동 생성 스크립트는 현재 저장소에 포함되어 있지 않습니다 (1회용 임시 스크립트로 사용). 갱신 시 임시 Node 스크립트:

```bash
# /tmp/xr 등 임시 폴더에 xlsx 패키지 설치
mkdir -p /tmp/xr && cd /tmp/xr && npm init -y && npm install xlsx

# 프로젝트 루트로 돌아가 변환 스크립트 실행
cd "/c/Users/.../Travel show"
node -e "
const XLSX = require('C:/.../tmp/xr/node_modules/xlsx');
const fs = require('fs');
const wb = XLSX.read(fs.readFileSync('Hotel data/Hotel Top List - May 2026.xlsx'));
// ... (도시 필터링 + JSON 출력 + TypeScript 변환)
"
```

또는 가장 간단하게:

1. 새 xlsx 의 행이 동일 컬럼이면 `lib/hotels.ts` 의 `HOTELS_BY_CITY` 객체를 직접 손으로 수정
2. 시 그룹화는 § 5.2.3 표 기준으로 유지

### 5.4.3 index.html 재빌드

`index.html` 은 `lib/hotels.ts` 의 데이터를 인라인 임베드한 상태. 호텔 데이터가 바뀌면 `index.html` 도 동일하게 갱신해야 함.

가장 깔끔한 방법은 `lib/hotels.ts` 와 `index.html` 내 `const HOTELS_BY_CITY = {...}` 두 곳을 모두 새 값으로 맞추는 것.

또는 빌드 자동화 시 — 임시 Node 스크립트가 `lib/hotels.ts` 의 export 객체를 추출해 `index.html` 의 해당 블록을 정규식으로 교체하면 됨 (이전 빌드에서 사용한 패턴).

### 5.4.4 검증

```
1. 도시별 호텔 수가 § 5.2.3 표와 일치하는지
2. `lib/destinations.ts` 의 hotelCities 배열에 영문 도시명이 모두 존재하는지
3. Claude 응답 enum (lib/prompts.ts) 의 도시 라벨이 lib/destinations.ts 와 동기화 되어 있는지
```

## 5.5 도시 확장 가이드

### 5.5.1 도시 추가

```
1. lib/destinations.ts 의 DESTINATIONS 배열에 새 항목 추가
   { country, city, vibe, period, tip, gem, hotelCities }
2. lib/prompts.ts 의 FORTUNE_RESPONSE_SCHEMA.recommended_destination.city.enum
   에 한국어 도시명 추가
3. lib/prompts.ts 의 FORTUNE_SYSTEM_PROMPT 의 "[추천 도시 풀]" 섹션에 도시명 추가
4. lib/hotels.ts 의 HOTELS_BY_CITY 에 영문 도시키 추가 (호텔 데이터 있을 시)
5. index.html 의 인라인 DESTINATIONS / HOTELS_BY_CITY 동기화
```

### 5.5.2 새 국가 추가

새 국가(예: 태국)를 추가하려면:
```
1. lib/types.ts FortuneResponse.recommended_hotels[].country
   타입을 "jp" | "kr" | "vn" | "th" 로 확장
2. lib/prompts.ts schema enum 의 country 에 "태국" 추가
3. xlsx 에 TH Top 100 시트 추가 + lib/hotels.ts 재생성
4. UI 의 COUNTRY_LABELS (page.tsx, index.html) 에 "th": "태국" 매핑 추가
```
