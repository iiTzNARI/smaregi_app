"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSessionToken, clearSessionTokens } from "@/lib/session";

export const Header = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // セッションストレージ変更時にも認証状態を更新
  useEffect(() => {
    const checkAuth = () => {
      const token = getSessionToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();

    // storageイベントで他タブや同タブの変更も検知
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === "smaregi_access_token" ||
        e.key === "smaregi_refresh_token" ||
        e.key === "smaregi_code_verifier"
      ) {
        checkAuth();
      }
    };
    window.addEventListener("storage", handleStorage);

    // ログアウト直後の即時反映（同タブ用）
    const interval = setInterval(checkAuth, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    clearSessionTokens();
    setIsAuthenticated(false); // 即座に反映
    router.replace("/login");
  };

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">売上表示</h1>
        {isAuthenticated && (
          <Button variant="outline" size="sm" onClick={handleLogout}>
            ログアウト
          </Button>
        )}
      </div>
    </header>
  );
};
