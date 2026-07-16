"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type Locale = "zh" | "en";

const STORAGE_KEY = "github-star-locale";

// 中英文字典：覆盖所有界面静态文案
const dict: Record<Locale, Record<string, string>> = {
  zh: {
    title: "GitHub Star 热门浏览",
    subtitle: "发现近期增长最快的开源项目",
    daily: "本日",
    weekly: "本周",
    monthly: "本月",
    loading: "加载中...",
    loadFailed: "加载失败",
    empty: "暂无数据",
    retry: "重试",
    stars: "Star",
    forks: "Fork",
    language: "语言",
    dataNote: "数据来自 GitHub Trending，按 Star 增长量排序",
    poweredBy: "数据来源：GitHub Trending",
    noDescription: "暂无描述",
    totalResults: "共 {count} 个项目",
    updated: "更新于",
    viewOnGithub: "在 GitHub 查看",
    switchLang: "English",
    desc: "描述",
    starsGrowth: "增长",
    totalStars: "总 Star",
  },
  en: {
    title: "GitHub Star Trending",
    subtitle: "Discover the fastest-growing open-source projects",
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
    loading: "Loading...",
    loadFailed: "Failed to load",
    empty: "No results",
    retry: "Retry",
    stars: "Stars",
    forks: "Forks",
    language: "Language",
    dataNote: "Data from GitHub Trending, sorted by star growth",
    poweredBy: "Data source: GitHub Trending",
    noDescription: "No description",
    totalResults: "{count} repositories found",
    updated: "Updated",
    viewOnGithub: "View on GitHub",
    switchLang: "中文",
    desc: "Description",
    starsGrowth: "Growth",
    totalStars: "Total Stars",
  },
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  ready: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [ready, setReady] = useState(false);

  // 客户端 mount 后读取 localStorage，避免 hydration 不一致
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "zh" || saved === "en") {
      setLocaleState(saved);
    }
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage 不可用时静默忽略
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text = dict[locale][key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, ready }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
