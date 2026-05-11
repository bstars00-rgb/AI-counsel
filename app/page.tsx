"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ConsultHistoryItem,
  ConsultResponse,
  ConsultTurn,
} from "@/lib/types";

type View = "input" | "loading" | "answer" | "staff";

const QUICK_QUESTIONS: string[] = [
  "초등학생 아이 2명과 다낭 4박 5일 가족여행 추천해줘",
  "부모님 모시고 갈 일본 온천 4박 5일 효도여행 추천해줘",
  "직장인 3박 4일 오사카 자유여행 일정 추천해줘",
  "1인 80만원 예산으로 동남아 휴양 3박 5일 추천해줘",
  "제주 호텔 위주 3박 4일 여행 일정 추천해줘",
  "신혼부부 5박 7일 동남아 허니문 리조트 추천해줘",
  "푸꾸옥 vs 나트랑, 가족여행으로 어디가 더 좋아?",
  "1인 100만원 이하로 갈 만한 4박 5일 해외 여행 추천해줘",
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
  /** 멀티턴 대화 이력 (Claude messages 형식). 후속 질문 누적용. */
  const [turns, setTurns] = useState<ConsultTurn[]>([]);
  /** 화면 상단에 표시할 누적 질문 트레일 (사용자가 어떤 흐름이었는지 보여줌) */
  const [questionTrail, setQuestionTrail] = useState<string[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");

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

  const handleAsk = async (
    raw?: string,
    opts: { isFollowUp?: boolean } = {},
  ) => {
    const isFollowUp = !!opts.isFollowUp;
    const q = (raw ?? (isFollowUp ? followUpInput : question)).trim();
    if (!q) return;

    if (!isFollowUp) {
      setQuestion(q);
      setNote("");
      setQuestionTrail([q]);
    } else {
      setQuestionTrail((prev) => [...prev, q]);
    }
    setFollowUpInput("");
    setView("loading");
    setError(null);

    const requestHistory = isFollowUp ? turns : [];

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history: requestHistory }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "요청에 실패했습니다.");
      }
      const data = json.data as ConsultResponse;
      setResult(data);
      setMode(json.mode || null);
      setView("answer");

      // 멀티턴 history 갱신: user + assistant(JSON 직렬화)
      const newTurns: ConsultTurn[] = [
        ...requestHistory,
        { role: "user", content: q },
        { role: "assistant", content: JSON.stringify(data) },
      ];
      setTurns(newTurns);

      // localStorage 저장: 첫 질문이면 새 항목, 후속이면 같은 세션의 최신 결과로 갱신
      if (!isFollowUp) {
        const item: ConsultHistoryItem = {
          id: `${Date.now()}`,
          createdAt: new Date().toISOString(),
          question: q,
          response: data,
        };
        saveHistory(item);
      } else {
        // 직전 세션 갱신 (가장 최근 항목)
        setHistory((prev) => {
          if (prev.length === 0) return prev;
          const [latest, ...rest] = prev;
          const updated: ConsultHistoryItem = {
            ...latest,
            response: data,
          };
          const next = [updated, ...rest];
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setView(isFollowUp ? "answer" : "input");
    }
  };

  const handleReset = () => {
    setView("input");
    setQuestion("");
    setResult(null);
    setMode(null);
    setError(null);
    setNote("");
    setTurns([]);
    setQuestionTrail([]);
    setFollowUpInput("");
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
    // 저장된 결과로 멀티턴 컨텍스트 재구성 (이어서 후속 질문 가능)
    setTurns([
      { role: "user", content: h.question },
      { role: "assistant", content: JSON.stringify(h.response) },
    ]);
    setQuestionTrail([h.question]);
    setFollowUpInput("");
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
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

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-4">
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
                  OHMYCHI AI
                </div>
                <h1 className="text-3xl font-bold text-ink sm:text-4xl">
                  오마이치 AI
                </h1>
                <p className="mt-1 text-base text-ink-soft sm:text-lg">
                  오마이호텔 트래블쇼의 AI 여행상담 도우미. 궁금한 여행을 입력하면
                  먼저 추천해드릴게요.
                </p>
              </div>
            </div>
            {mode && (
              <span
                className="ml-2 hidden shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 sm:inline-block"
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
          </div>
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
              if (latest && latest.question === questionTrail[0]) {
                updateHistoryNote(latest.id, v);
              }
            }}
            questionTrail={questionTrail}
            followUpInput={followUpInput}
            onChangeFollowUpInput={setFollowUpInput}
            onFollowUp={(q) => handleAsk(q, { isFollowUp: true })}
          />
        )}

        <footer className="mt-12 text-center text-xs text-slate-400">
          본 답변은 오마이치 AI 의 1차 추천이며 확정 가격/실시간 예약 가능 여부는
          오마이호텔 상담원이 확인해드립니다.
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
          어떤 여행을 추천해드릴까요?
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
            오마이치에게 물어보기
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                onChangeQuestion(q);
                onAsk(q);
              }}
              className="rounded-xl border border-brand-100 bg-white px-4 py-3.5 text-left text-sm font-medium leading-relaxed text-slate-700 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 sm:text-base"
            >
              {q}
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
      <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-chi-200 border-t-chi-500" />
      <p className="text-lg font-semibold text-slate-800">
        오마이치 AI가 여행 추천을 준비하고 있어요
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
  questionTrail: string[];
  followUpInput: string;
  onChangeFollowUpInput: (v: string) => void;
  onFollowUp: (q: string) => void;
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
    questionTrail,
    followUpInput,
    onChangeFollowUpInput,
    onFollowUp,
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

      {questionTrail.length > 1 && view === "answer" && (
        <QuestionTrail items={questionTrail} />
      )}

      {view === "answer" ? (
        <>
          <CustomerAnswerCard result={result} />
          <FollowUpSection
            suggestions={result.follow_up_suggestions || []}
            input={followUpInput}
            onChangeInput={onChangeFollowUpInput}
            onSubmit={onFollowUp}
          />
        </>
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

/**
 * 누적 질문 트레일 — 후속 질문이 1회 이상 있었을 때 답변 상단에 표시.
 */
function QuestionTrail({ items }: { items: string[] }) {
  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 p-3">
      <div className="mb-1.5 text-xs font-semibold text-brand-700">
        대화 흐름 ({items.length})
      </div>
      <ol className="space-y-1 text-sm text-ink">
        {items.map((q, i) => (
          <li key={i} className="flex gap-2">
            <span className="shrink-0 font-bold text-brand-600">
              {i === 0 ? "Q." : `Q${i + 1}.`}
            </span>
            <span className="leading-relaxed">{q}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * 후속 질문 칩 + 자유 입력 — 답변 카드 아래에 표시.
 */
function FollowUpSection({
  suggestions,
  input,
  onChangeInput,
  onSubmit,
}: {
  suggestions: string[];
  input: string;
  onChangeInput: (v: string) => void;
  onSubmit: (q: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-3 text-sm font-bold text-brand-700">
        오마이치에게 더 깊게 물어보기
      </h3>

      {suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSubmit(s)}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:border-brand-400 hover:bg-brand-100"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              onSubmit(input.trim());
            }
          }}
          placeholder="예: 5박 6일로 늘려서 다시 추천해줘"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-200"
        />
        <button
          type="button"
          onClick={() => input.trim() && onSubmit(input.trim())}
          disabled={!input.trim()}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          이어서 물어보기
        </button>
      </div>
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
        {/* 잎 */}
        <path
          d="M22 8 C 26 2, 32 4, 30 10 C 26 12, 22 11, 22 8 Z"
          fill="#009505"
        />
        {/* 오렌지 원 (굵은 stroke) */}
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
