# CRC 中學學務實踐：線上遊戲與 HTML 互動簡報平台

本專案是專為**大二師培生**設計的兒童權利公約 (CRC) 中學學生事務實踐數位教學系統。平台整合了 **50 頁互動簡報**與**學務情境決策模擬遊戲**，前端可直接部署於 GitHub Pages，後端利用 Google Apps Script (GAS) 串接 Google Sheet 做為資料儲存庫。

本系統在教學設計上深度融入 **Bloom 認知面向**、**素養導向**與**探究元素**。

---

## 🌟 核心特色

1. **50 頁 HTML 互動簡報**：
   - 使用 **Reveal.js** 開發，在各平台與行動端皆能流暢翻頁。
   - 頂部設有 **Bloom 認知面向導航指示器**，展示當前頁面所屬認知層級。
   - 右下角設有**快速跳轉選單**，方便在 50 頁之間切換。
   - 內置**互動反思輸入框**，學生的反思想法可即時儲存至後端 Google Sheet。

2. **學務前線情境模擬遊戲**：
   - 玩家扮演初任導師，面臨 6 大攸關學生權利與管教衝突的真實案例（如：全班安全檢查、早自習存廢、冷天加穿大衣、輔導紀錄查閱等）。
   - 設有 **CRC 權利保障度**、**校園管理秩序度**與**教師專業素養度**三大即時動態 HUD 指標。
   - 遊戲結束後自動進行決策路徑特徵分析，導出您的 **CRC 教師人格類型**。
   - 整合姓名與學號填寫表單，一鍵將學習成果送出至 Google Sheet。

3. **安全且免維護的後端串接**：
   - 採用 **Google Apps Script (GAS) Web App** 串接技術。
   - 無需架設獨立伺服器，免除傳統資料庫維護成本。
   - 透過瀏覽器安全設定，不向前端暴露敏感的 API 金鑰與憑證。

---

## 📁 檔案結構

```text
├── index.html            # 入口大廳 (連接簡報與遊戲，設計感的 Portal)
├── slides.html           # 50 頁 HTML 互動簡報 (Reveal.js)
├── game.html             # CRC 學務模擬遊戲 (Canvas/DOM 互動卡牌決策)
├── css/
│   ├── style.css         # 全域美化與 Glassmorphism 基礎樣式
│   ├── slides.css        # 簡報專屬微調樣式
│   └── game.css          # 遊戲卡牌、角色、動態儀表板樣式
├── js/
│   ├── config.js         # 後端 API 串接設定檔 (GAS API URL)
│   ├── slides.js         # 簡報互動邏輯 (進度條、Bloom 導航)
│   └── game.js           # 遊戲核心邏輯 (卡牌事件庫、狀態計算、Sheet 上傳)
├── backend/
│   └── Code.gs           # 需複製到 Google Apps Script 的後端程式碼
└── README.md             # 專案說明書、Bloom 認知架構表與部屬步驟
```

---

## 🚀 部署與設定指引

### 第一步：設定後端 Google Sheet 試算表

1. 登入您的 Google 帳號，在 Google 雲端硬碟建立一個全新的 **Google 試算表**。
2. 點選選單列的 `延伸功能` &rarr; `Apps Script`。
3. 將本專案中 `backend/Code.gs` 的內容複製並覆蓋至 Apps Script 編輯器內，點擊儲存。
4. 點選右上角 `部署` &rarr; `新增部署`：
   - 類型選擇：`網頁應用程式`
   - 專案負責人 (Execute as)：選擇 `我` (您的 Google 帳號)
   - 誰有權限存取 (Who has access)：選擇 `任何人` (Anyone)
5. 點選部署並授權後，複製產生的**網頁應用程式網址** (URL)。
6. 開啟平台首頁 `index.html`，點擊右上角**齒輪按鈕**，將網址貼上並點擊儲存即可！(系統會自動在您的 Google Sheet 中建立 `game_scores` 與 `slides_feedback` 工作表分頁)。

### 第二步：推送至 GitHub Pages 託管

1. 在 GitHub 上建立一個新的公開儲存庫 (Repository)。
2. 本機端開啟終端機（如 Powershell），進入本專案目錄下，依序執行：
   ```powershell
   git init
   git add .
   git commit -m "feat: init CRC learning platform"
   git branch -M main
   git remote add origin https://github.com/您的帳號/您的倉庫名.git
   git push -u origin main
   ```
3. 推送完畢後，在 GitHub 專案頁面的 `Settings` &rarr; `Pages` 內將 `Branch` 設為 `main` 分支並點擊 `Save`。
4. 稍等片刻，即可透過 GitHub Pages 提供的網址公開瀏覽此互動教材！
