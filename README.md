# 室內設計推理 Prompt Generator

這是一個純 HTML / CSS / JavaScript 的室內設計推理 Prompt 生成器。

中心思想不是「產生漂亮圖」，而是把現場、需求、概念與圖面正確性整理成可交給其他 AI 使用的設計提示詞。

## 功能

- 輸入專案基本資料
- 輸入現場條件、問題與使用者行為
- 輸入核心概念與設計語彙
- 產生設計判讀 Prompt
- 產生直接生成 A1 版面 Prompt
- 產生圖面正確性 Prompt
- 產生設計手法與概念圖說 Prompt
- 產生 A1 版面生成 Prompt
- 產生版面修正 Prompt
- 一鍵複製單段或全部 Prompt

## 執行方式

直接開啟：

```text
index.html
```

或在瀏覽器中開啟本資料夾的 `index.html`。

## GitHub Pages 部署

本專案是純靜態網站。GitHub Pages 建議設定為：

- Source: Deploy from a branch
- Branch: main
- Folder: /root

## 使用流程

1. 填入專案資料、現場問題、核心概念與圖面條件
2. 點擊「生成設計 Prompt」
3. 若要直接產版面，先複製「00｜直接生成 A1 版面 Prompt」
4. 貼到 ChatGPT、影像 AI、版面生成 AI 或其他工具
5. 若結果不夠好，用「版面修正 Prompt」要求 AI 重新生成

## 後續可擴充

- 加入不同版型 Prompt 模板
- 加入平面圖、剖面圖與現場照片的標註欄位
- 加入設計手法資料庫
- 加入圖面正確性檢核清單匯出
- 儲存多個專案案例
