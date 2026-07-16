"use client";

import { useRef } from "react";
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

const RANK_STYLES: Record<number, { badge: string; glow: string }> = {
  1: {
    badge: "bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 shadow-lg shadow-amber-500/30",
    glow: "ring-1 ring-amber-400/30",
  },
  2: {
    badge: "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 shadow-lg shadow-slate-400/20",
    glow: "ring-1 ring-slate-300/20",
  },
  3: {
    badge: "bg-gradient-to-br from-orange-400 to-amber-600 text-orange-950 shadow-lg shadow-orange-500/20",
    glow: "ring-1 ring-orange-400/20",
  },
};

export default function RepoCard({ repo, rank }: RepoCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const rankStyle = RANK_STYLES[rank];

  return (
    <a
      ref={cardRef}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      className={`group relative block h-full rounded-2xl glass glass-hover spotlight-card border-beam p-4 sm:p-5 ${rankStyle ? rankStyle.glow : ""}`}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          {/* 排名徽章 */}
          <div
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:h-8 sm:w-8 ${
              rankStyle ? rankStyle.badge : "bg-surface text-muted"
            }`}
          >
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
            <span className="count-up text-xs font-semibold text-emerald-300 sm:text-sm font-mono">
              +{formatNumber(repo.stars_growth)}
            </span>
          </div>
        </div>

        {/* 仓库名 */}
        <div className="mt-3 min-w-0">
          <h3 className="truncate text-sm font-semibold text-fg transition-colors group-hover:text-primary sm:text-base">
            {repo.name}
          </h3>
        </div>

        {/* 描述 */}
        {repo.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted sm:text-sm">
            {repo.description}
          </p>
        )}

        {/* 底部统计 */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3 text-xs text-subtle">
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
      </div>
    </a>
  );
}
