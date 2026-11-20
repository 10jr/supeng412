/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：科技新闻路由，提供新闻列表接口
 */
const express = require('express');
const spNewsController = require('../controllers/sp_newsController');

const spRouter = express.Router();

// 科技新闻列表（可选 sp_tag 过滤）
spRouter.get('/', spNewsController.sp_getNewsList);

module.exports = spRouter;
