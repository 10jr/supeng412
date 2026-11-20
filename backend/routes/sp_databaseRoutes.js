/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：数据库路由，提供 MySQL 连接测试接口
 */
const express = require('express');
const spDatabaseController = require('../controllers/sp_databaseController');

const spRouter = express.Router();

// 测试数据库连接
spRouter.post('/test', spDatabaseController.sp_testConnection);

module.exports = spRouter;
