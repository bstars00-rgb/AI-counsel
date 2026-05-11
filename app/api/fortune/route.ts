import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FORTUNE_SYSTEM_PROMPT, FORTUNE_RESPONSE_SCHEMA } from "@/lib/prompts";
import { buildMockFortune } from "@/lib/mockData";
import { findDestinationByCity } from "@/lib/destinations";
import { findHotelsForCities } from "@/lib/hotels";
import type {
  BirthHour,
  FortuneInput,
  FortuneResponse,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
const MAX_NAME_LEN = 40;

const VALID_BIRTHHOURS: BirthHour[] = [
  "자시", "축시", "인시", "묘시", "진시", "사시",
  "오시", "미시", "신시", "유시", "술시", "해시",
  "모름",
];

function isValidBirthdate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return false;
  const year = d.getFullYear();
  return year >= 1900 && year <= new Date().getFullYear();
}

export async function POST(req: Request) {
  let body: Partial<FortuneInput> = {};
  try {
    body = (await req.json()) as Partial<FortuneInput>;
  } catch {
    return NextResponse.json({ error: "유효한 JSON 본문이 필요합니다." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const birthdate = (body.birthdate || "").trim();
  const birthtime = (body.birthtime || "모름") as BirthHour;

  if (!name || name.length > MAX_NAME_LEN) {
    return NextResponse.json(
      { error: `이름을 1~${MAX_NAME_LEN}자 사이로 입력해주세요.` },
      { status: 400 },
    );
  }
  if (!isValidBirthdate(birthdate)) {
    return NextResponse.json(
      { error: "생년월일을 YYYY-MM-DD 형식으로 입력해주세요." },
      { status: 400 },
    );
  }
  if (!VALID_BIRTHHOURS.includes(birthtime)) {
    return NextResponse.json(
      { error: "태어난 시(時)를 선택해주세요." },
      { status: 400 },
    );
  }

  const input: FortuneInput = { name, birthdate, birthtime };
  const useMock =
    process.env.USE_MOCK === "true" || !process.env.ANTHROPIC_API_KEY;

  if (useMock) {
    return NextResponse.json({ mode: "mock", data: buildMockFortune(input) });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const today = new Date().toISOString().slice(0, 10);
    const userPrompt = `오늘 날짜: ${today}
이름: ${name}
생년월일: ${birthdate}
태어난 시(時): ${birthtime}

위 정보로 시스템 프롬프트의 규칙에 따라 사주를 가볍게 풀어주고, 어울리는 여행지 한 곳을 추천하는 JSON 을 작성해주세요.`;

    const response = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1500,
      system: [
        {
          type: "text",
          text: FORTUNE_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: FORTUNE_RESPONSE_SCHEMA as unknown as Record<string, unknown>,
        },
      },
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude 응답에서 text 블록을 찾을 수 없습니다.");
    }

    let parsed: FortuneResponse;
    try {
      parsed = JSON.parse(textBlock.text) as FortuneResponse;
    } catch {
      console.error("Fortune JSON parse error:", textBlock.text);
      throw new Error("Claude 응답이 올바른 JSON이 아닙니다.");
    }

    if (!parsed.name) parsed.name = name;

    // 서버 측 호텔 매칭
    const dest = findDestinationByCity(parsed.recommended_destination?.city || "");
    parsed.recommended_hotels = dest
      ? findHotelsForCities(dest.hotelCities, 3)
      : [];

    return NextResponse.json({ mode: "live", data: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Fortune API error:", message);
    return NextResponse.json({
      mode: "mock-fallback",
      error: message,
      data: buildMockFortune(input),
    });
  }
}
