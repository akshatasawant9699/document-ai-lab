import { NextRequest, NextResponse } from "next/server";
import { PRD_SECTIONS, searchPRD } from "@/lib/prd-knowledge";

const SYSTEM_PROMPT = `You are the Document AI Assistant, an expert on Salesforce Data Cloud Document AI. You help developers understand and implement Document AI features.

You have deep knowledge of:
- Document AI's capabilities (extraction API, schemas, LLM models, authentication)
- REST API endpoints and request/response formats
- Schema design best practices and field configuration
- Supported LLM models (Gemini, GPT-4o, Claude, etc.)
- OAuth 2.0 authentication with PKCE
- Confidence scores and interpretation
- Integration with Salesforce (Apex, Flows, Agentforce)
- Supported file types and limitations
- Error handling and troubleshooting

Rules:
- Answer based on the provided context first. If the context doesn't cover the question, use your general knowledge about Salesforce and Document AI.
- Be concise but thorough. Use bullet points for lists.
- Focus on practical, actionable guidance for developers.
- If you genuinely don't know, say so and suggest checking official Salesforce documentation.
- Never make up API endpoints or feature details not in the context.
- Do not discuss internal Salesforce information, customer names, or roadmap details.`;

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
        "I couldn't find specific information about that. Could you rephrase your question? I'm knowledgeable about:\n\n" +
        "- **Document AI Overview** (capabilities, use cases, supported formats)\n" +
        "- **LLM Models** (Gemini, GPT-4o, Claude, model selection)\n" +
        "- **REST API** (endpoints, authentication, request/response formats)\n" +
        "- **Schema Design** (best practices, field types, table extraction)\n" +
        "- **Confidence Scores** (interpretation, thresholds, quality monitoring)\n" +
        "- **Integration** (Apex, Flows, Agentforce, Data Cloud)\n" +
        "- **Error Handling** (troubleshooting, common issues)",
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
  if (lower.includes("model") || lower.includes("gemini") || lower.includes("gpt") || lower.includes("claude")) {
    intro = "Here's what I found about **LLM Models**:\n\n";
  } else if (lower.includes("api") || lower.includes("endpoint") || lower.includes("rest")) {
    intro = "Here's the **API information** I found:\n\n";
  } else if (lower.includes("auth") || lower.includes("oauth") || lower.includes("token") || lower.includes("pkce")) {
    intro = "Here's what I found about **Authentication**:\n\n";
  } else if (lower.includes("schema") || lower.includes("field") || lower.includes("design")) {
    intro = "Here's what I found about **Schema Design**:\n\n";
  } else if (lower.includes("confidence") || lower.includes("score") || lower.includes("accuracy")) {
    intro = "Here's what I found about **Confidence Scores**:\n\n";
  } else if (lower.includes("error") || lower.includes("troubleshoot") || lower.includes("debug") || lower.includes("issue")) {
    intro = "Here's what I found about **Error Handling and Troubleshooting**:\n\n";
  } else if (lower.includes("integration") || lower.includes("apex") || lower.includes("flow") || lower.includes("agent")) {
    intro = "Here's what I found about **Salesforce Integration**:\n\n";
  } else if (lower.includes("file") || lower.includes("format") || lower.includes("pdf") || lower.includes("limit")) {
    intro = "Here's what I found about **File Types and Limits**:\n\n";
  } else if (lower.includes("start") || lower.includes("setup") || lower.includes("begin") || lower.includes("getting")) {
    intro = "Here's what I found about **Getting Started**:\n\n";
  } else if (lower.includes("use case") || lower.includes("example") || lower.includes("invoice") || lower.includes("resume")) {
    intro = "Here's what I found about **Use Cases and Examples**:\n\n";
  } else {
    intro = "Here's what I found:\n\n";
  }

  const content = sections.slice(0, 2).join("\n\n---\n\n");

  return intro + content;
}
