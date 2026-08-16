# quick-mpx-weapp-mall

[![CI](https://github.com/hcsdtk/quick-mpx/actions/workflows/ci.yml/badge.svg)](https://github.com/hcsdtk/quick-mpx/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)

一个基于 [Mpx](https://mpxjs.cn/) 2.11 的跨端商城示例项目。源码以微信小程序为基准，同时支持微信小程序、支付宝小程序和 Web 构建。

项目适合作为 Mpx 跨端项目的起始模板，包含以下工程能力：

- TypeScript 严格类型检查
- Mpx Composition API
- 官方 `@mpxjs/pinia` 状态管理
- 官方 Mpx UnoCSS preset 和跨端样式生成
- 微信、支付宝、Web 三端构建
- ESLint、TypeScript 和 GitHub Actions CI

> Mpx 的 Composition API 与 Vue 3 API 形态相近，但项目运行时仍然是 Mpx。页面和组件应遵循 Mpx 的生命周期、组件注册和平台文件约定。

## 环境要求

- Node.js `>=18.18.0`，CI 使用 Node.js 20
- npm `>=9`
- 微信开发者工具（仅在预览微信产物时需要）
- 支付宝小程序开发工具（仅在预览支付宝产物时需要）

## 快速开始

```bash
git clone https://github.com/hcsdtk/quick-mpx.git
cd quick-mpx
npm ci
cp .env.example .env.local
npm run serve
```

开发构建默认输出到 `dist/wx`。在微信开发者工具中打开 `dist/wx` 即可预览；项目根目录的 `project.config.json` 已配置好该目录。

`.env.local` 不提交到仓库。最小配置如下：

```dotenv
VUE_APP_API_URL=https://plan.haosesalad.com
```

## 开发与构建

### 开发模式

```bash
npm run serve              # 微信小程序
npm run serve:ali          # 支付宝小程序
npm run serve:web          # Web
npm run serve:cross        # 微信、支付宝、Web
```

`watch`、`watch:web`、`watch:cross` 是兼容旧项目的开发命令别名。
`watch:prod` 和 `watch:prod:cross` 用于生产模式持续构建。

### 生产构建

```bash
npm run build              # 微信小程序
npm run build:ali          # 支付宝小程序
npm run build:web          # Web
npm run build:cross        # 微信、支付宝、Web
```

### 开发模式单次构建

```bash
npm run build:dev
npm run build:dev:cross
```

产物按目标写入 `dist/`，不会提交到 Git：

```text
dist/
├── wx/
├── ali/
└── web/
```

### 检查与清理

```bash
npm run lint              # ESLint
npm run typecheck         # TypeScript
npm run verify            # lint + typecheck + 微信生产构建
npm run clean             # 删除 dist 和缓存
```

CI 会执行 `npm ci`、`npm run lint`、`npm run typecheck` 和 `npm run build:cross`。

## 项目结构

```text
src/
├── api/                  # API 请求和登录接口
├── app.mpx               # 应用入口、跨端插件和 Pinia 初始化
├── components/           # 可复用 Mpx 组件及平台变体
├── config/               # 应用配置
├── helper/               # Mpx 全局辅助能力
├── pages/                # 页面入口
├── store/                # Pinia setup stores
├── utils/                # 请求、存储和平台能力封装
└── assets/               # 图片和 Stylus 样式

mpx.config.js             # Mpx CLI、Webpack 和跨端输出配置
uno.config.js             # UnoCSS preset 配置
tsconfig.json             # TypeScript 严格检查配置
static/<target>/          # 各平台开发者工具配置
```

## 编码约定

### 页面和组件

页面、组件的业务脚本统一使用 TypeScript 和 Mpx Composition API：

```mpx
<script lang="ts">
import { createPage, ref } from '@mpxjs/core'

createPage({
  setup () {
    const count = ref(0)
    return { count }
  }
})
</script>
```

新增页面或组件时优先使用 `<script lang="ts">` 和 `setup`。当前项目不使用 Vue 3 的 `script setup` 假设，避免把 Vue 3 专属编译宏带入 Mpx 工程。

### 状态管理

状态管理使用官方 `@mpxjs/pinia` setup store：

- `src/store/user.ts`：登录信息、用户信息和 token 过期判断
- `src/store/cart.ts`：购物车商品和金额统计
- `src/app.mpx`：在 `onAppInit` 中创建并注入 Pinia

### 跨端差异

业务代码应优先使用 `@mpxjs/core` 和 `@mpxjs/api-proxy` 的跨端能力。只有在平台 API 或模板确实存在差异时，才使用 `.web.mpx` 等平台文件后缀隔离实现。

UnoCSS 由 `@mpxjs/unocss-base` 和 `@mpxjs/unocss-plugin` 负责跨端转换，构建时会生成对应平台的样式文件，例如 `styles/uno.wxss` 和 `styles/uno.acss`。

## 开源协作

提交修改前请运行：

```bash
npm ci
npm run lint
npm run typecheck
npm run build:cross
```

推荐工作流：

1. 从 `dev` 创建功能分支。
2. 保持提交聚焦，并同步更新必要的文档。
3. 在提交 Pull Request 前通过上述检查。
4. `master` 用于稳定代码，`dev` 用于日常集成。

Bug 或功能建议请提交 [GitHub Issue](https://github.com/hcsdtk/quick-mpx/issues)，代码修改请提交 Pull Request，并说明变更范围和验证方式。

## 许可证

[Apache License 2.0](./LICENSE)
