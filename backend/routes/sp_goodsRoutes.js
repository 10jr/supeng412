/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品路由，提供列表、详情、发布、我的商品与状态维护接口
 */
const express = require('express');
const spGoodsController = require('../controllers/sp_goodsController');

const spRouter = express.Router();

// 商品列表（支持关键词、分类、分页）
spRouter.get('/', spGoodsController.sp_getGoodsList);

// 我的商品（需放在 /:sp_id 之前，避免路由冲突）
spRouter.get('/mine', spGoodsController.sp_getMyGoods);

// 商品详情
spRouter.get('/:sp_id', spGoodsController.sp_getGoodsDetail);

// 发布商品
spRouter.post('/', spGoodsController.sp_createGoods);

// 修改商品状态
spRouter.put('/:sp_id/status', spGoodsController.sp_updateGoodsStatus);

// 删除商品
spRouter.delete('/:sp_id', spGoodsController.sp_deleteGoods);

module.exports = spRouter;
