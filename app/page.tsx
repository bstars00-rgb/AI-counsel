"use client";

import { useState } from "react";
import { BIRTH_HOUR_OPTIONS } from "@/lib/types";
import type { BirthHour, FortuneInput, FortuneResponse } from "@/lib/types";

type View = "input" | "loading" | "result";

const COUNTRY_LABELS: Record<"jp" | "kr" | "vn", string> = {
  jp: "일본",
  kr: "한국",
  vn: "베트남",
};

export default function Page() {
  const [view, setView] = useState<View>("input");
  const [input, setInput] = useState<FortuneInput>({
    name: "",
    birthdate: "",
    birthtime: "모름",
  });
  const [result, setResult] = useState<FortuneResponse | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    const name = input.name.trim();
    const birthdate = input.birthdate.trim();
    if (!name || !birthdate) {
      setError("이름과 생년월일을 모두 입력해주세요.");
      return;
    }
    setError(null);
    setView("loading");
    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birthdate, birthtime: input.birthtime }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "요청에 실패했습니다.");
      setResult(json.data as FortuneResponse);
      setMode(json.mode || null);
      setView("result");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setView("input");
    }
  };

  const handleAgain = () => {
    setResult(null);
    setMode(null);
    setError(null);
    setView("input");
  };

  const handleReset = () => {
    setInput({ name: "", birthdate: "", birthtime: "모름" });
    setResult(null);
    setMode(null);
    setError(null);
    setView("input");
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          {/* 회사 로고 띠 */}
          <div className="mb-6 flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="text-base font-extrabold tracking-wide text-ink sm:text-lg">
              OHMYHOTEL<span className="text-brand-500">&amp;</span>CO
            </span>
            <span className="ml-auto hidden text-xs font-medium text-ink-soft sm:inline">
              여행은 오마이호텔과 함께
            </span>
          </div>

          <div className="flex items-end gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-100 ring-2 ring-brand-300 shadow-sm sm:h-20 sm:w-20">
              <span className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl">
                🍊
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascot.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                OHMYCHI AI · 사주 여행운세
              </div>
              <h1 className="text-3xl font-bold text-ink sm:text-4xl">
                오마이치가 봐주는 사주 여행지
              </h1>
              <p className="mt-1 text-base text-ink-soft sm:text-lg">
                이름과 생년월일, 태어난 시(時)만 알려주시면 오늘 어울리는 여행지와 호텔을
                골라드릴게요.
              </p>
            </div>
          </div>
          {mode && (
            <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              {mode === "live"
                ? "Claude 실시간"
                : mode === "mock"
                  ? "Mock 응답"
                  : mode === "mock-fallback"
                    ? "Mock (API 실패 폴백)"
                    : mode}
            </div>
          )}
        </header>

        {view === "input" && (
          <InputView
            value={input}
            onChange={setInput}
            onSubmit={handleAsk}
            error={error}
          />
        )}

        {view === "loading" && <LoadingView name={input.name} />}

        {view === "result" && result && (
          <ResultView result={result} onAgain={handleAgain} onReset={handleReset} />
        )}

        <footer className="mt-12 text-center text-xs text-slate-400">
          본 운세는 오마이치 AI 의 가벼운 사주 풀이이며, 정통 명리학과는 다를 수 있습니다.
          <br className="hidden sm:block" />
          입력하신 이름·생년월일·시(時)는 저장되지 않습니다.
        </footer>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Input view                                  */
/* -------------------------------------------------------------------------- */

function InputView({
  value,
  onChange,
  onSubmit,
  error,
}: {
  value: FortuneInput;
  onChange: (v: FortuneInput) => void;
  onSubmit: () => void;
  error: string | null;
}) {
  const canSubmit = value.name.trim() && value.birthdate.trim();

  return (
    <section className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm sm:p-8">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            이름
          </label>
          <input
            type="text"
            value={value.name}
            maxLength={40}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="예: 김민지"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            생년월일
          </label>
          <input
            type="date"
            value={value.birthdate}
            min="1900-01-01"
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => onChange({ ...value, birthdate: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            태어난 시(時)
            <span className="ml-1 text-xs font-normal text-ink-soft">
              모르시면 「모름」 으로 두셔도 돼요
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {BIRTH_HOUR_OPTIONS.map((opt) => {
              const selected = value.birthtime === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({ ...value, birthtime: opt.value as BirthHour })
                  }
                  className={`rounded-xl border px-2 py-2 text-left text-sm font-medium transition ${
                    selected
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-ink hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-xs text-ink-soft">{opt.range}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-brand-600 px-6 text-base font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-lg"
        >
          오늘의 사주 여행지 보기
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Loading                                     */
/* -------------------------------------------------------------------------- */

function LoadingView({ name }: { name: string }) {
  return (
    <section className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white p-10 text-center shadow-sm">
      <div className="mb-4 text-5xl animate-pulse">✨</div>
      <p className="text-lg font-bold text-ink">
        {name ? `${name} 님의 ` : ""}사주를 살피고 있어요
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        오마이치가 오늘 결을 들여다보는 중...
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Result                                      */
/* -------------------------------------------------------------------------- */

function ResultView({
  result,
  onAgain,
  onReset,
}: {
  result: FortuneResponse;
  onAgain: () => void;
  onReset: () => void;
}) {
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <section className="space-y-4">
      {/* 헤드라인 카드 */}
      <div className="overflow-hidden rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6 shadow-sm sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          OHMYCHI SAJU · {today}
        </div>
        <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
          {result.name} 님의 오늘 사주 여행운세
        </h2>
        <p className="mt-2 text-lg font-semibold text-brand-700 sm:text-xl">
          “{result.headline}”
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Stars score={result.overall_score} size="lg" />
          <span className="text-sm font-medium text-ink-soft">
            ({result.overall_score} / 5)
          </span>
        </div>
        {result.saju_keywords?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.saju_keywords.map((k, i) => (
              <span
                key={i}
                className="rounded-full border border-brand-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-brand-700"
              >
                #{k}
              </span>
            ))}
          </div>
        )}
        <p className="mt-4 leading-relaxed text-ink">{result.fortune_summary}</p>
      </div>

      {/* 카테고리 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {result.categories.map((cat) => (
          <div
            key={cat.label}
            className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm"
          >
            <div className="text-xs font-semibold text-brand-700">{cat.label}</div>
            <div className="mt-1.5">
              <Stars score={cat.score} size="sm" />
            </div>
            <p className="mt-2 text-sm leading-snug text-ink">{cat.message}</p>
          </div>
        ))}
      </div>

      {/* 추천 여행지 */}
      <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 via-white to-brand-50 p-6 shadow-sm sm:p-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          오마이치가 사주로 골라준 오늘의 여행지
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-ink-soft">
              {result.recommended_destination.country}
            </div>
            <h3 className="text-2xl font-bold text-ink sm:text-3xl">
              {result.recommended_destination.city}
            </h3>
            <div className="mt-1 inline-flex rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">
              {result.recommended_destination.vibe}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <Stars score={result.recommended_destination.match_score} size="md" />
            <div className="mt-0.5 text-xs text-ink-soft">
              매치 {result.recommended_destination.match_score} / 5
            </div>
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-white/70 p-3 text-sm leading-relaxed text-ink sm:text-base">
          {result.recommended_destination.reason}
        </p>

        <dl className="mt-4 space-y-3 text-sm sm:text-base">
          <div>
            <dt className="text-xs font-semibold text-brand-600">추천 시기</dt>
            <dd className="mt-0.5 text-ink">
              {result.recommended_destination.best_period}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-brand-600">오늘의 작은 팁</dt>
            <dd className="mt-0.5 text-ink">
              {result.recommended_destination.travel_tip}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-brand-600">
              여행지에서 만날 좋은 일
            </dt>
            <dd className="mt-0.5 leading-relaxed text-ink">
              {result.recommended_destination.hidden_gem}
            </dd>
          </div>
        </dl>
      </div>

      {/* 추천 호텔 */}
      {result.recommended_hotels && result.recommended_hotels.length > 0 && (
        <div className="rounded-2xl border-2 border-leaf bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-leaf">
              OHMYHOTEL &amp; CO 추천
            </span>
            <span className="inline-flex h-2 w-2 rounded-full bg-leaf" />
          </div>
          <h3 className="mt-1.5 text-lg font-bold text-ink sm:text-xl">
            {result.recommended_destination.city}에서 묵기 좋은 호텔
          </h3>
          <p className="mt-1 text-xs text-ink-soft">
            오마이호텔 Top 100 ({COUNTRY_LABELS[result.recommended_hotels[0].country]})
            기준 상위 추천
          </p>
          <ul className="mt-4 space-y-2.5">
            {result.recommended_hotels.map((h) => (
              <li
                key={h.code}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-cream p-3 sm:p-4"
              >
                <span className="shrink-0 rounded-md bg-leaf-50 px-2 py-1 text-xs font-bold text-leaf-600">
                  TOP {h.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-ink sm:text-base">{h.name}</div>
                  <div className="mt-0.5 text-xs text-ink-soft sm:text-sm">
                    {h.city} · {h.address}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 행운의 요소 */}
      <div className="grid grid-cols-3 gap-3">
        <LuckyTile label="행운의 색" value={result.lucky.color} />
        <LuckyTile label="행운의 시간" value={result.lucky.time} />
        <LuckyTile label="행운의 숫자" value={result.lucky.number} />
      </div>

      {/* 클로징 */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:p-6">
        <p className="text-sm leading-relaxed text-ink sm:text-base">
          {result.closing_message}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onAgain}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 sm:text-base"
          >
            다른 사주로 다시 보기
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            처음으로
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function Stars({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const cls = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <div className={`inline-flex tracking-tight ${cls}`} aria-label={`${score}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < score ? "text-brand-500" : "text-slate-200"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function LuckyTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-3 text-center shadow-sm sm:p-4">
      <div className="text-xs font-semibold text-brand-600">{label}</div>
      <div className="mt-1 text-sm font-bold text-ink sm:text-base">{value}</div>
    </div>
  );
}

/**
 * OHMYHOTEL & CO 로고 (SVG inline).
 * public/logo.png 가 있으면 그 이미지로 자동 대체됩니다.
 */
function Logo({ className }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <svg
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        aria-label="OHMYHOTEL & CO"
      >
        <defs>
          <linearGradient
            id="omhc-grad"
            x1="6"
            y1="14"
            x2="34"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#e63900" />
            <stop offset="0.55" stopColor="#ff6000" />
            <stop offset="1" stopColor="#ffb000" />
          </linearGradient>
        </defs>
        <path
          d="M22 8 C 26 2, 32 4, 30 10 C 26 12, 22 11, 22 8 Z"
          fill="#009505"
        />
        <circle
          cx="20"
          cy="27"
          r="12"
          stroke="url(#omhc-grad)"
          strokeWidth="5"
          fill="none"
        />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt=""
        className="absolute inset-0 h-full w-auto object-contain"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </span>
  );
}
