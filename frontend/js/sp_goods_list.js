/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：商品列表页脚本，负责分类筛选、关键词搜索、商品卡片与分页渲染
 */
(function () {
  const spState = {
    spKeyword: sp_getQuery('sp_keyword', ''),
    spCategoryId: Number(sp_getQuery('sp_categoryId', 0)) || 0,
    spPage: 1,
    spPageSize: 8
  };

  const spGrid = document.getElementById('sp_goodsGrid');
  const spChips = document.getElementById('sp_chips');
  const spPagination = document.getElementById('sp_pagination');
  const spSummary = document.getElementById('sp_listSummary');
  const spKeywordInput = document.getElementById('sp_keyword');

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
   * 渲染商品卡片列表
   * @param {Array} spList 商品列表
   */
  function sp_renderGoods(spList) {
    if (!spList.length) {
      spGrid.innerHTML = '<p class="sp_empty">没有找到符合条件的商品，换个关键词试试</p>';
      return;
    }

    spGrid.innerHTML = spList.map(function (spGoods) {
      const spOldPrice = Number(spGoods.sp_original_price) > 0
        ? '<span class="sp_price_old">' + sp_formatPrice(spGoods.sp_original_price) + '</span>'
        : '';
      return [
        '<a class="sp_goods_card" href="goods_detail.html?sp_id=' + spGoods.sp_id + '">',
        '  <div class="sp_thumb sp_thumb_' + sp_thumbIndex(spGoods.sp_category_id) + '">',
        '    <span class="sp_thumb_cond">' + sp_escapeHtml(spGoods.sp_condition) + '</span>',
        '    <span class="sp_thumb_cat">' + sp_escapeHtml(spGoods.sp_category_name) + '</span>',
        '  </div>',
        '  <div class="sp_goods_body">',
        '    <h3 class="sp_goods_title">' + sp_escapeHtml(spGoods.sp_title) + '</h3>',
        '    <div class="sp_price"><span class="sp_price_now">' + sp_formatPrice(spGoods.sp_price) + '</span>' + spOldPrice + '</div>',
        '    <div class="sp_goods_meta"><span>' + sp_escapeHtml(spGoods.sp_seller) + '</span><span>' + sp_formatDate(spGoods.sp_created_at) + '</span></div>',
        '  </div>',
        '</a>'
      ].join('');
    }).join('');
  }

  /**
   * 渲染分页按钮
   * @param {number} spTotal 商品总数
   */
  function sp_renderPagination(spTotal) {
    const spTotalPage = Math.max(1, Math.ceil(spTotal / spState.spPageSize));
    const spButtons = [];
    spButtons.push('<button class="sp_page_btn" type="button" data-sp-page="' + (spState.spPage - 1) + '"' +
      (spState.spPage <= 1 ? ' disabled' : '') + '>上一页</button>');

    const spStart = Math.max(1, spState.spPage - 2);
    const spEnd = Math.min(spTotalPage, spStart + 4);
    for (let spI = spStart; spI <= spEnd; spI += 1) {
      spButtons.push('<button class="sp_page_btn' + (spI === spState.spPage ? ' sp_active' : '') +
        '" type="button" data-sp-page="' + spI + '">' + spI + '</button>');
    }

    spButtons.push('<button class="sp_page_btn" type="button" data-sp-page="' + (spState.spPage + 1) + '"' +
      (spState.spPage >= spTotalPage ? ' disabled' : '') + '>下一页</button>');
    spPagination.innerHTML = spButtons.join('');
  }

  /**
   * 拉取并渲染商品列表
   */
  async function sp_loadGoods() {
    spGrid.innerHTML = '<p class="sp_empty">正在加载商品…</p>';
    const spParams = new URLSearchParams({
      sp_page: spState.spPage,
      sp_pageSize: spState.spPageSize
    });
    if (spState.spKeyword) spParams.set('sp_keyword', spState.spKeyword);
    if (spState.spCategoryId) spParams.set('sp_categoryId', spState.spCategoryId);

    try {
      const spData = await sp_api('/api/goods?' + spParams.toString());
      sp_renderGoods(spData.sp_list);
      sp_renderPagination(spData.sp_total);
      spSummary.textContent = '共 ' + spData.sp_total + ' 件在售商品' +
        (spState.spKeyword ? '，关键词「' + spState.spKeyword + '」' : '');
    } catch (spErr) {
      spGrid.innerHTML = '<p class="sp_empty">商品加载失败：' + sp_escapeHtml(spErr.message) + '</p>';
      spSummary.textContent = '加载失败';
      spPagination.innerHTML = '';
    }
  }

  /**
   * 渲染分类筛选按钮
   * @param {Array} spCategories 分类列表
   */
  function sp_renderCategories(spCategories) {
    const spItems = [{ sp_id: 0, sp_name: '全部' }].concat(spCategories);
    spChips.innerHTML = spItems.map(function (spCategory) {
      const spActive = Number(spCategory.sp_id) === spState.spCategoryId ? ' sp_active' : '';
      return '<button class="sp_chip' + spActive + '" type="button" data-sp-category="' +
        spCategory.sp_id + '">' + sp_escapeHtml(spCategory.sp_name) + '</button>';
    }).join('');
  }

  /**
   * 加载分类数据
   */
  async function sp_loadCategories() {
    try {
      const spCategories = await sp_api('/api/categories');
      sp_renderCategories(spCategories);
    } catch (spErr) {
      spChips.innerHTML = '';
    }
  }

  /**
   * 绑定页面交互事件
   */
  function sp_bindEvents() {
    document.getElementById('sp_searchBtn').addEventListener('click', function () {
      spState.spKeyword = spKeywordInput.value.trim();
      spState.spPage = 1;
      sp_loadGoods();
    });

    spKeywordInput.addEventListener('keydown', function (spEvent) {
      if (spEvent.key === 'Enter') {
        spState.spKeyword = spKeywordInput.value.trim();
        spState.spPage = 1;
        sp_loadGoods();
      }
    });

    document.getElementById('sp_resetBtn').addEventListener('click', function () {
      spState.spKeyword = '';
      spState.spCategoryId = 0;
      spState.spPage = 1;
      spKeywordInput.value = '';
      sp_loadCategories();
      sp_loadGoods();
    });

    spChips.addEventListener('click', function (spEvent) {
      const spTarget = spEvent.target.closest('[data-sp-category]');
      if (!spTarget) return;
      spState.spCategoryId = Number(spTarget.dataset.spCategory);
      spState.spPage = 1;
      Array.prototype.forEach.call(spChips.children, function (spChip) {
        spChip.classList.toggle('sp_active', spChip === spTarget);
      });
      sp_loadGoods();
    });

    spPagination.addEventListener('click', function (spEvent) {
      const spTarget = spEvent.target.closest('[data-sp-page]');
      if (!spTarget || spTarget.disabled) return;
      const spPage = Number(spTarget.dataset.spPage);
      if (spPage < 1 || spPage === spState.spPage) return;
      spState.spPage = spPage;
      sp_loadGoods();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * 页面初始化
   */
  function sp_initGoodsList() {
    sp_mountTopbar('goods_list.html');
    spKeywordInput.value = spState.spKeyword;
    sp_bindEvents();
    sp_loadCategories();
    sp_loadGoods();
  }

  sp_initGoodsList();
})();
