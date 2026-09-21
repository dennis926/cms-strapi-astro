# SPEC.md — 基于 Strapi 5 的 SEO+GEO 双引擎 CMS 二次开发规范

> **本文件是项目最高优先级规范。任何 AI 模型或开发者接手本项目时，必须首先完整阅读本文件，并在开始任何编码任务前确认已理解全部条款。**
>
> **项目定位：基于 Strapi 5 的二次开发，不是从零自研 CMS。所有开发必须在 Strapi 框架内完成，禁止绕过或修改 Strapi 核心。**

---

## 一、项目定位与核心目标

### 1.1 项目定位

本项目是一个 **SEO + GEO 双引擎驱动的多站点 CMS 系统**，基于 **Strapi 5** 进行二次开发。

**关键原则：**
- **Strapi 5 是基座，不是参考。** 所有内容建模、API 输出、权限管理、插件机制均使用 Strapi 原生能力。
- **二次开发 = 插件 + 自定义 + 配置。** 不修改 Strapi 核心源码，不 fork Strapi 仓库。
- **SEO/GEO 是内置能力，不是外挂插件。** 通过自研 Strapi 插件实现，但数据模型层必须原生支持。

### 1.2 双引擎目标

| 引擎 | 目标 | 衡量标准 |
|---|---|---|
| **SEO** | 内容在传统搜索引擎中排名靠前 | Google/Bing 自然搜索排名、索引覆盖率 |
| **GEO** | 内容被生成式 AI 引擎优先引用 | ChatGPT/Perplexity/Google AI Overviews 引用次数 |

**核心原则：GEO 的本质就是好 SEO。** 不采用"先做 SEO 再补 GEO"的串行策略，在**数据模型、模板渲染、API 输出**三个层面同时满足两者要求。

---

## 二、技术栈约束（固定，不得擅自更换）

| 层级 | 技术选型 | 版本要求 | 约束说明 |
|---|---|---|---|
| **CMS 基座** | Strapi | 5.47+ | 必须使用此版本以上以启用原生 MCP 服务器 |
| **后端语言** | Node.js + TypeScript | Node 20+ / TS 5.4+ | 全项目统一，禁止引入 PHP |
| **数据库** | PostgreSQL | 16+ | 生产环境使用PostgreSQL |
| **缓存** | Redis | 7+ | 用于会话、栏目缓存、API 限流 |
| **前端框架** | Astro | 最新稳定版 | SSG 静态生成模式 |
| **CSS 方案** | Tailwind CSS | v4（CSS-first 配置） | 使用设计令牌架构 |
| **API 风格** | REST + GraphQL（Strapi 原生） | — | 响应格式统一 |
| **结构化数据** | Schema.org 3.0 + JSON-LD | — | 不使用 Microdata 或 RDFa |
| **AI 集成** | Strapi 原生 MCP 服务器 | 5.47+ | 直接利用，不自行实现 |
| **搜索** | Meilisearch | 最新稳定版 | 通过 `strapi-plugin-meilisearch` 同步 |

---

## 三、UI 设计规范（2026 年 Awwwards 获奖标准）

### 3.1 设计哲学

2026 年 Awwwards 获奖网站的显著趋势是**对 AI 生成同质化设计的反叛**。获奖作品强调**噪声、颗粒感、巨大字体和"人手感"**。

- **拒绝"AI味"**：不使用通用渐变色、圆角卡片堆叠、居中大标题+副标题+按钮的模板化布局。
- **排版驱动**：字体和文字编排自己创造世界观。
- **可控的不完美**：使用噪点纹理、不规则形状、有意为之的留白不对称。

### 3.2 响应式架构：三层分离

1. **流式排版（元素级）**：`clamp()` 函数
2. **容器查询（组件级）**：`container-type: inline-size` + `@container`
3. **视口断点（页面级）**：仅用于页面结构切换

### 3.3 设计令牌

```css
@theme {
  --color-primary: oklch(0.55 0.18 250);
  --color-surface: oklch(0.98 0.005 250);
  --font-display: "Instrument Serif", serif;
  --font-body: "Satoshi", sans-serif;
  --spacing-flow: clamp(1rem, 2vw, 3rem);
}
```

---

## 四、Strapi 5 二次开发规范

### 4.1 核心原则：绝不修改核心文件

- 所有自定义通过 **Strapi 插件（Plugin）** 或 **项目级扩展（src/extensions）** 完成。
- 禁止直接修改 `node_modules/strapi` 中的文件。

### 4.2 内容建模

- 使用 Strapi Content-Type Builder
- 开发环境：Admin 面板可视化创建
- 生产环境：`schema.json` 文件纳入版本控制

### 4.3 数据库设计

- PostgreSQL 16 + JSONB 字段
- 所有外键字段必须建索引
- `slug` 字段唯一索引
- 全文搜索推送到 Meilisearch

### 4.4 API 向后兼容

- 不得改变现有 API 响应结构
- 删除或重命名字段需要版本升级

---

## 五、SEO + GEO 融合实现

### 5.1 共享组件 (shared.seo)

- seoTitle, seoDescription, seoCanonical, seoRobots, ogTitle, ogDescription, ogImage, keywords

### 5.2 共享组件 (shared.geo-meta)

- geoEntities, geoFaq, geoHowto, geoAuthoritySignals

### 5.3 Schema.org JSON-LD

- Article, Product, FAQPage, HowTo, Organization, BreadcrumbList
- 每页至少一个 JSON-LD 块

### 5.4 AI 引用表面

- `/llms.txt` — 站点内容结构概述
- `/llms-full.txt` — 扩展版本
- `/robots.txt` — 显式 Allow 主流 AI 爬虫

### 5.5 内容结构规范

- 每篇长文至少一个 FAQ 区块（FAQPage Schema）
- 技术教程包含步骤列表（HowTo Schema）
- 关键结论放段首，使用定义型段落

---

## 六、部署方案

| 项目 | 配置 |
|---|---|
| **后台域名** | `cms.liangyijianye.cn` |
| **前端域名** | `www.liangyijianye.cn` |
| **部署方式** | Docker Compose + Caddy |
| **数据库** | PostgreSQL 16 |
| **缓存** | Redis 7 |
| **搜索** | Meilisearch |

---

## 七、项目文件结构

```
project/
├── SPEC.md                     # 本规范文件
├── docker-compose.yml          # Docker Compose 配置
├── strapi-backend/             # Strapi 5 后端
│   ├── src/
│   │   ├── api/               # 内容类型 API
│   │   ├── components/        # 共享组件
│   │   ├── plugins/           # 自研插件
│   │   ├── extensions/        # Strapi 扩展
│   │   └── middlewares/       # 自定义中间件
│   ├── config/                # 配置文件
│   └── package.json
├── astro-frontend/             # Astro 前端
│   ├── src/
│   │   ├── layouts/           # 布局组件
│   │   ├── pages/             # 页面
│   │   ├── styles/            # 样式
│   │   └── utils/             # 工具函数
│   └── public/                # 静态文件
└── .github/workflows/         # CI/CD
```

---

**以上规范在项目全生命周期中始终有效。**
