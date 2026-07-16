"use client";

import { useLocale } from "@/lib/i18n";
import type { TimeRange } from "@/lib/github";

interface TimeTabsProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export default function TimeTabs({ value, onChange }: TimeTabsProps) {
  const { t } = useLocale();

  const tabs: { value: TimeRange; label: string }[] = [
    { value: "daily", label: t("daily") },
    { value: "weekly", label: t("weekly") },
    { value: "monthly", label: t("monthly") },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl glass p-1">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-sm ${
              active
                ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/25"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
