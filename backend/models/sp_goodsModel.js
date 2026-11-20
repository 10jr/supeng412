/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品数据模型，负责商品的分页查询、详情、发布与状态维护
 */
const spPool = require('../config/sp_db');

// 商品列表/详情统一使用的字段（含分类名与卖家昵称）
const spBaseSql = `
  SELECT g.sp_id, g.sp_title, g.sp_desc, g.sp_price, g.sp_original_price, g.sp_condition,
         g.sp_category_id, g.sp_user_id, g.sp_status, g.sp_view_count, g.sp_created_at,
         c.sp_name AS sp_category_name, u.sp_nickname AS sp_seller
  FROM sp_goods g
  INNER JOIN sp_category c ON c.sp_id = g.sp_category_id
  INNER JOIN sp_user u ON u.sp_id = g.sp_user_id
`;

/**
 * 按条件分页查询在售商品
 * @param {object} spQuery 查询条件（关键词、分类、页码、每页条数）
 * @returns {Promise<object>} 商品列表与总数
 */
async function sp_findList(spQuery) {
  const spWhere = ['g.sp_status = 1'];
  const spParams = [];

  if (spQuery.spKeyword) {
    spWhere.push('(g.sp_title LIKE ? OR g.sp_desc LIKE ?)');
    spParams.push('%' + spQuery.spKeyword + '%', '%' + spQuery.spKeyword + '%');
  }
  if (spQuery.spCategoryId) {
    spWhere.push('g.sp_category_id = ?');
    spParams.push(spQuery.spCategoryId);
  }

  const spWhereSql = ' WHERE ' + spWhere.join(' AND ');
  const [spCountRows] = await spPool.query(
    'SELECT COUNT(*) AS sp_total FROM sp_goods g' + spWhereSql,
    spParams
  );

  const spOffset = (spQuery.spPage - 1) * spQuery.spPageSize;
  const [spRows] = await spPool.query(
    spBaseSql + spWhereSql + ' ORDER BY g.sp_created_at DESC, g.sp_id DESC LIMIT ? OFFSET ?',
    spParams.concat([spQuery.spPageSize, spOffset])
  );

  return { sp_list: spRows, sp_total: spCountRows[0].sp_total };
}

/**
 * 按主键查询商品详情（含卖家联系方式）
 * @param {number} spId 商品主键
 * @returns {Promise<object|null>} 商品详情
 */
async function sp_findById(spId) {
  const [spRows] = await spPool.query(
    spBaseSql.replace('u.sp_nickname AS sp_seller', 'u.sp_nickname AS sp_seller, u.sp_phone AS sp_seller_phone, u.sp_campus AS sp_seller_campus') +
      ' WHERE g.sp_id = ? LIMIT 1',
    [spId]
  );
  return spRows[0] || null;
}

/**
 * 商品浏览次数加一
 * @param {number} spId 商品主键
 */
async function sp_increaseView(spId) {
  await spPool.query('UPDATE sp_goods SET sp_view_count = sp_view_count + 1 WHERE sp_id = ?', [spId]);
}

/**
 * 查询某个用户发布的全部商品（含已下架与已售出）
 * @param {number} spUserId 用户主键
 * @returns {Promise<Array>} 商品列表
 */
async function sp_findByUser(spUserId) {
  const [spRows] = await spPool.query(
    spBaseSql + ' WHERE g.sp_user_id = ? ORDER BY g.sp_created_at DESC, g.sp_id DESC',
    [spUserId]
  );
  return spRows;
}

/**
 * 发布商品
 * @param {object} spData 商品信息
 * @returns {Promise<number>} 新增商品主键
 */
async function sp_createGoods(spData) {
  const [spResult] = await spPool.query(
    `INSERT INTO sp_goods
      (sp_title, sp_desc, sp_price, sp_original_price, sp_condition, sp_category_id, sp_user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      spData.spTitle,
      spData.spDesc,
      spData.spPrice,
      spData.spOriginalPrice,
      spData.spCondition,
      spData.spCategoryId,
      spData.spUserId
    ]
  );
  return spResult.insertId;
}

/**
 * 修改商品状态（仅限发布者本人操作）
 * @param {number} spId 商品主键
 * @param {number} spUserId 用户主键
 * @param {number} spStatus 目标状态
 * @returns {Promise<number>} 受影响行数
 */
async function sp_updateStatus(spId, spUserId, spStatus) {
  const [spResult] = await spPool.query(
    'UPDATE sp_goods SET sp_status = ? WHERE sp_id = ? AND sp_user_id = ?',
    [spStatus, spId, spUserId]
  );
  return spResult.affectedRows;
}

/**
 * 删除商品（仅限发布者本人操作）
 * @param {number} spId 商品主键
 * @param {number} spUserId 用户主键
 * @returns {Promise<number>} 受影响行数
 */
async function sp_remove(spId, spUserId) {
  const [spResult] = await spPool.query(
    'DELETE FROM sp_goods WHERE sp_id = ? AND sp_user_id = ?',
    [spId, spUserId]
  );
  return spResult.affectedRows;
}

module.exports = {
  sp_findList,
  sp_findById,
  sp_increaseView,
  sp_findByUser,
  sp_createGoods,
  sp_updateStatus,
  sp_remove
};
