/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：用户认证路由，提供注册与登录接口
 */
const express = require('express');
const spAuthController = require('../controllers/sp_authController');

const spRouter = express.Router();

// 用户注册
spRouter.post('/register', spAuthController.sp_register);

// 用户登录
spRouter.post('/login', spAuthController.sp_login);

module.exports = spRouter;
