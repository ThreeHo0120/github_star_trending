import { NextRequest, NextResponse } from "next/server";
import { fetchTrending, type TimeRange, type TrendingResult } from "@/lib/github";

// 内存缓存：5分钟，减少对 GitHub Trending 页面的重复请求
const cache = new Map<TimeRange, { data: TrendingResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

const VALID_RANGES: TimeRange[] = ["daily", "weekly", "monthly"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since") as TimeRange | null;

  if (!since || !VALID_RANGES.includes(since)) {
    return NextResponse.json(
      { error: "Invalid 'since' parameter. Use daily, weekly, or monthly." },
      { status: 400 }
    );
  }

  // 检查内存缓存
  const cached = cache.get(since);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const data = await fetchTrending(since);
    // 写入缓存
    cache.set(since, { data, timestamp: Date.now() });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "fetch_failed", message },
      { status: 503 }
    );
  }
}
