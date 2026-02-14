# RSVP Service Implementation (SCRUM-553)

## 概述

RSVP（Répondez s'il vous plaît）服務提供活動出席確認功能，允許參與者透過 email 中的連結回覆是否出席活動。

## 功能特點

- JWT token 驗證機制
- 支援出席/不出席兩種回覆選項
- 回覆狀態追蹤與修改功能
- 過期時間檢查
- 響應式設計，支援手機與桌面裝置

## 檔案結構

```
src/app/
├── rsvpService/
│   ├── page.tsx                          # RSVP 頁面路由
│   └── README.md                         # 本文檔
└── ui/rsvpService/
    ├── types.ts                          # TypeScript 型別定義
    ├── mock-data.ts                      # 測試用 Mock 資料（待移除）
    ├── rsvp-confirmation-form.tsx        # 主表單元件
    ├── rsvp-status-banner.tsx            # 狀態橫幅元件
    ├── rsvp-radio-group.tsx              # 單選按鈕群組元件
    └── rsvp-submit-button.tsx            # 提交/編輯按鈕元件
```

## 元件說明

### 1. rsvp-confirmation-form.tsx

主要表單元件，負責：

- 狀態管理（PENDING / ATTEND / NOT_ATTEND）
- API 呼叫（目前使用 mock 資料）
- 使用者互動邏輯

### 2. rsvp-status-banner.tsx

狀態橫幅元件，顯示：

- 已提交狀態（橘色橫幅）
- 過期警告（紅色橫幅）

### 3. rsvp-radio-group.tsx

單選按鈕群組，提供：

- 出席/不出席選項
- 選中狀態視覺回饋
- 禁用狀態支援

### 4. rsvp-submit-button.tsx

動態按鈕元件：

- 「確認送出」模式（首次提交）
- 「修改回覆」模式（已提交後）
- Loading 狀態顯示

### 5. mock-data.ts

集中管理測試資料：

- 參與者資訊
- 活動資訊
- 各種狀態的 mock 回應
- **注意：整合真實 API 後需移除此檔案**

## 頁面狀態流程

```
┌─────────────────────────────────────────────────────────┐
│                    Initial Load                         │
│              (從 JWT token 取得資料)                      │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    未過期                      已過期
         │                       │
    ┌────▼─────┐           ┌────▼─────┐
    │ PENDING  │           │ EXPIRED  │
    │ 可選擇   │           │ 不可操作  │
    └────┬─────┘           └──────────┘
         │
    選擇並提交
         │
    ┌────▼─────────┐
    │  SUBMITTED   │
    │ (ATTEND/NOT) │
    └────┬─────────┘
         │
    點擊「修改回覆」
         │
    ┌────▼─────┐
    │ EDITING  │
    │ 可重新選擇│
    └────┬─────┘
         │
    重新提交
         │
    ┌────▼─────────┐
    │  SUBMITTED   │
    │  (更新狀態)   │
    └──────────────┘
```

## 測試方式

### 啟動開發伺服器

```bash
npm run dev
```

### 測試 URL 格式

基本格式：

```
http://localhost:3000/rsvpService?token={JWT_TOKEN}&mode={TEST_MODE}
```

### 測試場景

#### 1. 首次進入（未過期）

```
http://localhost:3000/rsvpService?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock
```

**預期行為：**

- 顯示活動資訊
- 顯示參與者姓名和信箱
- 兩個選項可選擇
- 未選擇時按鈕為灰色且禁用
- 選擇後按鈕變為可點擊

#### 2. 已回覆「出席」

```
http://localhost:3000/rsvpService?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock&mode=submitted-attend
```

**預期行為：**

- 顯示橘色狀態橫幅：「您的回覆狀態：是，我會準時出席。」
- 顯示最後編輯時間
- 選項被選中但禁用
- 按鈕顯示「修改回覆」

#### 3. 已回覆「不出席」

```
http://localhost:3000/rsvpService?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock&mode=submitted-not-attend
```

**預期行為：**

- 顯示橘色狀態橫幅：「您的回覆狀態：否，我不克出席。」
- 顯示最後編輯時間
- 選項被選中但禁用
- 按鈕顯示「修改回覆」

#### 4. 已過期（未回覆）

```
http://localhost:3000/rsvpService?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired&mode=expired-pending
```

**預期行為：**

- 顯示紅色警告橫幅
- 所有選項禁用
- 按鈕禁用

#### 5. 已過期（已回覆）

```
http://localhost:3000/rsvpService?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired&mode=expired-submitted
```

**預期行為：**

- 顯示紅色狀態橫幅（顯示上次回覆 + 過期警告）
- 訊息內容：「您的回覆狀態：(選擇)。last edited: (時間) 該活動的出缺席回覆期限已過，您無法再進行修改」
- 所有選項禁用
- 按鈕禁用

### 互動測試流程

#### 首次提交流程

1. 訪問首次進入的 URL
2. 選擇「是」或「否」
3. 觀察按鈕從灰色變為可點擊
4. 點擊「確認送出」
5. 等待 1 秒（模擬 API 呼叫）
6. 確認顯示橘色狀態橫幅
7. 確認選項變為禁用
8. 確認按鈕變為「修改回覆」

#### 修改回覆流程

1. 訪問已回覆的 URL
2. 點擊「修改回覆」按鈕
3. 確認選項變為可編輯
4. 選擇不同的選項
5. 點擊「確認送出」
6. 確認狀態更新

## UI 設計規範

### 配色

- Header/Footer 背景：`#2c3e50`
- AWS Educate 橘色：`#EA9D3A`
- 紅色警告橫幅：`#e74c3c`
- 橘色狀態橫幅：`#f39c12`
- 選中狀態背景：`bg-blue-50`
- 選中狀態邊框：`border-blue-300`

### 排版

- 全螢幕佈局，灰色背景 `bg-gray-50`
- 最大寬度：`max-w-4xl`
- 圓角按鈕：`rounded-full`
- 響應式文字大小：`text-sm sm:text-base`

## 後端整合指南

### 環境變數設定

在 `.env.development`、`.env.local`、`.env.production` 中新增：

```env
NEXT_PUBLIC_BACKEND_API_URL=https://your-api-domain.com/api
```

### API 端點規格

#### 1. 取得 RSVP 狀態

**請求：**

```http
GET /rsvp
Authorization: Bearer {JWT_TOKEN}
```

**回應：**

```json
{
  "status": "success",
  "data": {
    "currentStatus": "PENDING" | "ATTEND" | "NOT_ATTEND",
    "participantName": "王小明",
    "participantEmail": "participant@example.com",
    "eventInfo": {
      "name": "AWS Cloud Workshop",
      "startTime": "2026-03-01 09:00",
      "endTime": "2026-03-01 17:00",
      "location": "Taipei 101",
      "deadline": "2026-02-20 23:59"
    },
    "isExpired": false,
    "lastEditedTime": "2026-01-29 21:20" | null
  }
}
```

#### 2. 提交/更新 RSVP

**請求：**

```http
PUT /rsvp
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "action": "ATTEND" | "NOT_ATTEND",
  "clientTimestamp": 1706543210000
}
```

**成功回應（200）：**

```json
{
  "status": "success",
  "data": {
    "currentStatus": "ATTEND" | "NOT_ATTEND",
    "lastEditedTime": "2026-01-29 21:20"
  }
}
```

**衝突回應（409）：**

```json
{
  "status": "error",
  "message": "Concurrent update detected",
  "code": "CONFLICT"
}
```

前端應重試請求。

**過期回應（403）：**

```json
{
  "status": "error",
  "message": "Registration deadline has passed",
  "code": "EXPIRED"
}
```

前端應顯示過期狀態。

### JWT Token 規格

Email template 中生成的 JWT token 必須包含以下 payload：

```typescript
{
  run_id: string,          // 活動場次 ID
  participant_id: string,  // 參與者 ID
  email_id: string,        // Email 記錄 ID
  name: string,            // 參與者姓名
  email: string,           // 參與者信箱
  iat: number,             // 發行時間
  exp: number              // 過期時間
}
```

### 整合步驟

1. **移除 mock 資料**
   - 刪除 `mock-data.ts` 檔案
   - 移除 `rsvp-confirmation-form.tsx` 中的 mock 資料 import

2. **實作 API 呼叫**
   - 在 `rsvp-confirmation-form.tsx` 的 `useEffect` 中實作 GET 請求
   - 在 `handleSubmit` 中實作 PUT 請求
   - 處理錯誤狀態（409, 403, 500 等）

3. **移除測試模式**
   - 移除 `testMode` 參數相關邏輯
   - 移除 URL 中的 `mode` 參數處理

4. **測試真實流程**
   - 使用真實的 JWT token 測試
   - 驗證所有狀態轉換
   - 測試錯誤處理

## Email Template 整合

在 email 中插入 RSVP 按鈕：

```html
<a
  href="https://your-domain.com/rsvpService?token={{JWT_TOKEN}}"
  style="background-color: #2c3e50; color: white; padding: 12px 48px; 
          border-radius: 9999px; text-decoration: none; display: inline-block;"
>
  確認出席
</a>
```

## 注意事項

1. **安全性**
   - JWT token 必須在後端驗證
   - Token 應設定合理的過期時間
   - 使用 HTTPS 傳輸

2. **使用者體驗**
   - 提供清楚的錯誤訊息
   - Loading 狀態要明確
   - 支援手機裝置操作

3. **資料一致性**
   - 處理並發更新（409 Conflict）
   - 客戶端時間戳記用於衝突檢測

4. **測試**
   - 目前使用 mock 資料方便前端開發
   - 透過 URL 參數 `mode` 可測試各種狀態
   - 整合真實 API 前需完整測試所有場景

## 開發狀態

- [x] 前端 UI 實作
- [x] 狀態管理邏輯
- [x] Mock 資料測試
- [ ] 後端 API 整合
- [ ] JWT token 驗證
- [ ] Email template 整合
- [ ] 生產環境測試
