/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：页面导航控制器，返回统一 JSON 结构的页面列表
 */
const spNavModel = require('../models/sp_navModel');

/**
 * 获取页面导航列表
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_getPages(spReq, spRes) {
  try {
    const spPages = await spNavModel.sp_findAllPages();
    spRes.json({ code: 0, msg: '获取页面列表成功', data: spPages });
  } catch (spErr) {
    console.error('获取页面列表失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '获取页面列表失败', data: null });
  }
}

module.exports = { sp_getPages };
