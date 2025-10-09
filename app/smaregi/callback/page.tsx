"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setSessionTokens } from "../../../lib/session";
import { Spinner } from "@/components/ui/spinner";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (!code) {
      router.replace("/login?error=code_missing");
      return;
    }
    const codeVerifier = window.sessionStorage.getItem("smaregi_code_verifier");
    if (!codeVerifier) {
      router.replace("/login?error=verifier_missing");
      return;
    }
    fetch(`/api/smaregi/auth?code=${code}&code_verifier=${codeVerifier}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          setSessionTokens(data.access_token, data.refresh_token);
          router.replace("/");
        } else {
          router.replace("/login?error=token_failed");
        }
      })
      .catch(() => {
        router.replace("/login?error=token_failed");
      });
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px", maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
      <Spinner className="mx-auto mb-6" />
      <h2>ログイン処理中...</h2>
    </div>
  );
}
