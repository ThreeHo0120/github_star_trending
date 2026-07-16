# GitHub Star 热门浏览

> 发现 GitHub 上增长最快的开源项目，按 Star 增长量排序（今日 / 本周 / 本月）。

**中文** | [English](./README.md)

![GitHub Star 热门浏览](./public/screenshot.png)

## 功能特性

- **真实增长量数据** — 直接抓取 GitHub Trending 页面，获取真实的 Star 增长量，而非总 Star 数
- **时间范围筛选** — 支持今日、本周、本月切换查看增长排行
- **前 20 个项目** — 并行抓取多个编程语言分类页面，合并去重确保 20 个结果
- **毛玻璃 UI** — 现代主题，毛玻璃卡片 + 极光渐变背景 + 流畅微交互动画
- **主题切换** — 浅色 / 深色 / 跟随系统三态切换，`localStorage` 持久化 + 防闪烁脚本
- **卡片特效** — 鼠标聚光灯、边框光束动画、Top 3 金银铜徽章、数字滚动入场
- **完全响应式** — 移动端单列展示，桌面端双列网格
- **中英文切换** — 支持中文/英文切换，`localStorage` 持久化语言偏好
- **5 分钟缓存** — 服务端内存缓存，减少重复请求

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| 语言 | TypeScript |
| 数据源 | GitHub Trending 页面抓取 |
| HTTP 代理 | undici (ProxyAgent) |
| 字体 | Geist Sans + Geist Mono |

## 快速开始

### 环境要求

- Node.js 18.17+
- npm / yarn / pnpm

### 安装

```bash
# 克隆仓库
git clone https://gitee.com/ThreeHo/github_star_trending.git
cd github_star_trending

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可访问。

### 代理配置（可选）

如果你使用了代理工具（如 Clash、V2Ray），请创建 `.env.local` 文件：

```env
HTTPS_PROXY=http://127.0.0.1:7890
HTTP_PROXY=http://127.0.0.1:7890
```

## 项目结构

```
├── app/
│   ├── api/trending/route.ts   # API 路由，含 5 分钟缓存
│   ├── globals.css             # 全局样式（毛玻璃、动画）
│   ├── layout.tsx              # 根布局，字体配置
│   └── page.tsx                # 主页面
├── components/
│   ├── Header.tsx              # 粘性导航栏，渐变标题
│   ├── LocaleSwitcher.tsx      # 语言切换按钮
│   ├── RepoCard.tsx            # 毛玻璃项目卡片，含增长徽章
│   ├── RepoList.tsx            # 网格布局 + shimmer 骨架屏
│   ├── ThemeSwitcher.tsx       # 浅色/深色/跟随系统主题切换
│   └── TimeTabs.tsx            # 渐变胶囊标签（今日/本周/本月）
├── lib/
│   ├── github.ts               # GitHub Trending 抓取 + 多语言合并
│   ├── i18n.tsx                # React Context 国际化（中/英）
│   └── theme.tsx               # 主题 Provider（深色/浅色/系统）
└── package.json
```

## 构建与部署

```bash
# 生产环境构建
npm run build

# 启动生产服务器
npm run start
```

## 开源协议

MIT
