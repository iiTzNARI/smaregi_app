import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const codeVerifier = searchParams.get("code_verifier");
  if (!code) {
    return NextResponse.json(
      { error: "認証コードがありません" },
      { status: 400 }
    );
  }
  if (!codeVerifier) {
    return NextResponse.json(
      { error: "code_verifierがありません" },
      { status: 400 }
    );
  }

  // スマレジAPI: アクセストークン取得（PKCE対応）
  const bodyParams = {
    grant_type: "authorization_code",
    code,
    code_verifier: codeVerifier,
    client_id: process.env.NEXT_PUBLIC_SMAREGI_CLIENT_ID!,
    client_secret: process.env.SMAREGI_CLIENT_SECRET!,
    redirect_uri: process.env.NEXT_PUBLIC_SMAREGI_REDIRECT_URI!,
  };
  console.log("[smaregi/auth] token request body:", bodyParams);
  // const tokenRes = await fetch('https://id.smaregi.dev/token', {
  const tokenRes = await fetch("https://id.smaregi.dev/authorize/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(bodyParams),
  });

  const tokenJson = await tokenRes.json();
  console.log("[smaregi/auth] token response:", tokenJson);
  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "アクセストークン取得失敗", detail: tokenJson },
      { status: 500 }
    );
  }

  return NextResponse.json(tokenJson);
}
