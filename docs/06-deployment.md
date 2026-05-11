# 06 · 배포 + 환경변수

## 6.1 배포 옵션 비교

| 옵션 | 환경 | 데이터 | 인터넷 필요 | 개발 비용 |
|---|---|---|---|---|
| **A. GitHub Pages (현재 운영)** | 정적 호스팅 | Mock | 첫 로드만 | 0 (자동) |
| **B. 로컬 파일 (`index.html` 더블클릭)** | 브라우저 직접 | Mock | 없음 (오프라인 OK) | 0 |
| **C. Next.js 로컬** | `npm run dev` | Mock or Claude API | 키 사용 시 | 5분 |
| **D. Next.js Vercel/Render** | 클라우드 풀스택 | Mock or Claude API | 필요 | 15분 |

부스 운영 우선순위: **A + B 조합 권장**. C/D 는 Claude API 풍성한 응답이 필요할 때.

---

## 6.2 옵션 A — GitHub Pages

### 6.2.1 1회 활성화 (이미 푸시된 상태에서)

```
1. https://github.com/bstars00-rgb/AI-counsel/settings/pages 접속
2. Source: "Deploy from a branch"
3. Branch: main / (root)
4. Save
5. 1~2분 대기
6. 페이지 상단 박스에 https://bstars00-rgb.github.io/AI-counsel/ 표시되면 완료
```

### 6.2.2 자동 갱신

`main` 브랜치에 push 할 때마다 GitHub Pages 가 자동으로 재배포 (보통 30초~2분).

```bash
git add .
git commit -m "변경 메시지"
git push
```

### 6.2.3 한계

- 정적 호스팅이라 Claude API 호출 불가 (Mock 전용)
- API 키 노출 위험 없음
- `Hotel data/` 폴더의 xlsx 파일은 raw 다운로드 가능 (영업 정보라면 주의)

---

## 6.3 옵션 B — 로컬 파일

`index.html` 단일 파일만 USB / 부스 PC 바탕화면에 복사.

```
1. 저장소에서 index.html 다운로드
   (https://raw.githubusercontent.com/bstars00-rgb/AI-counsel/main/index.html)
2. 부스 PC 바탕화면에 저장
3. 더블클릭으로 브라우저에서 열기
4. F11 (전체화면)
```

**장점**: 인터넷 끊겨도 동작 (Tailwind CDN 만 첫 로드 시 필요 — 한 번 로드되면 브라우저 캐시).

**완전 오프라인** 으로 가려면 Tailwind 도 인라인화 필요 (현재는 CDN 사용). 부스 사전 점검 시 인터넷 1회 연결 후 캐시 적재 권장.

---

## 6.4 옵션 C — Next.js 로컬

### 6.4.1 사전 요구

| 항목 | 버전 |
|---|---|
| Node.js | ≥ 18 (권장 20+) |
| npm | ≥ 9 |

### 6.4.2 설치 + 실행

```bash
# 저장소 클론
git clone https://github.com/bstars00-rgb/AI-counsel.git
cd AI-counsel

# 의존성 설치
npm install

# 환경변수 (선택)
cp .env.example .env
# .env 파일을 열어서 ANTHROPIC_API_KEY 입력
# 키를 입력하지 않으면 자동으로 Mock 모드로 동작

# 개발 서버
npm run dev
# → http://localhost:3000

# 프로덕션 빌드
npm run build
npm run start
```

### 6.4.3 부스 운영 시 권장

```bash
# 빌드해서 정적 모드로 띄우기 (HMR 부담 없음, 더 안정)
npm run build
npm run start

# Chrome/Edge 키오스크 모드로 띄우기 (Windows)
start chrome --kiosk http://localhost:3000

# Mac
open -a "Google Chrome" --args --kiosk http://localhost:3000
```

---

## 6.5 옵션 D — Vercel 배포

### 6.5.1 절차

```
1. https://vercel.com 가입 / 로그인 (GitHub 계정 연동)
2. New Project → Import Git Repository → bstars00-rgb/AI-counsel
3. Framework Preset: Next.js (자동 감지)
4. Environment Variables:
     ANTHROPIC_API_KEY = sk-ant-xxxxx
     ANTHROPIC_MODEL   = claude-opus-4-7   (선택, 기본값과 동일)
     USE_MOCK          = false             (선택)
5. Deploy 클릭
6. ~1분 후 https://ai-counsel-{...}.vercel.app/ 발급
```

`main` 푸시할 때마다 자동 재배포.

### 6.5.2 부스 운영 시 URL

부스 PC 에 Vercel URL 을 즐겨찾기 + 전체화면 모드로 띄움.
인터넷 끊김 대비해 옵션 B (로컬 파일) 도 함께 준비.

---

## 6.6 환경변수

소스: [`.env.example`](../.env.example)

| 키 | 설명 | 기본값 | 필수 |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API 키. 비어 있으면 자동 Mock 모드 | (없음) | API 사용 시 |
| `ANTHROPIC_MODEL` | 사용할 모델 ID | `claude-opus-4-7` | × |
| `USE_MOCK` | `true` 면 키가 있어도 Mock 강제 사용 | `false` | × |

### 6.6.1 모델 비교

| 모델 ID | 응답 품질 | 토큰 비용 | 권장 |
|---|---|---|---|
| `claude-opus-4-7` | 가장 풍부함, 시적 톤 자연스러움 | $$$ | 풀 마케팅 시연 |
| `claude-sonnet-4-6` | 충분히 풍부 | $$ | 일반 운영 |
| `claude-haiku-4-5` | 단조롭지만 빠름 | $ | 트래픽 많은 부스 |

### 6.6.2 키 발급

```
https://console.anthropic.com
→ Settings → API Keys → Create Key
→ 시작용 크레딧 $5 자동 부여 (시연 ~500회 가능)
```

### 6.6.3 보안

- `.env` 는 `.gitignore` 에 포함되어 있음 (소스 미커밋)
- Vercel/Render 등 클라우드에서는 환경변수 UI 로만 등록
- `index.html` (GitHub Pages) 는 키 사용 안 함 (Mock 전용)

---

## 6.7 빌드 산출물

| 옵션 | 산출물 |
|---|---|
| GitHub Pages | `index.html` 단일 파일 (75KB, 데이터 인라인 포함) |
| Next.js (`npm run build`) | `.next/` 디렉토리 (Node 서버 필요) |

---

## 6.8 모니터링 / 로그

### 6.8.1 Next.js 로그

- API 호출 실패 시 `console.error("Fortune API error:", message)` 출력
- Vercel 의 경우 "Functions" 탭에서 실시간 로그 확인 가능

### 6.8.2 Claude 사용량

- https://console.anthropic.com/usage 에서 일별/시간별 토큰 사용량 확인
- 사용량 알람: Console > Settings > Limits 에서 설정 가능

### 6.8.3 부스 현장 디버깅

- 브라우저 DevTools → Console / Network 탭
- F12 → `state` 변수에 현재 view 와 result 가 들어있음 (정적 페이지 한정)

---

## 6.9 트러블슈팅

### 6.9.1 GitHub Pages 빈 화면

```
- Settings → Pages 에서 Source 가 "Deploy from a branch" / main / root 인지 확인
- Actions 탭에서 "pages-build-deployment" 가 성공인지 확인
- 브라우저 캐시 비우기 (Ctrl+Shift+R)
```

### 6.9.2 Claude API 호출 실패

```
응답 mode = "mock-fallback" + error 메시지 확인
- 401: API 키가 잘못됨 (sk-ant- 로 시작해야)
- 429: Rate limit (Anthropic Console > Usage 확인)
- 5xx: Anthropic 서버 이슈 → 잠시 후 재시도 (자동으로 Mock 폴백됨)
```

### 6.9.3 호텔 카드가 안 보임

```
- result.recommended_destination.city 가 풀 외 값인지 확인 (이론상 enum으로 강제됨)
- lib/destinations.ts 에서 해당 도시의 hotelCities 배열 확인
- lib/hotels.ts 의 HOTELS_BY_CITY 에 영문 도시키 존재 확인
- 경주처럼 호텔이 1개뿐인 경우는 정상 동작 (TOP 1 만 표시)
```

### 6.9.4 폰트가 깨짐

```
- 시스템 폰트 폴백 사용 중 (Pretendard / Noto Sans KR / Malgun Gothic 등)
- 부스 PC 에 적절한 한국어 폰트 설치되어 있는지 확인
- 디자인이 어색하다면 Pretendard 폰트 추가 설치
```
