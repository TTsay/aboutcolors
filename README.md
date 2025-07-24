# 顏色辨認遊戲

一個使用PostgreSQL記錄訪客人次的顏色辨認遊戲。

## 設置說明

### 1. 安裝相依套件
```bash
npm install
```

### 2. 設置PostgreSQL資料庫

#### 本地開發環境：
1. 安裝PostgreSQL
2. 創建資料庫：
```sql
CREATE DATABASE color_game;
```

3. 設置環境變數（可選，使用預設連接）：
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/color_game"
```

#### 生產環境（Zeabur部署）：
1. 在Zeabur添加PostgreSQL服務
2. 設置環境變數 `DATABASE_URL` 為你的PostgreSQL連接字串

### 3. 啟動應用
```bash
npm start
```

應用會自動：
- 創建所需的資料表
- 初始化訪客計數為0
- 在 http://localhost:3000 提供服務

## API端點

- `POST /api/visitor-count` - 增加並返回訪客計數
- `GET /api/visitor-count` - 只返回當前訪客計數（不增加）

## 部署到Zeabur

1. 推送代碼到GitHub
2. 在Zeabur創建新服務
3. 連接你的GitHub repository
4. 添加PostgreSQL服務
5. 設置環境變數 `DATABASE_URL`
6. 部署完成

## 功能特色

- ✅ PostgreSQL持久化存儲
- ✅ 原子性計數更新
- ✅ 備用localStorage方案
- ✅ CORS支持
- ✅ 自動資料庫初始化
- ✅ 生產環境SSL支持