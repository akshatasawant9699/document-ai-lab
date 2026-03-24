import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, codeVerifier, redirectUri, loginUrl, clientId, clientSecret } =
    body;

  if (!code || !redirectUri || !loginUrl || !clientId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const tokenUrl = `${loginUrl}/services/oauth2/token`;

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  });

  if (clientSecret) params.append("client_secret", clientSecret);
  if (codeVerifier) params.append("code_verifier", codeVerifier);

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || data.error || "Token exchange failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      access_token: data.access_token,
      instance_url: data.instance_url,
      token_type: data.token_type,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Token exchange failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
