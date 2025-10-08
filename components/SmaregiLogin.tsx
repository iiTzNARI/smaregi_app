"use client";
import React from "react";

const SMAREGI_AUTH_URL = `https://id.smaregi.dev/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_SMAREGI_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SMAREGI_REDIRECT_URI}&scope=pos.transactions:read pos.stores:read&state=login`;

export const SmaregiLogin: React.FC = () => {
  const handleLogin = () => {
    window.location.href = SMAREGI_AUTH_URL;
  };

  return (
    <button
      onClick={handleLogin}
      style={{ padding: "10px 24px", fontSize: "1rem", background: "#0070f3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
    >
      スマレジでログイン
    </button>
  );
};
