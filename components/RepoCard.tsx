"use client";

import type { Repo } from "@/lib/github";

interface RepoCardProps {
  repo: Repo;
  rank: number;
}

function formatNumber(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return String(n);
}

export default function RepoCard({ repo, rank }: RepoCardProps) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl glass glass-hover p-4 sm:p-5"
      style={{ animationDelay: `${rank * 30}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        {/* 排名徽章 */}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-zinc-400 sm:h-8 sm:w-8">
          {rank}
        </div>

        {/* 增长量徽章 */}
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 px-2.5 py-1 ring-1 ring-emerald-500/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 text-emerald-400 sm:h-3.5 sm:w-3.5"
          >
            <path d="M7 17l5-5 5 5M7 11l5-5 5 5" />
          </svg>
          <span className="text-xs font-semibold text-emerald-300 sm:text-sm font-mono">
            +{formatNumber(repo.stars_growth)}
          </span>
        </div>
      </div>

      {/* 仓库名 */}
      <div className="mt-3 min-w-0">
        <h3 className="truncate text-sm font-semibold text-zinc-100 transition-colors group-hover:text-white sm:text-base">
          {repo.name}
        </h3>
      </div>

      {/* 描述 */}
      {repo.description && (
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
          {repo.description}
        </p>
      )}

      {/* 底部统计 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-400 to-blue-400" />
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
          </svg>
          {formatNumber(repo.stargazers_count)}
        </span>
        <span className="inline-flex items-center gap-1">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm12-9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9 6h6v2H9V6zm0 12h6v2H9v-2z" />
          </svg>
          {formatNumber(repo.forks_count)}
        </span>
      </div>
    </a>
  );
}
