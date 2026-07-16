"use client";

import { useLocale } from "@/lib/i18n";
import type { TimeRange } from "@/lib/github";

interface TimeTabsProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const TABS: { value: TimeRange; labelKey: "daily" | "weekly" | "monthly" }[] = [
  { value: "daily", labelKey: "daily" },
  { value: "weekly", labelKey: "weekly" },
  { value: "monthly", labelKey: "monthly" },
];

export default function TimeTabs({ value, onChange }: TimeTabsProps) {
  const { t } = useLocale();

  const activeIndex = TABS.findIndex((tab) => tab.value === value);

  return (
    <div className="relative inline-grid grid-cols-3 rounded-2xl glass p-1">
      {/* 滑动指示器 */}
      <div
        className="absolute inset-y-1 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 shadow-lg shadow-violet-500/25 transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${TABS.length})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
          left: "0.25rem",
        }}
      />

      {TABS.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative z-10 rounded-xl px-4 py-2 text-center text-xs font-medium whitespace-nowrap transition-colors duration-300 sm:px-6 sm:py-2.5 sm:text-sm ${
              active ? "text-white" : "text-muted hover:text-fg"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
