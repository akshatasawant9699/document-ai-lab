import { NextRequest, NextResponse } from "next/server";
import { PRD_SECTIONS, searchPRD } from "@/lib/prd-knowledge";

const SYSTEM_PROMPT = `You are the Document AI Assistant, an expert on Salesforce Data Cloud Document AI. You help developers and product teams understand Document AI features, capabilities, APIs, and the upcoming 262 Release enhancements.

You have deep knowledge of:
- Document AI's current capabilities (extraction API, schemas, LLM models, authentication)
- The 262 Release Feature Proposal Package with 3 strategic enhancements:
  1. Smart Page Processing Controls (page limits, selection strategies, context windows)
  2. Configuration Lifecycle Management with Versioning (version control, rollback, comparison)
  3. Enhanced Visual Citations with Confidence Overlay (bounding boxes, confidence UI, annotated export)
- Implementation timelines, customer blockers, API changes, and competitive analysis

Rules:
- Answer based on the provided context first. If the context doesn't cover the question, use your general knowledge about Salesforce and Document AI.
- Be concise but thorough. Use bullet points for lists.
- When referencing specific features, mention which of the 3 features they belong to.
- If you genuinely don't know, say so and suggest where to look.
- Never make up API endpoints or feature details not in the context.`;

export async function POST(request: NextRequest) {
  const { message, history } = await request.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const relevantSections = searchPRD(message);

  const context = relevantSections.length > 0
    ? relevantSections.join("\n\n---\n\n")
    : PRD_SECTIONS.slice(0, 3).map((s) => `## ${s.title}\n${s.content}`).join("\n\n---\n\n");

  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    return handleAIChat(message, context, history || [], openaiKey);
  }

  return handleLocalChat(message, relevantSections);
}

async function handleAIChat(
  message: string,
  context: string,
  history: { role: string; content: string }[],
  apiKey: string
) {
  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT + "\n\nRelevant context from the Document AI PRD:\n\n" + context },
      ...history.slice(-8),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { error: `OpenAI API error: ${err.error?.message || response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      reply: data.choices[0].message.content,
      source: "ai",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI chat failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function handleLocalChat(message: string, relevantSections: string[]) {
  if (relevantSections.length === 0) {
    return NextResponse.json({
      reply:
        "I couldn't find specific information about that in the Document AI PRD. Could you rephrase your question? I'm knowledgeable about:\n\n" +
        "- **Smart Page Processing Controls** (page limits, selection strategies, context windows)\n" +
        "- **Configuration Versioning** (version control, rollback, comparison)\n" +
        "- **Visual Citations** (bounding boxes, confidence overlay, annotated export)\n" +
        "- **Document AI APIs** (extraction endpoint, authentication, supported models)\n" +
        "- **Implementation timeline**, customer blockers, and competitive analysis",
      source: "local",
    });
  }

  const answer = buildLocalAnswer(message, relevantSections);

  return NextResponse.json({
    reply: answer,
    source: "local",
  });
}

function buildLocalAnswer(query: string, sections: string[]): string {
  const lower = query.toLowerCase();

  let intro = "";
  if (lower.includes("feature 1") || lower.includes("page") || lower.includes("cost") || lower.includes("token") || lower.includes("context window")) {
    intro = "Here's what I found about **Smart Page Processing Controls** (Feature 1):\n\n";
  } else if (lower.includes("feature 2") || lower.includes("version") || lower.includes("rollback") || lower.includes("lifecycle")) {
    intro = "Here's what I found about **Configuration Lifecycle Management** (Feature 2):\n\n";
  } else if (lower.includes("feature 3") || lower.includes("visual") || lower.includes("bounding") || lower.includes("citation") || lower.includes("confidence") || lower.includes("overlay")) {
    intro = "Here's what I found about **Visual Citations with Confidence Overlay** (Feature 3):\n\n";
  } else if (lower.includes("api") || lower.includes("endpoint")) {
    intro = "Here's the API information I found:\n\n";
  } else if (lower.includes("timeline") || lower.includes("phase") || lower.includes("implementation") || lower.includes("resource")) {
    intro = "Here's the implementation timeline information:\n\n";
  } else if (lower.includes("customer") || lower.includes("blocker") || lower.includes("beta")) {
    intro = "Here's the customer/blocker information:\n\n";
  } else if (lower.includes("risk")) {
    intro = "Here's the risk assessment:\n\n";
  } else if (lower.includes("compet")) {
    intro = "Here's the competitive analysis:\n\n";
  } else {
    intro = "Here's what I found:\n\n";
  }

  const content = sections.slice(0, 2).join("\n\n---\n\n");

  return intro + content + "\n\n*This answer is from the Document AI PRD. For AI-powered answers, set the `OPENAI_API_KEY` environment variable.*";
}
