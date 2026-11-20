/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：我的商品页脚本，渲染个人商品并支持上架、下架、标记售出与删除
 */
(function () {
  const spUser = sp_getUser();
  const spList = document.getElementById('sp_myList');
  const spSummary = document.getElementById('sp_mySummary');

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
   * 根据商品状态生成可用操作按钮
   * @param {object} spGoods 商品数据
   * @returns {string} 按钮 HTML
   */
  function sp_actionButtons(spGoods) {
    const spId = spGoods.sp_id;
    const spStatus = Number(spGoods.sp_status);
    const spButtons = [];

    if (spStatus === 1) {
      spButtons.push('<button class="sp_btn sp_btn_ghost sp_btn_sm" type="button" data-sp-action="status" data-sp-id="' + spId + '" data-sp-status="0">下架</button>');
      spButtons.push('<button class="sp_btn sp_btn_ghost sp_btn_sm" type="button" data-sp-action="status" data-sp-id="' + spId + '" data-sp-status="2">标记已售出</button>');
    } else {
      spButtons.push('<button class="sp_btn sp_btn_ghost sp_btn_sm" type="button" data-sp-action="status" data-sp-id="' + spId + '" data-sp-status="1">重新上架</button>');
    }
    spButtons.push('<button class="sp_btn sp_btn_danger sp_btn_sm" type="button" data-sp-action="delete" data-sp-id="' + spId + '">删除</button>');

    return spButtons.join('');
  }

  /**
   * 渲染我的商品列表
   * @param {Array} spGoodsList 商品列表
   */
  function sp_renderMyGoods(spGoodsList) {
    if (!spGoodsList.length) {
      spList.innerHTML = '<p class="sp_empty">你还没有发布商品，<a href="publish.html">去发布一件</a></p>';
      spSummary.textContent = '共 0 件商品';
      return;
    }

    spList.innerHTML = spGoodsList.map(function (spGoods) {
      return [
        '<div class="sp_my_item">',
        '  <div class="sp_my_thumb sp_thumb_' + sp_thumbIndex(spGoods.sp_category_id) + '">' + sp_escapeHtml(spGoods.sp_category_name) + '</div>',
        '  <div class="sp_my_info">',
        '    <h3 class="sp_my_title"><a href="goods_detail.html?sp_id=' + spGoods.sp_id + '">' + sp_escapeHtml(spGoods.sp_title) + '</a></h3>',
        '    <div class="sp_my_meta">',
        '      <span class="sp_status sp_status_' + Number(spGoods.sp_status) + '">' + sp_statusText(spGoods.sp_status) + '</span>',
        '      <span>' + sp_formatPrice(spGoods.sp_price) + '</span>',
        '      <span>' + sp_escapeHtml(spGoods.sp_condition) + '</span>',
        '      <span>浏览 ' + spGoods.sp_view_count + '</span>',
        '      <span>' + sp_formatDate(spGoods.sp_created_at) + '</span>',
        '    </div>',
        '  </div>',
        '  <div class="sp_my_actions">' + sp_actionButtons(spGoods) + '</div>',
        '</div>'
      ].join('');
    }).join('');

    const spOnSale = spGoodsList.filter(function (spGoods) {
      return Number(spGoods.sp_status) === 1;
    }).length;
    spSummary.textContent = '共 ' + spGoodsList.length + ' 件商品，其中 ' + spOnSale + ' 件在售';
  }

  /**
   * 拉取我的商品列表
   */
  async function sp_loadMyGoods() {
    spList.innerHTML = '<p class="sp_empty">正在加载我的商品…</p>';
    try {
      const spGoodsList = await sp_api('/api/goods/mine?sp_userId=' + spUser.sp_id);
      sp_renderMyGoods(spGoodsList);
    } catch (spErr) {
      spList.innerHTML = '<p class="sp_empty">加载失败：' + sp_escapeHtml(spErr.message) + '</p>';
      spSummary.textContent = '加载失败';
    }
  }

  /**
   * 修改商品状态
   * @param {number} spId 商品主键
   * @param {number} spStatus 目标状态
   */
  async function sp_changeStatus(spId, spStatus) {
    try {
      await sp_sendJson('/api/goods/' + spId + '/status', {
        sp_userId: spUser.sp_id,
        sp_status: spStatus
      }, 'PUT');
      sp_showToast('状态已更新为「' + sp_statusText(spStatus) + '」', 'success');
      sp_loadMyGoods();
    } catch (spErr) {
      sp_showToast(spErr.message, 'error');
    }
  }

  /**
   * 删除商品
   * @param {number} spId 商品主键
   */
  async function sp_deleteGoods(spId) {
    if (!window.confirm('确定删除该商品吗？删除后无法恢复。')) return;
    try {
      await sp_api('/api/goods/' + spId + '?sp_userId=' + spUser.sp_id, { method: 'DELETE' });
      sp_showToast('删除成功', 'success');
      sp_loadMyGoods();
    } catch (spErr) {
      sp_showToast(spErr.message, 'error');
    }
  }

  /**
   * 绑定列表操作事件（事件委托）
   */
  function sp_bindEvents() {
    spList.addEventListener('click', function (spEvent) {
      const spTarget = spEvent.target.closest('[data-sp-action]');
      if (!spTarget) return;
      const spId = Number(spTarget.dataset.spId);
      if (spTarget.dataset.spAction === 'status') {
        sp_changeStatus(spId, Number(spTarget.dataset.spStatus));
      } else if (spTarget.dataset.spAction === 'delete') {
        sp_deleteGoods(spId);
      }
    });
  }

  /**
   * 页面初始化
   */
  function sp_initMyGoodsPage() {
    sp_mountTopbar('my_goods.html');
    if (!sp_requireLogin('my_goods.html')) return;
    sp_bindEvents();
    sp_loadMyGoods();
  }

  sp_initMyGoodsPage();
})();
