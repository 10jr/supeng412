/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 功能：AI 接口路由，提供对话与配置查询
 */
const express = require('express');
const spAiController = require('../controllers/sp_aiController');

const spRouter = express.Router();

// 当前 AI 配置（不含密钥）
spRouter.get('/info', spAiController.sp_getAiInfo);

// AI 对话
spRouter.post('/chat', spAiController.sp_chat);

module.exports = spRouter;
