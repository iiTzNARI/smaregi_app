// components/Header.tsx
import React from "react";

export const Header = () => {
  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <h1 className="text-xl font-bold">売上表示</h1>
      </div>
    </header>
  );
};
