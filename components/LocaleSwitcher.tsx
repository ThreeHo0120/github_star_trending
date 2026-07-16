"use client";

import { useLocale } from "@/lib/i18n";

export default function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-medium text-fg transition-all duration-300 hover:bg-surface-hover hover:text-primary sm:text-sm"
      aria-label="Switch language"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {t("switchLang")}
    </button>
  );
}
