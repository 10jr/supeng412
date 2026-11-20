/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：后端服务入口，挂载静态资源、跨域、JSON 解析与 /api 路由
 */
const path = require('path');
const express = require('express');
const cors = require('cors');
const spNavRoutes = require('./routes/sp_navRoutes');
const spAuthRoutes = require('./routes/sp_authRoutes');
const spCategoryRoutes = require('./routes/sp_categoryRoutes');
const spGoodsRoutes = require('./routes/sp_goodsRoutes');
const spDatabaseRoutes = require('./routes/sp_databaseRoutes');

const spApp = express();
const spPort = 8412;

// 开放全部跨域访问（仅用于课程作业）
spApp.use(cors());
// 解析 JSON 请求体
spApp.use(express.json());

// 托管 frontend 静态资源目录
spApp.use(express.static(path.join(__dirname, '..', 'frontend')));

/**
 * 健康检查接口：用于确认后端服务是否正常启动
 */
spApp.get('/api/health', (spReq, spRes) => {
  spRes.json({
    code: 0,
    msg: '服务运行正常',
    data: { spPort: spPort, spTime: new Date().toISOString() }
  });
});

// 业务路由统一挂载在 /api 前缀下
spApp.use('/api', spNavRoutes);
spApp.use('/api/auth', spAuthRoutes);
spApp.use('/api/categories', spCategoryRoutes);
spApp.use('/api/goods', spGoodsRoutes);
spApp.use('/api/database', spDatabaseRoutes);

/**
 * 未匹配到的 /api 接口统一返回 404 JSON，避免返回 HTML
 */
spApp.use('/api', (spReq, spRes) => {
  spRes.status(404).json({ code: 404, msg: '接口不存在', data: null });
});

/**
 * 全局错误处理，保证始终返回统一 JSON 结构
 */
spApp.use((spErr, spReq, spRes, spNext) => {
  console.error('服务器异常：', spErr);
  spRes.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
});

spApp.listen(spPort, () => {
  console.log(`服务已启动：http://localhost:${spPort}`);
});

module.exports = spApp;
