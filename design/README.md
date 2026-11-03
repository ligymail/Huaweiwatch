# WATCH GT 2 Pro 表盘设计

圆形 454 × 454 模拟表盘，无秒针。白天（06:00–18:00）浅色底，夜晚（18:00–06:00）纯黑底。

## 版面

| 区域 | 内容 | 位置 |
| --- | --- | --- |
| 上半区 | 日期（含年）+ 星期 | 沿垂直中轴对称，例 `2026/11/03 | 周二` |
| 下半区左 | 步数 | 列心 x=152，图标在上、数字在下 |
| 下半区右 | 心率 | 列心 x=302，与左列同 y，图标顶边与数字基线对齐 |

## 文件

- `mockup.html` — 白天/夜晚并排展示的整版效果图（1440×900）
- `dial.html` — 单只表盘渲染页，`#day` / `#night` 切换配色
- `dial-day.png` / `dial-night.png` — 单只表盘 3x 导出
- `gt2pro-watchface-day-night.png` — 并排效果图导出

## 配色

| 用途 | 白天 | 夜晚 |
| --- | --- | --- |
| 背景 | `#F6F3ED` | `#000000` |
| 文字 / 刻度 / 指针 | `#1C1C1C` | `#F4F1EA` |
| 心率图标 | `#C4473A` | `#FF8B82` |

## 渲染

```bash
google-chrome --headless=new --no-sandbox --hide-scrollbars \
  --force-device-scale-factor=3 --window-size=454,454 \
  --screenshot=dial-day.png "file://$PWD/dial.html#day"
```
