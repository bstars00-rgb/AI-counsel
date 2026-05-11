# 오마이치가 봐주는 사주 여행지 — 개발 명세서

OHMYHOTEL & CO 트래블쇼 부스용 **사주 여행 운세 + 호텔 추천** 단일 페이지 웹앱의 개발 명세서입니다.

## 📑 목차

| # | 문서 | 내용 |
|---|---|---|
| 01 | [서비스 개요](./01-overview.md) | 목적, 범위, 비목표, 기술스택, 일정 |
| 02 | [사용자 흐름 + 화면 명세](./02-user-flow.md) | 화면 3개 (입력 / 로딩 / 결과), 컴포넌트, 인터랙션 |
| 03 | [데이터 모델 + API 명세](./03-data-model-and-api.md) | TypeScript 타입, JSON 스키마, `/api/fortune` |
| 04 | [AI 프롬프트 + 구조화 출력](./04-ai-prompt.md) | Claude API 시스템 프롬프트, 시진별 사주 매핑 |
| 05 | [도시 풀 + 호텔 매칭](./05-destinations-hotels.md) | 25개 도시 풀, 118개 호텔, 매칭 로직 |
| 06 | [배포 + 환경변수](./06-deployment.md) | GitHub Pages / Vercel / 로컬 / Claude API 키 |
| 07 | [부스 운영 + 테스트](./07-booth-ops.md) | 현장 체크리스트, 수동 테스트 시나리오, 알려진 제약 |

## ⚡ 한 줄 요약

방문 고객이 **이름 / 생년월일 / 태어난 시(12 시진)** 만 입력하면,
오마이치 AI가 사주를 가볍게 풀어주면서 **여행지 한 곳 + 오마이호텔 Top 호텔 3개**를 추천합니다.

## 📂 소스 코드 위치 (저장소 루트 기준)

| 영역 | 파일 |
|---|---|
| 정적 단일 페이지 (부스용) | [`index.html`](../index.html) |
| Next.js 풀스택 (선택) | [`app/`](../app/) |
| 도메인 데이터 / 로직 | [`lib/`](../lib/) |
| 호텔 원본 데이터 | [`Hotel data/Hotel Top List - May 2026.xlsx`](../Hotel%20data/) |
| 사용자용 README | [`../README.md`](../README.md) |

## 🌐 라이브 환경

- **GitHub Pages (Mock 데이터)**: https://bstars00-rgb.github.io/AI-counsel/
- 저장소: https://github.com/bstars00-rgb/AI-counsel
- 기본 브랜치: `main` (커밋되면 GitHub Pages 자동 반영, ~1-2분)

## 🎯 목표 일정

**부스 오픈 D-2** — 현장 노트북/태블릿에서 즉시 동작 가능해야 함.

| 우선순위 | 항목 |
|---|---|
| P0 (필수) | `index.html` 단일 파일이 인터넷 없어도 동작 (Mock 모드) |
| P0 (필수) | 25개 도시 + 호텔 매칭 정확성 |
| P1 (권장) | Claude API 연동 (`/api/fortune`) — 풍성한 사주 풀이 |
| P1 (권장) | 부스 PC 사전 점검 (전체화면, 결과 화면 동작 확인) |
| P2 (선택) | 캐릭터 PNG (`mascot.png`, `logo.png`) 실 디자인으로 교체 |

## 🔑 핵심 의사 결정

- **단일 페이지 흐름** — 입력 → 로딩 → 결과, 메뉴/탭 없음. 부스 동선 최단.
- **결정론적 Mock** — 같은 입력은 같은 결과 (이름·생년월일·시·날짜 시드 해시). 시연 재현성 확보.
- **호텔은 서버/클라이언트에서 후처리 매칭** — Claude는 도시만 추천. 호텔 데이터는 컨텍스트에 보내지 않아 토큰 비용 절감 + 호텔 풀 변경 시 프롬프트 무영향.
- **GitHub Pages = Mock 전용** — API 키 노출 위험 없음, 인터넷 불안정해도 시연 가능.
- **Next.js = 실 Claude API용** — 백오피스 PC, Vercel/Render 등에 배포해 사용.

## 📞 문의

- 저장소: https://github.com/bstars00-rgb/AI-counsel
- 이슈/문의는 GitHub Issues 또는 담당자에게 직접
