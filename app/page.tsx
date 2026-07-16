"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import TimeTabs from "@/components/TimeTabs";
import RepoList from "@/components/RepoList";
import { useLocale } from "@/lib/i18n";
import type { Repo, TimeRange } from "@/lib/github";

interface ApiResponse {
  repos: Repo[];
  totalCount: number;
  range: TimeRange;
  fetchedAt: number;
  error?: string;
  message?: string;
}

export default function Home() {
  const { t, ready } = useLocale();
  const [range, setRange] = useState<TimeRange>("daily");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const loadData = useCallback(
    async (r: TimeRange) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/trending?since=${r}`);
        const data: ApiResponse = await res.json();
        if (!res.ok) {
          setError(data.message || t("loadFailed"));
          setRepos([]);
        } else {
          setRepos(data.repos || []);
          setTotalCount(data.totalCount ?? null);
        }
      } catch {
        setError(t("loadFailed"));
        setRepos([]);
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (ready) {
      loadData(range);
    }
  }, [range, ready, loadData]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 渐变背景光晕 */}
      <div className="pointer-events-none fixed inset-0 bg-aurora" />

      {/* 内容层 */}
      <div className="relative z-10">
        <Header totalCount={totalCount} />
        <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
          <div className="mb-4 flex justify-center sm:mb-6 sm:justify-start">
            <TimeTabs value={range} onChange={setRange} />
          </div>
          <RepoList repos={repos} loading={loading} error={error} />
        </main>
        <footer className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-zinc-600 sm:px-6 sm:py-8">
          {t("poweredBy")}
        </footer>
      </div>
    </div>
  );
}
