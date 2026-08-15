# quick-mpx-weapp-mall

一个基于 Mpx 2.11 的跨端商城小程序示例，源码以微信小程序为基准，同时支持支付宝小程序和 Web 构建。

## 环境要求

- Node.js `>=18.18.0`
- npm `>=9`
- 微信开发者工具（预览微信产物时）

## 快速开始

```bash
npm ci
cp .env.example .env.local
npm run serve
```

`npm run watch` 是 `npm run serve` 的兼容别名，旧项目中的开发命令可以继续使用。

开发构建默认输出到 `dist/wx`。在微信开发者工具中打开 `dist/wx` 即可预览；项目根目录的 `project.config.json` 已配置好该目录。

生产构建：

```bash
npm run build
```

## 构建目标

```bash
# 微信小程序
npm run serve
npm run build

# 支付宝小程序
npm run serve:ali
npm run build:ali

# Web
npm run serve:web
npm run build:web

# 一次输出微信、支付宝和 Web
npm run serve:cross
npm run build:cross
```

升级前的常用命令仍保留兼容入口：

```bash
npm run watch              # 开发模式
npm run watch:web          # Web 开发模式
npm run watch:cross        # 微信、支付宝、Web 开发模式
npm run watch:prod         # 生产模式持续构建
npm run build:dev          # 开发模式单次构建
npm run build:dev:cross    # 开发模式跨端单次构建
```

## 常用检查

```bash
npm run lint
npm run lint:fix
npm run verify
npm run clean
```

`verify` 会依次执行 ESLint 和微信生产构建。依赖版本由 `package-lock.json` 锁定，日常安装请使用 `npm ci`。

## 配置约定

- `mpx.config.js`：Mpx CLI、Webpack 5、跨端输出和 rpx 转换配置。
- `src/`：页面、组件、状态管理、请求封装和静态资源。
- `static/<target>/`：各平台需要复制到构建产物的开发者工具配置。
- `.env.local`：本地 API 地址，不提交到仓库；示例见 `.env.example`。
- `dist/`：构建产物，已加入 `.gitignore`。

业务代码统一通过 `@mpxjs/core` 暴露的 `mpx` API 调用平台能力，并由 `@mpxjs/api-proxy` 负责跨平台适配。微信专属组件差异使用 `.web.mpx` 等平台文件后缀隔离，避免在非微信目标中引入不支持的属性。

## 许可证

[Apache License 2.0](./LICENSE)
