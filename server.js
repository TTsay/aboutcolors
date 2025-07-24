const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// PostgreSQL 連接配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/color_game',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 初始化資料庫表格
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitor_count (
        id INTEGER PRIMARY KEY DEFAULT 1,
        count INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // 插入初始記錄（如果不存在）
    await pool.query(`
      INSERT INTO visitor_count (id, count) 
      VALUES (1, 0) 
      ON CONFLICT (id) DO NOTHING
    `);
    
    console.log('資料庫初始化完成');
  } catch (err) {
    console.error('資料庫初始化錯誤:', err);
  }
}

// API路由：獲取並增加訪客計數
app.post('/api/visitor-count', async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE visitor_count 
      SET count = count + 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1 
      RETURNING count
    `);
    
    const count = result.rows[0].count;
    res.json({ count });
  } catch (err) {
    console.error('更新訪客計數錯誤:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// API路由：只獲取訪客計數（不增加）
app.get('/api/visitor-count', async (req, res) => {
  try {
    const result = await pool.query('SELECT count FROM visitor_count WHERE id = 1');
    const count = result.rows[0]?.count || 0;
    res.json({ count });
  } catch (err) {
    console.error('獲取訪客計數錯誤:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 提供靜態檔案
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 啟動伺服器
app.listen(port, async () => {
  console.log(`伺服器運行在 http://localhost:${port}`);
  await initDatabase();
});

// 優雅關閉
process.on('SIGINT', async () => {
  console.log('正在關閉伺服器...');
  await pool.end();
  process.exit(0);
});