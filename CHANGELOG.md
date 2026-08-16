# 变更记录

## 0.1.0 - 2026-08-15

- 升级 Mpx 全套核心依赖至 `2.11.1`。
- 使用官方 Mpx CLI service 和 Webpack 5 替换旧的 Webpack 4 手工构建链。
- 迁移到 Mpx 官方 ESLint flat config，并补充 lint、verify 和 CI 流程。
- 将平台 API 调用统一为 `mpx.*`，修复 token 刷新、请求拦截和登录弹窗的异常 Promise。
- 为 Web 目标增加登录弹窗的专用组件实现，清理不兼容的跨平台 JSON 配置。
- 增加可配置的 API 环境变量和 npm lockfile，明确 Node.js/npm 版本要求。

## 0.0.1

- 从旧版本迁移到 Mpx 2.5。
