/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品详情页脚本，拉取商品详情并渲染卖家信息与操作入口
 */
(function () {
  const spWrap = document.getElementById('sp_detailWrap');
  const spGoodsId = Number(sp_getQuery('sp_id', 0));

  /**
   * 返回分类对应的缩略图配色序号（1-9）
   * @param {number} spCategoryId 分类主键
   * @returns {number} 配色序号
   */
  function sp_thumbIndex(spCategoryId) {
    const spId = Number(spCategoryId) || 0;
    return ((spId - 1) % 8 + 8) % 8 + 1;
  }

  /**
   * 渲染商品详情
   * @param {object} spGoods 商品详情数据
   */
  function sp_renderDetail(spGoods) {
    const spUser = sp_getUser();
    const spIsOwner = spUser && Number(spUser.sp_id) === Number(spGoods.sp_user_id);
    const spOldPrice = Number(spGoods.sp_original_price) > 0
      ? '<span class="sp_price_old">原价 ' + sp_formatPrice(spGoods.sp_original_price) + '</span>'
      : '';
    const spStatusTip = Number(spGoods.sp_status) === 1
      ? ''
      : '<span class="sp_badge">' + sp_statusText(spGoods.sp_status) + '</span>';
    const spOwnerAction = spIsOwner
      ? '<a class="sp_btn sp_btn_ghost" href="my_goods.html">管理我的商品</a>'
      : '';

    spWrap.innerHTML = [
      '<div class="sp_detail">',
      '  <div class="sp_detail_thumb sp_thumb_' + sp_thumbIndex(spGoods.sp_category_id) + '">',
      '    <span class="sp_thumb_cat">' + sp_escapeHtml(spGoods.sp_category_name) + '</span>',
      '    <span class="sp_thumb_cond">' + sp_escapeHtml(spGoods.sp_condition) + '</span>',
      '  </div>',
      '  <div>',
      '    <h1 class="sp_detail_title">' + sp_escapeHtml(spGoods.sp_title) + '</h1>',
      '    <div class="sp_detail_tags">',
      '      <span class="sp_badge">' + sp_escapeHtml(spGoods.sp_category_name) + '</span>',
      '      <span class="sp_badge">' + sp_escapeHtml(spGoods.sp_condition) + '</span>',
      spStatusTip,
      '    </div>',
      '    <div class="sp_detail_price">',
      '      <span class="sp_price_now">' + sp_formatPrice(spGoods.sp_price) + '</span>',
      spOldPrice,
      '    </div>',
      '    <div class="sp_detail_list">',
      '      <div class="sp_detail_item"><span>浏览次数</span><strong>' + spGoods.sp_view_count + '</strong></div>',
      '      <div class="sp_detail_item"><span>发布时间</span><strong>' + sp_formatDate(spGoods.sp_created_at) + '</strong></div>',
      '      <div class="sp_detail_item"><span>卖家</span><strong>' + sp_escapeHtml(spGoods.sp_seller) + '</strong></div>',
      '      <div class="sp_detail_item"><span>卖家校区</span><strong>' + sp_escapeHtml(spGoods.sp_seller_campus) + '</strong></div>',
      '    </div>',
      '    <h2 class="sp_desc_title">商品描述</h2>',
      '    <p class="sp_desc_text">' + sp_escapeHtml(spGoods.sp_desc || '卖家还没有填写描述') + '</p>',
      '    <div class="sp_seller">',
      '      <span class="sp_avatar">' + sp_escapeHtml(String(spGoods.sp_seller).slice(0, 1)) + '</span>',
      '      <div class="sp_seller_info">',
      '        <strong>' + sp_escapeHtml(spGoods.sp_seller) + '</strong>',
      '        <span>联系电话：' + sp_escapeHtml(spGoods.sp_seller_phone) + '</span>',
      '        <span>' + sp_escapeHtml(spGoods.sp_seller_campus) + ' · 建议当面验货交易</span>',
      '      </div>',
      '    </div>',
      '    <div class="sp_actions">',
      '      <a class="sp_btn sp_btn_primary" href="tel:' + sp_escapeHtml(spGoods.sp_seller_phone) + '">联系卖家</a>',
      spOwnerAction,
      '      <a class="sp_btn sp_btn_ghost" href="goods_list.html">继续逛逛</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
  }

  /**
   * 拉取商品详情
   */
  async function sp_loadDetail() {
    if (!spGoodsId) {
      spWrap.innerHTML = '<p class="sp_empty">商品参数不正确，请从商品列表进入</p>';
      return;
    }
    try {
      const spGoods = await sp_api('/api/goods/' + spGoodsId);
      document.title = spGoods.sp_title + ' | 校园二手集市';
      sp_renderDetail(spGoods);
    } catch (spErr) {
      spWrap.innerHTML = '<p class="sp_empty">' + sp_escapeHtml(spErr.message) + '</p>';
    }
  }

  /**
   * 页面初始化
   */
  function sp_initDetailPage() {
    sp_mountTopbar('goods_list.html');
    sp_loadDetail();
  }

  sp_initDetailPage();
})();
