/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：科技新闻控制器，返回新闻列表与总数
 */
const spNewsModel = require('../models/sp_newsModel');

/**
 * 获取科技新闻列表
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_getNewsList(spReq, spRes) {
  const spTag = String(spReq.query.sp_tag || '').trim();

  try {
    const spNews = await spNewsModel.sp_findAllNews(spTag);
    spRes.json({
      code: 0,
      msg: '获取科技新闻成功',
      data: { sp_total: spNews.length, sp_list: spNews }
    });
  } catch (spErr) {
    console.error('获取科技新闻失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '获取科技新闻失败', data: null });
  }
}

module.exports = { sp_getNewsList };
