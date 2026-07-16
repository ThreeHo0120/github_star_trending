"use client";

import { useTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";
import { useLocale } from "@/lib/i18n";

const OPTIONS: { value: Theme; icon: JSX.Element; labelKey: "themeDark" | "themeLight" | "themeSystem" }[] = [
  {
    value: "light",
    labelKey: "themeLight",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  {
    value: "dark",
    labelKey: "themeDark",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    value: "system",
    labelKey: "themeSystem",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  const activeIndex = OPTIONS.findIndex((o) => o.value === theme);

  return (
    <div className="relative inline-flex items-center gap-0.5 rounded-full glass p-0.5">
      {/* 滑动指示器 */}
      <div
        className="absolute inset-y-0.5 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20 transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.25rem) / ${OPTIONS.length})`,
          transform: `translateX(calc(${activeIndex} * 100% + ${activeIndex} * 0.125rem))`,
          left: "0.125rem",
        }}
      />

      {OPTIONS.map((opt) => {
        const active = opt.value === theme;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-label={t(opt.labelKey)}
            title={t(opt.labelKey)}
            className={`relative z-10 flex items-center justify-center rounded-full px-2 py-1.5 transition-colors duration-300 sm:px-2.5 ${
              active ? "text-white" : "text-muted hover:text-fg"
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
