import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    instanceUrl,
    accessToken,
    apiVersion,
    fileBase64,
    mimeType,
    schema,
    model,
    idpConfigName,
  } = body;

  if (!instanceUrl || !accessToken || !fileBase64 || !mimeType) {
    return NextResponse.json(
      { error: "Missing required fields: instanceUrl, accessToken, fileBase64, mimeType" },
      { status: 400 }
    );
  }

  const version = apiVersion || "v65.0";
  const endpoint =
    `${instanceUrl}/services/data/${version}/ssot/document-processing/actions/extract-data` +
    `?htmlEncode=false&extractDataWithConfidenceScore=true`;

  const payload: Record<string, unknown> = {
    files: [{ mimeType, data: fileBase64 }],
  };

  if (idpConfigName) {
    payload.idpConfigurationIdOrName = idpConfigName;
  } else {
    payload.mlModel = model || "llmgateway__VertexAIGemini20Flash001";
    if (schema) payload.schemaConfig = schema;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    let data;
    try {
      const cleaned = text
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#92;/g, "\\");
      data = JSON.parse(cleaned);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || `API returned ${response.status}`, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
