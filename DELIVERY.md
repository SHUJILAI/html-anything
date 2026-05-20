# HTML-Anything · 交付说明

> 输入任意文字意图 → 自动结构化 → 套用 15 套手工调过的样式 → 输出 self-contained HTML 页面

---

## 1. 这是什么

一个**单页 Web 工具**：用户在输入框写一句需求或粘一段笔记，左侧选一种视觉风格，点 **Generate**，几秒后右侧得到一份完整可分享的 HTML 页面。

**目标场景**

| 场景 | 用什么样式 |
|---|---|
| 写产品发布说明 / 功能博客 | Notion / Linear、Long-form Essay、Product Landing |
| 做演示用 slide-style 卡片 | Minimal Pitch、Keynote Modern、Swiss International |
| 内部周报 / 会议纪要 / 看板 | Meeting Notes、Terminal / Runbook |
| 营销短文案 / 朋友圈截图 | Twitter / X Card、Magazine Poster、Vintage Magazine |
| 试验性视觉 | Cyberpunk Terminal、Brutalist、E-ink Editorial、Kami Parchment |

**输出形态**：HTML 单文件，所有 CSS 内联，零外部依赖，复制到任何地方都能直接打开。

---

## 2. 工作原理

```
┌──────────────────┐    ┌────────────────────┐    ┌──────────────────┐
│  用户输入意图     │ →  │  Optimizer (haiku) │ →  │  Style (sonnet)  │ →  HTML
│  + 选样式         │    │  补结构 / 加要点    │    │  套视觉规范       │
└──────────────────┘    └────────────────────┘    └──────────────────┘
       │                         │                         │
       │                         │                         │
   单输入框                  快+便宜                   质量+稳定
   隐性需求 placeholder      80 行 system prompt      350 行/样式 prompt
```

**两阶段 LLM 调用**：

1. **结构化阶段**（Claude Haiku 4.5，~1s）
   - 把杂乱意图（"我想做一个 v0.4 发布说明，重点是 auto-blocks 功能"）变成结构化 Markdown：自动加 H1 / 章节 / 要点 / 占位数据
   - 强约束：**忠于原意、不编造数据、保留专有名词**
   - 用户感知：输入框是"写需求"，不是"写 markdown"

2. **样式阶段**（Claude Sonnet 4.6，~5s）
   - 拿到结构化 Markdown，喂给所选样式的 system prompt
   - 每个样式的 prompt 包含：VIBE / LAYOUT / TYPOGRAPHY / PALETTE / DON'T / 一段 HTML 锚点片段（few-shot）
   - 强约束：**self-contained、CSS 全内联、零外部依赖**

**为什么两阶段：** 一阶段大模型直出，对于杂乱输入容易"漏要点"或"编数据"。两阶段把"梳理"和"美化"解耦，便宜模型干结构化，贵模型干视觉，**整体成本反而比单次 sonnet 调用低**，质量更稳。

**Raw mode 开关**：已经写好 markdown 的高级用户可以跳过 optimizer，直接走样式阶段。

---

## 3. 样式池（15 个）

每个样式都有：明确的设计参考 + 调色板 + 排版栈 + few-shot HTML 锚点 + 反例约束。

| ID | 名字 | 类目 | 风格参考 |
|---|---|---|---|
| `notion-linear` | Notion / Linear | doc | Linear/Notion 文档页，三栏 + 右 TOC |
| `kami-parchment` | Kami Parchment | doc | 古纸 / 羊皮纸，warm cream + 衬线 |
| `swiss-international` | Swiss International | deck | Massimo Vignelli / Müller-Brockmann，IKB 蓝 |
| `eink-editorial` | E-ink Editorial | deck | Kindle / 电纸书杂志封面 |
| `magazine-poster` | Magazine Poster | poster | 报纸 + strikethrough 大字标题 |
| `academic-paper` | Long-form Essay | doc | 工程长文 + drop-cap + bleed 数据图 |
| `terminal-code` | Terminal / Runbook | special | 暗色运维 runbook，薄荷绿 + syntax token |
| `keynote-modern` | Keynote Modern | deck | Apple Keynote 现代风 |
| `minimal-pitch` | Minimal Pitch | deck | 极简 pitch deck 卡片堆叠 |
| `vintage-magazine` | Vintage Magazine | poster | 70 年代杂志 |
| `product-landing` | Product Landing | marketing | 标准 SaaS 落地页 |
| `handwritten-notes` | Meeting Notes | doc | 内部会议纪要，含 attendees / 行动项表 |
| `card-summary` | Twitter / X Card | marketing | 像素级 X 暗色卡 |
| `cyberpunk-neon` | Cyberpunk Terminal | special | 暗色 CRT 终端 + neon |
| `brutalist` | Brutalist | special | 巨大字号 + 危险条纹 |

视觉冲击力梯度：**brutalist > cyberpunk > magazine > vintage > swiss > 其余**。需要"哇"效果的演示场景优先选前 3。

---

## 4. 关键技术点

### 4.1 自加载 `.env`（无 dotenv 依赖）
```js
// server.js — 启动时读 .env，避免 supervisor 重启丢凭证
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
```
解决一个非常隐蔽的 bug：进程被外部 supervisor 重启时不带 env，`.env` 自加载消除了这层依赖。

### 4.2 Token 鉴权（`x-ha-token` 头）
- 公开：`/api/styles`、`/s/:id`（已分享页面）、首页
- 鉴权：`/api/generate`、`/api/share`、`/admin/*`
- 前端：localStorage 存 token，🔑 按钮设置，所有写接口走 `authedFetch()`

### 4.3 滑动窗口限流（in-memory）
- 12 次 generate / 60 秒 / 每 IP
- 防止公开链接被脚本爆刷烧 LLM 额度
- 没用 redis，零外部依赖；进程重启计数清零（可接受）

### 4.4 Append-only 事件日志 + 看板
- 每次 generate / share / error 写一行 JSON 到 `data/events.jsonl`
- `/admin` 是 token-gated 看板：总调用、成功率、平均延迟、Top 样式、按小时柱状图、独立 IP
- 一键下载 `events.jsonl` 用于离线分析

### 4.5 内容长度护栏
- `MAX_CONTENT_CHARS=50000` 默认，防止用户粘长篇大作触发超长上下文成本

### 4.6 静态资源 zero-build
- `public/` 直接静态服务
- `style.css` 包含 15 个 CSS-only 缩略图（`.thumb-{id}`）— 不依赖任何图片
- 骨架屏在数据返回前立即填充，避免空白闪烁

### 4.7 自包含输出
样式 prompt 里强约束：所有 CSS 内联、不允许外部 image URL、不允许 `<link>`、不允许 `<script>`。生成的 HTML 复制到任何地方都能开。

---

## 5. 文件结构

```
html-anything/
├── server.js          # Express 后端（中间件 + 路由 + AI Gateway 代理）
├── styles.js          # 15 套样式 prompt（核心资产）
├── optimizer.js       # 意图→结构化 prompt（haiku）
├── lib.js             # auth / rate-limit / analytics 工具函数
├── public/
│   ├── index.html     # 主界面
│   ├── app.js         # 前端逻辑 + token 管理
│   ├── style.css      # UI + 15 个 CSS-only 缩略图
│   ├── samples.js     # 5 个示例输入
│   └── admin.html     # 数据看板
├── data/events.jsonl  # 运行时事件日志（gitignored）
├── shares/            # 已分享 HTML（gitignored）
├── .env.example       # 凭证模板
├── .env               # 实际凭证（gitignored）
├── README.md          # 部署说明
└── DELIVERY.md        # 本文件
```

---

## 6. 部署

```bash
# 1. 装依赖（只有 express）
npm install

# 2. 复制 .env.example -> .env，填三个变量
cp .env.example .env
# 编辑：
#   AI_GATEWAY_BASE_URL=https://your-gateway.com
#   AI_GATEWAY_API_KEY=sk-...
#   ACCESS_TOKEN=任意你想要的 token   # 想完全公开就删这行

# 3. 起服务
node server.js          # 默认端口 8080
PORT=3000 node server.js

# 4. 浏览器打开 http://localhost:8080，🔑 输入 ACCESS_TOKEN
```

**生产部署**：扔到任何 Node.js 容器（Render、Railway、Fly.io、自己的 VPS），同样 4 步。

---

## 7. 添加一个新样式

1. 在 `styles.js` 末尾（数组结尾前）加一个对象：
```js
{
  id: "my-new-style",
  name: "My New Style",
  category: "doc",   // doc | deck | poster | marketing | special
  accent: "#hexcolor",
  bg: "#hexcolor",
  description: "一句话描述（缩略图下方）",
  prompt: `Output a complete <!DOCTYPE html>...</html> page in the **风格名** style.

VIBE: ...
LAYOUT (must include): ...
TYPOGRAPHY: ...
PALETTE (use exactly these): ...
ABSOLUTELY DON'T: ...
ANCHOR — match this stylistic direction:
\`\`\`html
<...一段示例 HTML 锚点...>
\`\`\`
REQUIREMENTS:
- All CSS inline
- Output ONLY the HTML.`,
}
```

2. 在 `public/style.css` 加一段 CSS-only 缩略图：
```css
.thumb-my-new-style { background: #...; padding: 8px 10px; }
.thumb-my-new-style::before { content: "..."; ... }
.thumb-my-new-style::after  { content: ""; ... }
```

3. 重启 server，新样式自动出现在网格里。

**Prompt 写作清单（v2 版）**

- [ ] VIBE 一句话定调
- [ ] LAYOUT 至少 5 条具体结构
- [ ] PALETTE 给出 hex 色值（`--bg --fg --muted --border --accent`）
- [ ] TYPOGRAPHY 三档字体栈（display / body / mono）
- [ ] DON'T 至少 3 条反例
- [ ] ANCHOR 一段 30~80 行 HTML 锚点（few-shot）

---

## 8. 数据安全 & 成本

| 维度 | 当前防护 |
|---|---|
| 防爆刷 | rate limit 12/60s/IP + token 鉴权 |
| 防长上下文 | `MAX_CONTENT_CHARS=50000` 输入截断 |
| 凭证不泄漏 | `.gitignore` 包含 `.env` 和 `data/events.jsonl` |
| 日志可观测 | 全量事件 JSONL + 看板 |
| 成本结构 | optimizer 用 haiku（~$0.001/次），样式用 sonnet（~$0.02/次），单次端到端约 **$0.02** |

---

## 9. 工具访问

**线上工具**：https://8080-capy-1775841235697-506885-preview.happycapy.ai

**默认 token**：`demo-token-1234`（点🔑按钮粘进去）

**看板**：https://8080-capy-1775841235697-506885-preview.happycapy.ai/admin

**代码仓**：`outputs/html-anything/`（直接 `git init` 推到任何 GitHub 仓即可）

---

## 10. 后续可做（按价值排序）

1. **跑全 15 样式 × 3 输入的基准**（半天，找出 corner-case 抖动）
2. **补一个真·学术论文样式**（IEEE 双栏 / abstract / references）
3. **加 modifier**（dark/light、tight/loose、minimal/dense）让每个样式可调
4. **接外部存储**（S3 / R2）替换本地 `shares/`，支持永久分享
5. **接 Stripe**，做成 SaaS（按生成次数计费）
6. **CLI 包装**（`npx html-anything "make me a launch post"` 直接出 HTML）
