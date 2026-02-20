# 从“临摹仓库”到“shadcn式可复用组件库”的完整改进方案

## 摘要
你当前已经完成了很关键的一步：有了 docs 路由壳层、组件 registry、组件详情页和可复制说明。  
下一阶段要从“能展示”升级到“可长期复用、可稳定维护、可规模化扩展”。

本方案按你已选择的方向制定：
- 分发模式：`CLI 复制源码`
- 样式体系：`Tailwind + design tokens`
- 近 1-2 个月优先：`组件工程化质量`

---

## 1) 行业标准流程（shadcn/reactbits 这类通常怎么做）

### Phase A: 设计拆解（Design Deconstruction）
1. 收集参考组件并拆解为：布局、动效、状态、主题、交互语义、可访问性。
2. 明确“可配置面”与“固定实现面”：哪些是 props，哪些是内部实现。
3. 先做静态基线，再加动效，再做 API 收敛（避免一开始 props 爆炸）。

### Phase B: 组件工程化（Component Productization）
1. 定义稳定 API（命名、默认值、受控/非受控、事件回调）。
2. 建立 tokens（颜色/间距/圆角/阴影/动效时长）与组件层解耦。
3. 补类型、可访问性、边界状态、reduced motion。
4. 输出“安装+使用+Props+示例+已知限制”。

### Phase C: 分发与文档（Distribution + Docs）
1. 组件元数据清单（manifest）驱动官网渲染，不手写分散文档。
2. CLI 按清单拷贝组件文件（含依赖关系与后置提示）。
3. 文档站展示：Preview、API、Copy 指令、变更记录、版本兼容说明。

### Phase D: 质量闭环（Quality Loop）
1. lint/typecheck/build 必过。
2. 视觉回归 + 交互测试 + a11y 检查。
3. 每个组件有“验收清单”与“发布门禁”。

---

## 2) 你当前“组件化”的问题与官网优缺点（基于仓库现状）

### 优点（已做对）
1. 已有 docs 路由结构：`src/app/router.tsx`。
2. 已有统一 registry：`src/lib/component-registry.tsx`。
3. 详情页有 Preview + Props + Copy 信息：`src/pages/docs/component-detail-page.tsx`。
4. 多数组件有类型与 CSS Variables，可配置意识较好（如 `CreditCard`、`NeonNetwork`、`SimpleGraph`）。
5. 移动端侧栏/焦点态等基础可用性开始具备：`src/app/layouts/docs-layout.tsx`、`src/styles/site.css`。

### 主要问题（离 shadcn 还差的关键层）
1. **技术路径不一致**：当前不是 Tailwind 体系（无 `tailwind.config.*`、无 `postcss.config.*`），与目标“React+Tailwind”不一致。
2. **分发链路缺失**：只有页面“复制说明”，没有 CLI 自动化安装与依赖注入。
3. **README 未产品化**：`README.md` 仍是 Vite 模板文案，不是组件库入口文档。
4. **元数据仍偏手工**：registry 和组件真实 API 之间未建立自动校验，长期易漂移。
5. **导出规范不统一**：存在 default/named 混用（如 `src/components/CreditCard.tsx` 与 `src/components/ui/index.ts`）。
6. **缺少测试体系**：无组件行为测试、无 a11y 自动检查、无视觉回归。
7. **官网“可查找性”不足**：搜索是占位，缺少标签过滤、排序、状态标识、更新日志。
8. **组件成熟度标签未工程化**：`stable/beta` 只有展示，没有发布门禁或质量标准映射。

---

## 3) 目标架构（决策完成版）

### 3.1 仓库分层
1. `src/components/ui/*`：组件源码（Tailwind + tokens）。
2. `src/content/components/*.mdx`：组件文档正文（可选，先保留 registry 驱动也可）。
3. `src/lib/registry/*.json|ts`：组件清单（单一真相源）。
4. `scripts/`：CLI 与校验脚本（安装、清单校验、依赖检查）。
5. `tests/`：行为测试、a11y、回归测试。

### 3.2 分发模式（shadcn-like）
1. 新增 `registry.manifest.json`，每个组件声明：
   - `name`、`slug`、`files`
   - `dependencies`、`peerDependencies`
   - `tailwindTokens`、`cssVars`（如有）
   - `imports`、`examples`
2. 新增 CLI 命令：
   - `components add <slug>`
   - 功能：拷贝文件、检查依赖、输出后续步骤
3. 官网“Copy”按钮调用同一份 manifest 文案，避免双维护。

### 3.3 样式迁移策略（不一次性推翻）
1. 旧组件保留 CSS Variables（兼容层）。
2. 新组件统一 Tailwind + token class 方案。
3. 旧组件按“使用频率优先”逐步迁移到 Tailwind（先 `CreditCard`/`SimpleGraph`）。

### 3.4 官网信息架构升级
1. 目录页增加：分类过滤、标签过滤、稳定性筛选、最近更新排序。
2. 详情页增加：依赖表、受控/非受控说明、可访问性说明、已知限制。
3. 增加“Changelog / Migration Notes”页面。
4. 搜索从占位升级为本地索引（先前端 Fuse.js 级别即可）。

---

## 4) 重要公共接口 / 类型改造

### 新增类型（核心）
1. `ComponentManifest`  
2. `ComponentDependencySpec`  
3. `ComponentInstallRecipe`  
4. `ComponentQualityGate`（`draft|beta|stable` 对应门禁）

### 现有类型调整
1. 扩展 `ComponentMeta`（`src/lib/types.ts`）：
   - 增加 `dependencies`、`a11yNotes`、`controlledPatterns`、`updatedAt`
2. `component-registry.tsx` 拆为：
   - `component-manifest.ts`（纯数据）
   - `component-preview-map.tsx`（仅预览映射，避免数据/渲染耦合）

### 导出规范统一
1. 统一采用 named export（对齐 shadcn 常见习惯）。
2. 提供兼容层文件，但标记 deprecated（一个小版本后移除）。

---

## 5) 测试与验收场景（必须具备）

### 组件层
1. 受控/非受控行为测试（`flipped`/`defaultFlipped` 这类）。
2. 键盘可访问性测试（Enter/Space、焦点可见）。
3. reduced-motion 测试。
4. props 默认值与边界值测试。

### 文档站层
1. registry 每个 slug 均可打开详情页。
2. manifest 与详情页 props 表字段一致性校验。
3. 搜索/筛选结果与组件集合一致。
4. 404、重定向、移动端侧栏交互可用。

### 分发层（CLI）
1. `components add <slug>` 拷贝文件完整性。
2. 缺失依赖时提示与自动安装策略。
3. 重复安装幂等性。
4. Windows/macOS 路径兼容。

---

## 6) 迭代计划（8 周）

### 第 1-2 周：基础工程化
1. 建立 manifest schema + 校验脚本。
2. README 重写为组件库文档入口。
3. 统一导出规范与命名规则。

### 第 3-4 周：CLI 与官网联动
1. 实现 `components add` CLI。
2. 官网详情页接入依赖/安装配方字段。
3. 搜索与筛选能力上线。

### 第 5-6 周：Tailwind 迁移试点
1. 迁移 2 个核心组件到 Tailwind + tokens。
2. 建立 token 规范文档（颜色/半径/阴影/动效）。
3. 保留旧 CSS 兼容层与迁移说明。

### 第 7-8 周：质量闭环
1. 建立行为测试 + a11y 自动检查。
2. 为 `stable` 组件定义发布门禁。
3. 输出 v1 里程碑与后续路线图。

---

## 7) 明确假设与默认决策
1. 默认以“源码复制复用”而非 npm 包为主路径。
2. 默认逐步迁移 Tailwind，不一次性重写所有旧组件。
3. 默认优先做工程质量，不以“组件数量增长”为短期核心目标。
4. 默认继续沿用当前 docs 架构（`HashRouter`）直到需要 SEO/SSR 再切换。

