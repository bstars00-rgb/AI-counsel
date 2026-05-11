"use client";

import { useEffect, useMemo, useState } from "react";
import type { ConsultHistoryItem, ConsultResponse } from "@/lib/types";

type View = "input" | "loading" | "answer" | "staff";

const QUICK_QUESTIONS: { label: string; question: string }[] = [
  {
    label: "가족여행 추천",
    question: "초등학생 아이 2명과 갈 만한 가족여행 추천해주세요",
  },
  {
    label: "부모님 효도여행",
    question: "부모님 모시고 갈 일본 온천 여행 어디가 좋을까요?",
  },
  {
    label: "일본 자유여행",
    question: "3박 4일 오사카 자유여행 일정이 궁금해요",
  },
  {
    label: "동남아 휴양지",
    question: "예산 1인 80만원 정도로 갈 수 있는 동남아 휴양지 추천해주세요",
  },
  {
    label: "제주 호텔 여행",
    question: "제주 3박 4일 호텔 중심 여행 추천해주세요",
  },
  {
    label: "허니문 추천",
    question: "허니문으로 좋은 동남아 리조트 추천해주세요",
  },
  {
    label: "푸꾸옥 vs 나트랑",
    question: "푸꾸옥과 나트랑 중 가족여행으로 어디가 더 좋나요?",
  },
  {
    label: "예산 맞춤 여행",
    question: "1인 100만원 이하로 갈 수 있는 4박 5일 해외 여행 추천해주세요",
  },
];

const STORAGE_KEY = "travelshow.history.v1";
const MAX_HISTORY = 5;

export default function Page() {
  const [view, setView] = useState<View>("input");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<ConsultResponse | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<ConsultHistoryItem[]>([]);

  // localStorage 로딩
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsultHistoryItem[];
        if (Array.isArray(parsed)) setHistory(parsed.slice(0, MAX_HISTORY));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = (item: ConsultHistoryItem) => {
    const next = [item, ...history.filter((h) => h.id !== item.id)].slice(
      0,
      MAX_HISTORY,
    );
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota errors
    }
  };

  const updateHistoryNote = (id: string, newNote: string) => {
    const next = history.map((h) => (h.id === id ? { ...h, note: newNote } : h));
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleAsk = async (raw?: string) => {
    const q = (raw ?? question).trim();
    if (!q) return;
    setQuestion(q);
    setView("loading");
    setError(null);
    setNote("");

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "요청에 실패했습니다.");
      }
      const data = json.data as ConsultResponse;
      setResult(data);
      setMode(json.mode || null);
      setView("answer");

      // 히스토리 저장
      const item: ConsultHistoryItem = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        question: q,
        response: data,
      };
      saveHistory(item);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setView("input");
    }
  };

  const handleReset = () => {
    setView("input");
    setQuestion("");
    setResult(null);
    setMode(null);
    setError(null);
    setNote("");
  };

  const handleCopyAnswer = async () => {
    if (!result) return;
    const a = result.customer_answer;
    const text = [
      `[고객 질문]`,
      result.customer_question,
      ``,
      `[요약]`,
      a.summary,
      ``,
      `[추천 방향]`,
      a.recommendation_direction,
      ``,
      `[추천 일정 / 스타일]`,
      a.suggested_itinerary_or_style,
      ``,
      `[예상 예산대]`,
      a.estimated_budget_range,
      ``,
      `[장점]`,
      ...a.advantages.map((v) => `- ${v}`),
      ``,
      `[주의사항]`,
      ...a.cautions.map((v) => `- ${v}`),
      ``,
      a.next_message_to_customer,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg("답변이 복사되었습니다.");
    } catch {
      setCopyMsg("복사에 실패했습니다. 브라우저에서 권한을 확인해주세요.");
    }
    setTimeout(() => setCopyMsg(null), 2000);
  };

  const handleLoadHistory = (h: ConsultHistoryItem) => {
    setQuestion(h.question);
    setResult(h.response);
    setNote(h.note || "");
    setMode("history");
    setView("answer");
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-800 sm:text-4xl">
              AI 여행상담
            </h1>
            <p className="mt-2 text-base text-slate-600 sm:text-lg">
              궁금한 여행을 입력하면 AI가 먼저 추천해드립니다. 상담원이 이어서 더
              정확한 견적과 상품을 안내해드립니다.
            </p>
          </div>
          {mode && (
            <span
              className="ml-2 hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 sm:inline-block"
              title="응답 모드"
            >
              {mode === "live"
                ? "Claude 실시간"
                : mode === "mock"
                  ? "Mock 응답"
                  : mode === "mock-fallback"
                    ? "Mock (API 실패 폴백)"
                    : mode === "history"
                      ? "히스토리"
                      : mode}
            </span>
          )}
        </header>

        {view === "input" && (
          <InputView
            question={question}
            onChangeQuestion={setQuestion}
            onAsk={handleAsk}
            error={error}
            history={history}
            onLoadHistory={handleLoadHistory}
          />
        )}

        {view === "loading" && <LoadingView question={question} />}

        {(view === "answer" || view === "staff") && result && (
          <ResultView
            result={result}
            view={view}
            onShowStaff={() => setView("staff")}
            onShowAnswer={() => setView("answer")}
            onReset={handleReset}
            onCopy={handleCopyAnswer}
            copyMsg={copyMsg}
            note={note}
            onChangeNote={(v) => {
              setNote(v);
              const latest = history[0];
              if (latest && latest.question === result.customer_question) {
                updateHistoryNote(latest.id, v);
              }
            }}
          />
        )}

        <footer className="mt-12 text-center text-xs text-slate-400">
          본 답변은 AI의 1차 추천이며 확정 가격/실시간 예약 가능 여부는 상담원이
          확인해드립니다.
        </footer>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Input view                                  */
/* -------------------------------------------------------------------------- */

function InputView(props: {
  question: string;
  onChangeQuestion: (v: string) => void;
  onAsk: (raw?: string) => void;
  error: string | null;
  history: ConsultHistoryItem[];
  onLoadHistory: (h: ConsultHistoryItem) => void;
}) {
  const { question, onChangeQuestion, onAsk, error, history, onLoadHistory } =
    props;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
        <label className="block text-base font-semibold text-slate-800 sm:text-lg">
          어떤 여행을 도와드릴까요?
        </label>
        <textarea
          value={question}
          onChange={(e) => onChangeQuestion(e.target.value)}
          placeholder="예: 초등학생 아이 2명과 다낭 4박 5일 가족여행 추천해주세요"
          rows={4}
          className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-base outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200 sm:text-lg"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {question.length} / 2000
          </span>
          <button
            type="button"
            onClick={() => onAsk()}
            disabled={!question.trim()}
            className="inline-flex h-14 min-w-44 items-center justify-center rounded-xl bg-brand-600 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-lg"
          >
            AI 상담받기
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-500">
          빠른 질문 예시
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => {
                onChangeQuestion(q.question);
                onAsk(q.question);
              }}
              className="rounded-xl border border-brand-100 bg-white px-4 py-4 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 sm:text-base"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-500">
            최근 상담 기록 (최대 5건)
          </h2>
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => onLoadHistory(h)}
                  className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <div className="text-xs text-slate-400">
                    {new Date(h.createdAt).toLocaleString("ko-KR")}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm font-medium text-slate-800">
                    {h.question}
                  </div>
                  {h.note && (
                    <div className="mt-1 line-clamp-1 text-xs text-brand-600">
                      메모: {h.note}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Loading                                    */
/* -------------------------------------------------------------------------- */

function LoadingView({ question }: { question: string }) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-lg font-semibold text-slate-800">
        AI가 여행 추천을 준비하고 있어요
      </p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
        “{question}”
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Result (tabs)                                 */
/* -------------------------------------------------------------------------- */

function ResultView(props: {
  result: ConsultResponse;
  view: "answer" | "staff";
  onShowStaff: () => void;
  onShowAnswer: () => void;
  onReset: () => void;
  onCopy: () => void;
  copyMsg: string | null;
  note: string;
  onChangeNote: (v: string) => void;
}) {
  const {
    result,
    view,
    onShowStaff,
    onShowAnswer,
    onReset,
    onCopy,
    copyMsg,
    note,
    onChangeNote,
  } = props;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onShowAnswer}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            view === "answer"
              ? "bg-brand-600 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50"
          }`}
        >
          고객 답변 화면
        </button>
        <button
          type="button"
          onClick={onShowStaff}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            view === "staff"
              ? "bg-brand-600 text-white"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-brand-50"
          }`}
        >
          상담원 화면
        </button>
      </div>

      {view === "answer" ? (
        <CustomerAnswerCard result={result} />
      ) : (
        <StaffCard result={result} note={note} onChangeNote={onChangeNote} />
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {view === "answer" ? (
          <>
            <button
              type="button"
              onClick={onShowStaff}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:text-base"
            >
              상담원과 이어서 상담하기 →
            </button>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              답변 복사
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onShowAnswer}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← 고객 답변 다시 보기
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          다시 질문하기
        </button>
        {copyMsg && (
          <span className="text-sm font-medium text-brand-600">{copyMsg}</span>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Customer answer card                            */
/* -------------------------------------------------------------------------- */

function CustomerAnswerCard({ result }: { result: ConsultResponse }) {
  const a = result.customer_answer;
  return (
    <div className="space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
      <Section title="1. 고객 질문 요약">
        <p className="text-base leading-relaxed text-slate-700">{a.summary}</p>
        <p className="mt-2 text-xs text-slate-400">
          원문: {result.customer_question}
        </p>
      </Section>

      <Section title="2. 추천 여행 방향">
        <p className="text-base leading-relaxed text-slate-700">
          {a.recommendation_direction}
        </p>
      </Section>

      <Section title="3. 추천 일정 또는 여행 스타일">
        <p className="text-base leading-relaxed text-slate-700">
          {a.suggested_itinerary_or_style}
        </p>
      </Section>

      <Section title="4. 예상 예산대">
        <p className="text-base font-semibold leading-relaxed text-brand-700">
          {a.estimated_budget_range}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          ※ 시즌, 항공편, 호텔 등급에 따라 변동될 수 있습니다.
        </p>
      </Section>

      <Section title="5. 장점">
        <ul className="space-y-1.5">
          {a.advantages.map((v, i) => (
            <li
              key={i}
              className="flex gap-2 text-base leading-relaxed text-slate-700"
            >
              <span className="text-brand-500">✓</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="6. 주의사항">
        <ul className="space-y-1.5">
          {a.cautions.map((v, i) => (
            <li
              key={i}
              className="flex gap-2 text-base leading-relaxed text-slate-700"
            >
              <span className="text-amber-500">!</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="7. 상담원에게 이어서 확인하면 좋은 내용">
        <p className="rounded-xl bg-brand-50 p-4 text-base leading-relaxed text-slate-800">
          {a.next_message_to_customer}
        </p>
      </Section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Staff card                                 */
/* -------------------------------------------------------------------------- */

function StaffCard(props: {
  result: ConsultResponse;
  note: string;
  onChangeNote: (v: string) => void;
}) {
  const { result, note, onChangeNote } = props;
  const s = result.staff_summary;
  const probColor = useMemo(() => {
    switch (s.booking_probability) {
      case "High":
        return "bg-emerald-100 text-emerald-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Low":
      default:
        return "bg-slate-200 text-slate-700";
    }
  }, [s.booking_probability]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Section title="1. 고객 질문 원문">
        <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          {result.customer_question}
        </p>
      </Section>

      <Section title="2. AI 답변 요약 (고객용)">
        <p className="text-sm leading-relaxed text-slate-700">
          {result.customer_answer.summary} · {result.customer_answer.estimated_budget_range}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {result.customer_answer.recommendation_direction}
        </p>
      </Section>

      <Section title="3. 상담원용 니즈 분석">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <KV k="관심 목적지" v={s.destination_interest} />
          <KV k="여행 유형" v={s.travel_type} />
          <KV k="인원" v={s.travelers} />
          <KV k="일정" v={s.duration} />
          <KV k="예산 힌트" v={s.budget_hint} />
          <KV
            k="예약 가능성"
            v={
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${probColor}`}
              >
                {s.booking_probability}
              </span>
            }
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <h4 className="mb-1 text-xs font-semibold text-slate-500">
              핵심 니즈
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {s.key_needs.map((v, i) => (
                <span
                  key={i}
                  className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-1 text-xs font-semibold text-slate-500">
              미확인 정보
            </h4>
            <ul className="list-disc pl-4 text-sm text-slate-700">
              {s.missing_information.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="mb-1 text-xs font-semibold text-slate-500">
            추천 상담 방향
          </h4>
          <p className="rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            {s.recommended_consulting_direction}
          </p>
        </div>
      </Section>

      <Section title="4. 바로 물어볼 질문">
        <ol className="list-decimal space-y-1.5 pl-5 text-base text-slate-800">
          {result.staff_questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </Section>

      <Section title="5. 상담 시작 멘트">
        <p className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-base leading-relaxed text-slate-800">
          “{result.staff_opening_script}”
        </p>
      </Section>

      <Section title="6. 상담 메모">
        <textarea
          value={note}
          onChange={(e) => onChangeNote(e.target.value)}
          placeholder="고객 응답, 추천 상품, 다음 액션 등을 메모하세요"
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
        />
        <p className="mt-1 text-xs text-slate-400">
          메모는 자동으로 최근 상담 기록(localStorage)에 저장됩니다.
        </p>
      </Section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Small helpers                               */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-brand-700">{title}</h3>
      {children}
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
      <span className="mr-2 font-semibold text-slate-500">{k}</span>
      <span className="text-slate-800">{v}</span>
    </div>
  );
}
