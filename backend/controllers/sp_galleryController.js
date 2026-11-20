/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：图文列表控制器，返回图文数据与总数
 */
const spGalleryModel = require('../models/sp_galleryModel');

/**
 * 获取图文列表
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_getGalleryList(spReq, spRes) {
  const spTag = String(spReq.query.sp_tag || '').trim();

  try {
    const spGallery = await spGalleryModel.sp_findAllGallery(spTag);
    spRes.json({
      code: 0,
      msg: '获取图文列表成功',
      data: { sp_total: spGallery.length, sp_list: spGallery }
    });
  } catch (spErr) {
    console.error('获取图文列表失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '获取图文列表失败', data: null });
  }
}

module.exports = { sp_getGalleryList };
