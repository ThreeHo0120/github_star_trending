"use client";

import { useLocale } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  totalCount: number | null;
}

export default function Header({ totalCount }: HeaderProps) {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-header-bg backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex items-center gap-2.5 text-lg font-bold sm:text-2xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20 sm:h-10 sm:w-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="h-4 w-4 sm:h-6 sm:w-6"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </span>
              <span className="text-gradient animated-gradient truncate">{t("title")}</span>
            </h1>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LocaleSwitcher />
          </div>
        </div>

        {/* 状态栏 */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t("dataNote")}
          </span>
          {totalCount != null && totalCount > 0 && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-muted">
              {t("totalResults", { count: String(totalCount) })}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
