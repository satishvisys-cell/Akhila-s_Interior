import { NextResponse } from "next/server";
import { requireApiSession, jsonError } from "@/lib/auth/api-guard";
import { aiImproveSchema } from "@/lib/api/schemas";
import { appendAuditLog } from "@/lib/cms/audit";

const TONE_HINT: Record<string, string> = {
  premium:
    "Make the copy more premium, architectural, and editorial — calm, precise, never salesy.",
  warm: "Make the copy warmer and more human while staying professional.",
  shorter: "Tighten the copy; keep the meaning, cut filler.",
};

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";

export async function POST(request: Request) {
  const auth = await requireApiSession("page:write");
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "AI improve is not configured. Set GROQ_API_KEY on the server.",
        disabled: true,
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = aiImproveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { fieldKey, currentText, tone = "premium", maxWords = 180 } =
    parsed.data;

  const system = [
    "You improve website copy for a premium interior design studio named Akhila.",
    "Return ONLY the improved text — no quotes, no preamble, no markdown.",
    TONE_HINT[tone] ?? TONE_HINT.premium,
    `Aim for roughly ${maxWords} words or fewer unless the source is already shorter.`,
    "Preserve factual claims; do not invent awards, numbers, or locations.",
  ].join(" ");

  try {
    const res = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL,
        temperature: 0.6,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Field: ${fieldKey}\n\nCurrent copy:\n${currentText}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        {
          error: "AI provider request failed",
          details: errText.slice(0, 400),
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const suggestion = data.choices?.[0]?.message?.content?.trim();
    if (!suggestion) {
      return jsonError("Empty AI response", 502);
    }

    await appendAuditLog({
      actorId: auth.session.userId,
      action: "ai_improve",
      entityType: "about",
      entityId: fieldKey,
    });

    return NextResponse.json({ suggestion });
  } catch {
    return jsonError("AI improve failed", 502);
  }
}
