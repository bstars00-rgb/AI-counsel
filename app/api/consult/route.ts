import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from "@/lib/prompts";
import { buildMockResponse } from "@/lib/mockData";
import type { ConsultResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";

export async function POST(req: Request) {
  let body: { question?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "유효한 JSON 본문이 필요합니다." }, { status: 400 });
  }

  const question = (body.question || "").trim();
  if (!question) {
    return NextResponse.json({ error: "질문이 비어 있습니다." }, { status: 400 });
  }
  if (question.length > 2000) {
    return NextResponse.json({ error: "질문이 너무 깁니다 (최대 2000자)." }, { status: 400 });
  }

  const useMock =
    process.env.USE_MOCK === "true" || !process.env.ANTHROPIC_API_KEY;

  if (useMock) {
    return NextResponse.json({
      mode: "mock",
      data: buildMockResponse(question),
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
      messages: [
        {
          role: "user",
          content: `고객 입력 질문:\n"""${question}"""\n\n위 질문에 대해 시스템 프롬프트의 규칙대로 JSON 응답을 작성해주세요.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude 응답에서 text 블록을 찾을 수 없습니다.");
    }

    let parsed: ConsultResponse;
    try {
      parsed = JSON.parse(textBlock.text) as ConsultResponse;
    } catch (e) {
      console.error("JSON parse error:", textBlock.text);
      throw new Error("Claude 응답이 올바른 JSON이 아닙니다.");
    }

    // 고객 질문 원문 보강 (모델이 가끔 빈 문자열로 두는 경우 대비)
    if (!parsed.customer_question) {
      parsed.customer_question = question;
    }

    return NextResponse.json({ mode: "live", data: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Claude API error:", message);
    // 실제 API 호출 실패 시 Mock 응답으로 폴백 (현장 운영 중단 방지)
    return NextResponse.json({
      mode: "mock-fallback",
      error: message,
      data: buildMockResponse(question),
    });
  }
}
