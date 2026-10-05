# 网页端技术结构与接续规则

## 数据流

`story.js` 提供节点 → `engine.js` 执行推进或选择 → 更新状态和证据 → `storage.js` 写入浏览器本地存档 → `app.js` 渲染 HTML 界面。

## 分层

- `src/core/`：平台无关的剧情状态机；存档层使用 `localStorage`。
- `src/data/`：剧情、画面清单、音频清单。节点 ID 是跨版本稳定合同。
- `assets/`：图片、无声视频、背景音乐和独立人物配音文件。
- `index.html + styles.css + src/app.js`：响应式网页 UI。
- `manifest.webmanifest + service-worker.js`：安装和离线能力。

## 节点合同

每个节点至少包含稳定 `id`、`kind`、`heading`、`speaker`、`text`、`media`、`audioId`，以及 `next` 或 `options[].next`。状态和证据只通过 `onEnter` 或 `options[].effects` 写入。

## 画面与声音

人物、环境和镜头运动放在图片或静音视频中；角色名、对白、字幕和选择由网页绘制。每段配音独立保存并通过节点 ID 关联，因此修改文字、画面或声音时无需重做其他层。

## 部署策略

开发时使用本地 HTTP 服务；发布时使用 HTTPS 静态托管。首屏外的媒体按需缓存，完整视频可迁移到对象存储/CDN。Windows 展示版直接封装本网页，不重新实现剧情。

## 当前边界

网页程序已接入12题、6结局、94个可达节点、6144条合法路线和76条分角色剧情配音。
