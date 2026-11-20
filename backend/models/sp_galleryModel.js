/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：图文列表数据模型，查询 sp_gallery 表数据
 */
const spPool = require('../config/sp_db');

/**
 * 查询图文列表，按发布时间倒序
 * @param {string} spTag 标签（可为空）
 * @returns {Promise<Array>} 图文列表
 */
async function sp_findAllGallery(spTag) {
  const spParams = [];
  let spSql = `SELECT sp_id, sp_title, sp_desc, sp_image_url, sp_tag, sp_publish_time, sp_view_count
               FROM sp_gallery`;
  if (spTag) {
    spSql += ' WHERE sp_tag = ?';
    spParams.push(spTag);
  }
  spSql += ' ORDER BY sp_publish_time DESC, sp_id DESC';

  const [spRows] = await spPool.query(spSql, spParams);
  return spRows;
}

module.exports = { sp_findAllGallery };
