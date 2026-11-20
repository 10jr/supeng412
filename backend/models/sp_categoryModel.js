/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品分类数据模型，提供分类列表查询
 */
const spPool = require('../config/sp_db');

/**
 * 查询全部商品分类，按排序值升序
 * @returns {Promise<Array>} 分类列表
 */
async function sp_findAllCategories() {
  const [spRows] = await spPool.query(
    'SELECT sp_id, sp_name, sp_sort FROM sp_category ORDER BY sp_sort ASC, sp_id ASC'
  );
  return spRows;
}

module.exports = { sp_findAllCategories };
