/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：页面导航路由，提供 /api/pages 接口
 */
const express = require('express');
const spNavController = require('../controllers/sp_navController');

const spRouter = express.Router();

// 获取项目内已完成的页面列表
spRouter.get('/pages', spNavController.sp_getPages);

module.exports = spRouter;
