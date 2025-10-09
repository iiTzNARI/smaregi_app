"use client";
import React from "react";

// PKCE: code_verifier生成
function generateCodeVerifier(length = 64) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let verifier = "";
  for (let i = 0; i < length; i++) {
    verifier += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return verifier;
}

// PKCE: code_challenge生成（SHA256→Base64URL）
async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64;
}

export default function LoginPage() {
  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    window.sessionStorage.setItem("smaregi_code_verifier", codeVerifier);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const SMAREGI_AUTH_URL =
      `https://id.smaregi.dev/authorize?response_type=code` +
      `&client_id=${process.env.NEXT_PUBLIC_SMAREGI_CLIENT_ID}` +
      `&redirect_uri=${process.env.NEXT_PUBLIC_SMAREGI_REDIRECT_URI}` +
      `&scope=pos.transactions:read pos.stores:read` +
      `&state=login` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;
    window.location.href = SMAREGI_AUTH_URL;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "80px",
      }}
    >
      <h1>スマレジ売上アプリ ログイン</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 32px",
          fontSize: "1.2rem",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "32px",
        }}
      >
        スマレジでログイン
      </button>
    </div>
  );
}
