/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品控制器，处理商品查询、详情、发布、下架与删除
 */
const spGoodsModel = require('../models/sp_goodsModel');

/**
 * 将任意输入转为正整数，非法时返回默认值
 * @param {any} spValue 原始值
 * @param {number} spDefault 默认值
 * @returns {number} 正整数
 */
function sp_toPositiveInt(spValue, spDefault) {
  const spNum = parseInt(spValue, 10);
  return Number.isFinite(spNum) && spNum > 0 ? spNum : spDefault;
}

/**
 * 分页查询在售商品
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_getGoodsList(spReq, spRes) {
  const spPage = sp_toPositiveInt(spReq.query.sp_page, 1);
  const spPageSize = Math.min(sp_toPositiveInt(spReq.query.sp_pageSize, 8), 50);
  const spKeyword = String(spReq.query.sp_keyword || '').trim();
  const spCategoryId = sp_toPositiveInt(spReq.query.sp_categoryId, 0);

  try {
    const spResult = await spGoodsModel.sp_findList({
      spKeyword: spKeyword,
      spCategoryId: spCategoryId,
      spPage: spPage,
      spPageSize: spPageSize
    });
    spRes.json({
      code: 0,
      msg: '获取商品列表成功',
      data: {
        sp_list: spResult.sp_list,
        sp_total: spResult.sp_total,
        sp_page: spPage,
        sp_pageSize: spPageSize
      }
    });
  } catch (spErr) {
    console.error('获取商品列表失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '获取商品列表失败', data: null });
  }
}

/**
 * 查询商品详情并累加浏览次数
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_getGoodsDetail(spReq, spRes) {
  const spId = sp_toPositiveInt(spReq.params.sp_id, 0);
  if (!spId) {
    return spRes.json({ code: 1, msg: '商品编号不合法', data: null });
  }

  try {
    const spGoods = await spGoodsModel.sp_findById(spId);
    if (!spGoods) {
      return spRes.status(404).json({ code: 1, msg: '商品不存在或已删除', data: null });
    }
    await spGoodsModel.sp_increaseView(spId);
    spGoods.sp_view_count += 1;
    spRes.json({ code: 0, msg: '获取商品详情成功', data: spGoods });
  } catch (spErr) {
    console.error('获取商品详情失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '获取商品详情失败', data: null });
  }
}

/**
 * 发布商品
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_createGoods(spReq, spRes) {
  const spBody = spReq.body || {};
  const spUserId = sp_toPositiveInt(spBody.sp_userId, 0);
  const spTitle = String(spBody.sp_title || '').trim();
  const spDesc = String(spBody.sp_desc || '').trim();
  const spCondition = String(spBody.sp_condition || '').trim();
  const spPrice = Number(spBody.sp_price);
  const spOriginalPrice = spBody.sp_original_price === undefined || spBody.sp_original_price === ''
    ? 0
    : Number(spBody.sp_original_price);
  const spCategoryId = sp_toPositiveInt(spBody.sp_category_id, 0);

  if (!spUserId) {
    return spRes.json({ code: 1, msg: '请先登录后再发布', data: null });
  }
  if (spTitle.length < 2 || spTitle.length > 80) {
    return spRes.json({ code: 1, msg: '标题长度需为 2-80 个字符', data: null });
  }
  if (!spCategoryId) {
    return spRes.json({ code: 1, msg: '请选择商品分类', data: null });
  }
  if (!spCondition) {
    return spRes.json({ code: 1, msg: '请选择商品成色', data: null });
  }
  if (!Number.isFinite(spPrice) || spPrice <= 0) {
    return spRes.json({ code: 1, msg: '请输入正确的出售价格', data: null });
  }
  if (!Number.isFinite(spOriginalPrice) || spOriginalPrice < 0) {
    return spRes.json({ code: 1, msg: '请输入正确的原价', data: null });
  }
  if (spDesc.length > 500) {
    return spRes.json({ code: 1, msg: '商品描述不能超过 500 个字符', data: null });
  }

  try {
    const spGoodsId = await spGoodsModel.sp_createGoods({
      spTitle: spTitle,
      spDesc: spDesc,
      spPrice: spPrice,
      spOriginalPrice: spOriginalPrice,
      spCondition: spCondition,
      spCategoryId: spCategoryId,
      spUserId: spUserId
    });
    spRes.json({ code: 0, msg: '发布成功', data: { sp_id: spGoodsId } });
  } catch (spErr) {
    console.error('发布商品失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '发布失败，请稍后重试', data: null });
  }
}

/**
 * 查询当前用户发布的商品
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_getMyGoods(spReq, spRes) {
  const spUserId = sp_toPositiveInt(spReq.query.sp_userId, 0);
  if (!spUserId) {
    return spRes.json({ code: 1, msg: '请先登录', data: null });
  }

  try {
    const spGoods = await spGoodsModel.sp_findByUser(spUserId);
    spRes.json({ code: 0, msg: '获取我的商品成功', data: spGoods });
  } catch (spErr) {
    console.error('获取我的商品失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '获取我的商品失败', data: null });
  }
}

/**
 * 修改商品状态（下架 / 重新上架 / 标记已售出）
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_updateGoodsStatus(spReq, spRes) {
  const spId = sp_toPositiveInt(spReq.params.sp_id, 0);
  const spBody = spReq.body || {};
  const spUserId = sp_toPositiveInt(spBody.sp_userId, 0);
  const spStatus = Number(spBody.sp_status);

  if (!spId || !spUserId) {
    return spRes.json({ code: 1, msg: '参数不合法', data: null });
  }
  if (![0, 1, 2].includes(spStatus)) {
    return spRes.json({ code: 1, msg: '商品状态不合法', data: null });
  }

  try {
    const spAffected = await spGoodsModel.sp_updateStatus(spId, spUserId, spStatus);
    if (!spAffected) {
      return spRes.json({ code: 1, msg: '商品不存在或无权操作', data: null });
    }
    spRes.json({ code: 0, msg: '状态修改成功', data: { sp_id: spId, sp_status: spStatus } });
  } catch (spErr) {
    console.error('修改商品状态失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '修改失败，请稍后重试', data: null });
  }
}

/**
 * 删除商品
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_deleteGoods(spReq, spRes) {
  const spId = sp_toPositiveInt(spReq.params.sp_id, 0);
  const spUserId = sp_toPositiveInt(spReq.query.sp_userId, 0);

  if (!spId || !spUserId) {
    return spRes.json({ code: 1, msg: '参数不合法', data: null });
  }

  try {
    const spAffected = await spGoodsModel.sp_remove(spId, spUserId);
    if (!spAffected) {
      return spRes.json({ code: 1, msg: '商品不存在或无权操作', data: null });
    }
    spRes.json({ code: 0, msg: '删除成功', data: { sp_id: spId } });
  } catch (spErr) {
    console.error('删除商品失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '删除失败，请稍后重试', data: null });
  }
}

module.exports = {
  sp_getGoodsList,
  sp_getGoodsDetail,
  sp_createGoods,
  sp_getMyGoods,
  sp_updateGoodsStatus,
  sp_deleteGoods
};
