/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：图文列表路由，提供图文数据接口
 */
const express = require('express');
const spGalleryController = require('../controllers/sp_galleryController');

const spRouter = express.Router();

// 图文列表（可选 sp_tag 过滤）
spRouter.get('/', spGalleryController.sp_getGalleryList);

module.exports = spRouter;
