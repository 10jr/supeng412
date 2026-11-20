/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品分类路由，提供分类列表接口
 */
const express = require('express');
const spCategoryController = require('../controllers/sp_categoryController');

const spRouter = express.Router();

// 获取分类列表
spRouter.get('/', spCategoryController.sp_getCategories);

module.exports = spRouter;
