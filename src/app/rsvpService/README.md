# RSVP Service Implementation (SCRUM-553)

## 檔案結構

```
src/
├── app/
│   ├── rsvpService/
│   │   ├── page.tsx                  # Main RSVP page
│   │   └── README.md                 # Documentation
│   └── ui/
│       └── rsvpService/
│           ├── types.ts              # TypeScript type definitions
│           ├── rsvp-confirmation-form.tsx    # Main form component
│           ├── rsvp-status-banner.tsx        # Status banner (expired/submitted)
│           ├── rsvp-radio-group.tsx          # Radio button group
│           └── rsvp-submit-button.tsx        # Submit/Edit button
```

## 測試方式

### 1. 啟動開發伺服器
```bash
npm run dev
```

### 2. 測試各種狀態

訪問以下 URL 測試不同場景：

#### Initial State - 首次進入（未過期）
```
http://localhost:3000/rsvpService?token=test123
```
- 顯示兩個選項（是/否）
- 未選擇時按鈕為灰色不可點擊
- 選擇後按鈕變為可點擊

#### Selected State - 已回覆「出席」
```
http://localhost:3000/rsvpService?token=test123&test=attend
```
- 顯示橘色橫幅：「您的回覆狀態：是，我會準時出席。last edited: 2026-01-29 21:20」
- 選項被選中但禁用
- 按鈕顯示「修改回覆」
- 點擊後可重新選擇

#### Selected State - 已回覆「不出席」
```
http://localhost:3000/rsvpService?token=test123&test=not-attend
```
- 顯示橘色橫幅：「您的回覆狀態：否，我不克出席。last edited: 2026-01-29 21:20」
- 選項被選中但禁用
- 按鈕顯示「修改回覆」

#### Expired State - 已過期（未回覆）
```
http://localhost:3000/rsvpService?token=test123&test=expired
```
- 顯示紅色橫幅警告訊息
- 所有選項禁用
- 按鈕禁用

#### Expired State - 已過期（已回覆）
```
http://localhost:3000/rsvpService?token=test123&test=expired-attend
```
- 顯示橘色橫幅顯示上次回覆
- 所有選項禁用
- 按鈕禁用

### 3. 測試互動流程

#### 首次提交流程
1. 訪問 `?token=test123`
2. 選擇「是」或「否」
3. 點擊「確認送出」
4. 等待 1 秒模擬 API 呼叫
5. 顯示橘色橫幅確認提交成功

#### 修改回覆流程
1. 訪問 `?token=test123&test=attend`
2. 點擊「修改回覆」
3. 選項變為可編輯
4. 選擇不同選項
5. 點擊「確認送出」
6. 更新回覆狀態

## 頁面狀態機

```
Initial (首次進入)
├─ 未過期 → 可選擇「是/否」→ 確認送出 → Selected
└─ 已過期 → 顯示紅色警告訊息 (不可操作)

Selected (已回覆過)
├─ 顯示上次回覆狀態 (橘色區塊 + last edited 時間)
├─ 按「修改回覆」→ enable 選項 → 確認送出 → 更新 Selected
└─ 已過期 → 顯示橘色區塊但不可修改
```

## UI 設計

### 排版
- 與 `insert-button-attendance-preview.tsx` 相同的排版風格
- 全螢幕佈局，灰色背景
- 深藍色 header 和 footer
- 中央內容區域使用白色背景（僅在預覽元件中）

### 顏色
- Header/Footer: `#2c3e50`
- AWS Educate 橘色: `#EA9D3A`
- 紅色警告橫幅: `#e74c3c`
- 橘色狀態橫幅: `#f39c12`
- 選中狀態: 藍色背景 `bg-blue-50`

### 元件
- 圓角按鈕 `rounded-full`
- SVG 圖示（勾選/圓圈）
- 響應式設計 `max-w-4xl mx-auto`

## 待完成事項 (TODO)

### Backend Integration

在 `rsvp-confirmation-form.tsx` 中：

1. 替換 mock 資料為實際 API 呼叫：
```typescript
// TODO: Replace with actual API call
const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rsvp`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

2. 實作提交邏輯：
```typescript
// TODO: Replace with actual API call
const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rsvp`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: selectedOption,
    clientTimestamp: Date.now(),
  }),
});

// Handle 409 Conflict (retry)
if (response.status === 409) {
  await new Promise(r => setTimeout(r, 500));
  return handleSubmit();
}

// Handle 403 Forbidden (expired)
if (response.status === 403) {
  setIsExpired(true);
  return;
}
```

3. 環境變數設定：
在 `.env.development`, `.env.local`, `.env.production` 中新增：
```
NEXT_PUBLIC_BACKEND_API_URL=<your-backend-api-url>
```

### JWT Token

Email template 中生成 JWT token 時，需包含：
```typescript
{
  run_id: string,
  participant_id: string,
  email_id: string,
  name: string,
  iat: number,
  exp: number
}
```

### Email Template

在 email 中插入 RSVP 按鈕的 URL：
```
https://yoursite.com/rsvpService?token={generated_jwt_token}
```

## 注意事項

1. 目前使用 mock 資料方便前端開發測試
2. 透過 URL 參數 `?test=` 可以測試各種狀態
3. 實際部署時需要移除測試模式，連接真實後端 API
4. 確保 JWT token 驗證在後端實作
5. 時間格式使用 `zh-TW` locale
