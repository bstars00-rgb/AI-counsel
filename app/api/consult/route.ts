import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from "@/lib/prompts";
import { buildMockResponse } from "@/lib/mockData";
import type { ConsultResponse, ConsultTurn } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
const MAX_TURNS = 12; // 안전 상한 (user+assistant 합쳐서 12개)
const MAX_QUESTION_LEN = 2000;

interface ConsultRequest {
  /** 첫 질문(이전 history 없음) 또는 후속 질문 */
  question?: string;
  /** 누적 대화 (없으면 첫 요청, 있으면 후속). 클라이언트가 관리. */
  history?: ConsultTurn[];
}

export async function POST(req: Request) {
  let body: ConsultRequest = {};
  try {
    body = (await req.json()) as ConsultRequest;
  } catch {
    return NextResponse.json({ error: "유효한 JSON 본문이 필요합니다." }, { status: 400 });
  }

  const question = (body.question || "").trim();
  const history: ConsultTurn[] = Array.isArray(body.history) ? body.history : [];

  if (!question) {
    return NextResponse.json({ error: "질문이 비어 있습니다." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LEN) {
    return NextResponse.json(
      { error: `질문이 너무 깁니다 (최대 ${MAX_QUESTION_LEN}자).` },
      { status: 400 },
    );
  }
  if (history.length > MAX_TURNS) {
    return NextResponse.json(
      { error: `대화가 너무 길어졌습니다. "다시 질문하기"로 새로 시작해주세요.` },
      { status: 400 },
    );
  }

  // 최종 messages 배열 구성 (history + 새 question)
  const messages: ConsultTurn[] = [
    ...history,
    { role: "user", content: question },
  ];

  const useMock =
    process.env.USE_MOCK === "true" || !process.env.ANTHROPIC_API_KEY;

  if (useMock) {
    return NextResponse.json({
      mode: "mock",
      data: buildMockResponse(question, history),
    });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 2000,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: RESPONSE_SCHEMA as unknown as Record<string, unknown>,
        },
      },
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude 응답에서 text 블록을 찾을 수 없습니다.");
    }

    let parsed: ConsultResponse;
    try {
      parsed = JSON.parse(textBlock.text) as ConsultResponse;
    } catch {
      console.error("JSON parse error:", textBlock.text);
      throw new Error("Claude 응답이 올바른 JSON이 아닙니다.");
    }

    // 첫 질문일 경우 원문 보강
    if (!parsed.customer_question) {
      parsed.customer_question = question;
    }
    // follow_up_suggestions가 누락된 응답 대비 빈 배열로 정규화
    if (!Array.isArray(parsed.follow_up_suggestions)) {
      parsed.follow_up_suggestions = [];
    }

    return NextResponse.json({ mode: "live", data: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Claude API error:", message);
    return NextResponse.json({
      mode: "mock-fallback",
      error: message,
      data: buildMockResponse(question, history),
    });
  }
}
