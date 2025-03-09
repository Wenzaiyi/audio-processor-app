# 音頻處理應用

這是一個開源的音頻處理網頁應用，提供音頻文件的上傳、人聲分離、說話者分離和降噪功能。

## 功能特點

1. **文件上傳功能**
   - 支持的格式：mp3, wav, m4a, aac, ogg, flac, wma
   - 最大文件大小：50MB
   - 上傳區域支持拖拽上傳和點擊上傳
   - 顯示上傳進度條

2. **音頻處理功能**
   - 人聲分離：將人聲從背景音樂/環境音中分離
   - 說話者分離：識別並分離不同說話者的聲音
   - 音頻降噪：降低背景噪音
   - 顯示處理進度條和狀態提示

3. **文件管理功能**
   - 處理完成後提供下載按鈕
   - 文件保存3天後自動刪除
   - 支持查看處理狀態

4. **界面設計**
   - 簡潔的單頁面設計
   - 文件上傳區域
   - 處理進度顯示區域
   - 狀態提示區域
   - 下載結果區域

## 技術棧

- 前端框架：Next.js
- UI設計：Tailwind CSS
- 音頻處理：
  - 人聲分離：Demucs/Spleeter
  - 說話者分離：pyannote-audio
  - 音頻降噪：noisereduce
- 文件存儲：本地文件系統
- 後端API：Next.js API Routes

## 安裝與運行

### 前提條件

- Node.js 18+
- Python 3.8+ (用於音頻處理)

### 安裝步驟

1. 克隆倉庫
```bash
git clone https://github.com/yourusername/audio-processor-app.git
cd audio-processor-app
```

2. 安裝依賴
```bash
npm install
```

3. 安裝Python依賴 (用於音頻處理)
```bash
pip install demucs pyannote.audio noisereduce librosa soundfile
```

4. 運行開發服務器
```bash
npm run dev
```

5. 訪問應用
打開瀏覽器，訪問 http://localhost:3000

### 生產環境部署

1. 構建應用
```bash
npm run build
```

2. 啟動生產服務器
```bash
npm start
```

## 部署到Vercel

本應用可以輕鬆部署到Vercel平台：

1. 將代碼推送到GitHub倉庫
2. 在Vercel中導入該倉庫
3. 保持默認配置設置
4. 點擊"Deploy"按鈕

注意：由於Vercel的無服務器環境對長時間運行的任務有限制，您可能需要將音頻處理功能部署在單獨的服務器上。

## 項目結構

```
audio-processor-app/
├── public/               # 靜態文件
│   └── uploads/          # 上傳文件存儲目錄
├── src/
│   ├── app/              # Next.js 頁面
│   │   ├── api/          # API路由
│   │   ├── process/      # 處理頁面
│   │   ├── result/       # 結果頁面
│   │   ├── upload/       # 上傳頁面
│   │   ├── globals.css   # 全局樣式
│   │   ├── layout.tsx    # 布局組件
│   │   └── page.tsx      # 首頁
│   ├── components/       # 可重用組件
│   │   └── audio/        # 音頻相關組件
│   ├── hooks/            # 自定義React hooks
│   └── lib/              # 工具函數和庫
│       └── audio/        # 音頻處理相關函數
├── next.config.ts        # Next.js配置
├── package.json          # 項目依賴
├── tailwind.config.ts    # Tailwind CSS配置
└── tsconfig.json         # TypeScript配置
```

## 貢獻指南

歡迎對本項目進行貢獻！請遵循以下步驟：

1. Fork本倉庫
2. 創建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟一個Pull Request

## 許可證

本項目採用MIT許可證 - 詳情請參見 [LICENSE](LICENSE) 文件。

## 聯繫方式

如有任何問題或建議，請開啟一個issue或通過以下方式聯繫我們：

- 項目主頁：[GitHub](https://github.com/yourusername/audio-processor-app)
