"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const TabNavigation = () => {
  const pathname = usePathname();

  const isNewestActive = pathname === "/" || pathname.startsWith("/pages/");
  const isRandomActive = pathname === "/random";

  return (
    <div className="flex rounded-lg bg-[#51381f4d] p-1 mb-6">
      <Link
        href="/"
        className={`rounded-md text-[#FCF0DE] text-xl px-6 py-3 flex items-center justify-center transition-all duration-300 ease-in-out ${
          isNewestActive
            ? "bg-[#59370F] shadow-sm"
            : "hover:bg-[#59370F] hover:opacity-70"
        }`}
      >
        新着順
      </Link>
      <Link
        href="/random"
        className={`rounded-md text-[#FCF0DE] text-xl px-6 py-3 flex items-center justify-center transition-all duration-300 ease-in-out ${
          isRandomActive
            ? "bg-[#59370F] shadow-sm"
            : "hover:bg-[#59370F] hover:opacity-70"
        }`}
      >
        ランダム
      </Link>
    </div>
  );
};
