"use client";

import { useLocale } from "@/lib/i18n";
import type { Repo } from "@/lib/github";
import RepoCard from "./RepoCard";

interface RepoListProps {
  repos: Repo[];
  loading: boolean;
  error: string | null;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl glass p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div className="skeleton h-7 w-7 rounded-lg" />
        <div className="skeleton h-7 w-16 rounded-full" />
      </div>
      <div className="skeleton mt-3 h-4 w-3/4 rounded" />
      <div className="skeleton mt-2 h-3 w-full rounded" />
      <div className="skeleton mt-2 h-3 w-2/3 rounded" />
      <div className="mt-3 flex gap-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
        <div className="skeleton h-3 w-12 rounded" />
      </div>
    </div>
  );
}

export default function RepoList({ repos, loading, error }: RepoListProps) {
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl glass py-16 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-400">{error}</p>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl glass py-16 text-center">
        <p className="text-sm text-zinc-400">{t("noResults")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
      {repos.map((repo, i) => (
        <div key={repo.html_url} className="fade-in-up">
          <RepoCard repo={repo} rank={i + 1} />
        </div>
      ))}
    </div>
  );
}
