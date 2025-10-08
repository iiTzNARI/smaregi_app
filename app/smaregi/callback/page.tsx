"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setSessionTokens } from "../../../lib/session";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("[Callback] code:", code);
    if (!code) {
      router.replace("/login?error=code_missing");
      return;
    }
    // PKCE: code_verifierをセッションストレージから取得
    const codeVerifier = window.sessionStorage.getItem("smaregi_code_verifier");
    console.log("[Callback] code_verifier:", codeVerifier);
    if (!codeVerifier) {
      router.replace("/login?error=verifier_missing");
      return;
    }
    // 認証APIへcodeとcode_verifierを送信し、アクセストークン取得
    fetch(`/api/smaregi/auth?code=${code}&code_verifier=${codeVerifier}`)
      .then((res) => {
        console.log("[Callback] API status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("[Callback] API response:", data);
        if (data.access_token) {
          setSessionTokens(data.access_token, data.refresh_token);
          console.log("[Callback] setSessionTokens done");
          router.replace("/");
        } else {
          router.replace("/login?error=token_failed");
        }
      })
      .catch((err) => {
        console.error("[Callback] API error:", err);
        router.replace("/login?error=token_failed");
      });
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>ログイン処理中...</h2>
    </div>
  );
}
