// GitHub Trending 页面抓取与类型定义
// 直接抓取 github.com/trending 页面，获取真实的 star 增长量数据

import { fetch as undiciFetch, ProxyAgent } from "undici";

// 检测代理配置（支持系统代理或环境变量）
const proxyUrl =
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.https_proxy ||
  process.env.http_proxy ||
  "";

const dispatcher = proxyUrl ? new ProxyAgent(proxyUrl) : undefined;

export interface RepoOwner {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  owner: RepoOwner;
  topics: string[];
  license: { name: string; spdx_id: string } | null;
  created_at: string;
  updated_at: string;
  stars_growth: number; // 时间段内的 star 增长量（核心指标）
}

export type TimeRange = "daily" | "weekly" | "monthly";

export interface TrendingResult {
  repos: Repo[];
  totalCount: number;
  range: TimeRange;
  fetchedAt: number;
}

const TARGET_COUNT = 20;

// 补充数据源：热门编程语言的 Trending 页面
const SUPPLEMENT_LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "rust",
  "go",
  "java",
];

/**
 * 抓取单个 GitHub Trending 页面（通用或指定语言）
 */
async function fetchTrendingPage(
  range: TimeRange,
  language?: string
): Promise<Repo[]> {
  const langPath = language ? `/${language}` : "";
  const url = `https://github.com/trending${langPath}?since=${range}`;
  const res = await undiciFetch(url, {
    ...(dispatcher ? { dispatcher } : {}),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch GitHub Trending: ${res.status} ${res.statusText}`
    );
  }

  const html = await res.text();
  return parseTrendingHtml(html, range);
}

/**
 * 抓取 GitHub Trending 页面，解析获得真实 star 增长量数据
 * 先抓取通用页面，不足 20 个则并行抓取热门语言页面补充
 * 合并去重后按增长量排序，取前 20
 */
export async function fetchTrending(range: TimeRange): Promise<TrendingResult> {
  // 1. 先抓取通用 Trending 页面
  const generalRepos = await fetchTrendingPage(range);

  // 2. 按全名去重
  const seen = new Set<string>();
  const merged: Repo[] = [];
  for (const repo of generalRepos) {
    if (!seen.has(repo.full_name)) {
      seen.add(repo.full_name);
      merged.push(repo);
    }
  }

  // 3. 如果不足 20 个，并行抓取热门语言页面补充
  if (merged.length < TARGET_COUNT) {
    const langResults = await Promise.allSettled(
      SUPPLEMENT_LANGUAGES.map((lang) => fetchTrendingPage(range, lang))
    );

    for (const result of langResults) {
      if (result.status !== "fulfilled") continue;
      for (const repo of result.value) {
        if (!seen.has(repo.full_name)) {
          seen.add(repo.full_name);
          merged.push(repo);
        }
      }
      // 已收集足够则停止处理后续结果
      if (merged.length >= TARGET_COUNT) break;
    }
  }

  // 4. 按增长量降序排序
  merged.sort((a, b) => b.stars_growth - a.stars_growth);

  // 5. 取前 20 个，重新编号
  const topRepos = merged.slice(0, TARGET_COUNT).map((repo, i) => ({
    ...repo,
    id: i + 1,
  }));

  return {
    repos: topRepos,
    totalCount: topRepos.length,
    range,
    fetchedAt: Date.now(),
  };
}

/** 解码 HTML 实体 */
function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** 清理 HTML 标签，只保留文本 */
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * 解析 GitHub Trending 页面 HTML，提取仓库列表
 * 每个仓库包含真实的 star 增长量数据
 */
function parseTrendingHtml(html: string, _range: TimeRange): Repo[] {
  const repos: Repo[] = [];

  // 按 <article 分割获取每个仓库区块
  const articleSplit = html.split(/<article[^>]*class="[^"]*Box-row[^"]*"/);

  for (let i = 1; i < articleSplit.length; i++) {
    const block = articleSplit[i];
    // 截取到 </article> 之前
    const articleHtml = block.split(/<\/article>/)[0];

    // 提取仓库路径: <h2> 中的 <a href="/owner/repo">
    const repoLinkMatch = articleHtml.match(
      /<h2[^>]*>[\s\S]*?<a[^>]*href="\/([^"]+)"/
    );
    if (!repoLinkMatch) continue;
    const fullPath = repoLinkMatch[1].replace(/^\/+/, "").trim();
    if (!fullPath || fullPath.includes("/blob/") || fullPath.includes("/tree/"))
      continue;

    // 解析 owner 和 name
    const parts = fullPath.split("/");
    if (parts.length < 2) continue;
    const owner = parts[0];
    const name = parts[1];
    const fullName = `${owner}/${name}`;

    // 提取描述（GitHub Trending 中描述段有 col-9 class）
    const descMatch = articleHtml.match(/<p[^>]*col-9[^>]*>([\s\S]*?)<\/p>/);
    const description = descMatch ? decodeHtml(stripTags(descMatch[1])) : null;

    // 提取编程语言
    const langMatch = articleHtml.match(
      /itemprop="programmingLanguage"[^>]*>([^<]+)</
    );
    const language = langMatch ? langMatch[1].trim() : null;

    // 提取总 star 数（匹配 stargazers 链接中 </a> 前的数字，跳过 SVG）
    const starsMatch = articleHtml.match(
      /href="\/[^"]*\/stargazers"[\s\S]*?([\d,]+)\s*<\/a>/
    );
    const totalStars = starsMatch
      ? parseInt(starsMatch[1].replace(/[^0-9]/g, ""), 10)
      : 0;

    // 提取 fork 数（匹配 forks 链接中 </a> 前的数字，跳过 SVG）
    const forksMatch = articleHtml.match(
      /href="\/[^"]*\/forks"[\s\S]*?([\d,]+)\s*<\/a>/
    );
    const forks = forksMatch
      ? parseInt(forksMatch[1].replace(/[^0-9]/g, ""), 10)
      : 0;

    // 提取 star 增长量: "123 stars today" / "1,234 stars this week" / "5,678 stars this month"
    const growthMatch = articleHtml.match(
      /([\d,]+)\s+stars?\s+(today|this\s+week|this\s+month)/i
    );
    const starsGrowth = growthMatch
      ? parseInt(growthMatch[1].replace(/[^0-9]/g, ""), 10)
      : 0;

    repos.push({
      id: i,
      name,
      full_name: fullName,
      html_url: `https://github.com/${fullName}`,
      description,
      stargazers_count: totalStars,
      forks_count: forks,
      watchers_count: 0,
      language,
      owner: {
        login: owner,
        avatar_url: `https://avatars.githubusercontent.com/${owner}`,
        html_url: `https://github.com/${owner}`,
      },
      topics: [],
      license: null,
      created_at: "",
      updated_at: "",
      stars_growth: starsGrowth,
    });
  }

  return repos;
}
