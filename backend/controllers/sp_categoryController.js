/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品分类控制器，返回分类列表
 */
const spCategoryModel = require('../models/sp_categoryModel');

/**
 * 获取全部商品分类
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_getCategories(spReq, spRes) {
  try {
    const spCategories = await spCategoryModel.sp_findAllCategories();
    spRes.json({ code: 0, msg: '获取分类成功', data: spCategories });
  } catch (spErr) {
    console.error('获取分类失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '获取分类失败', data: null });
  }
}

module.exports = { sp_getCategories };
