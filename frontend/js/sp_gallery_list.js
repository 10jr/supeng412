/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：图文列表页脚本，调用 /api/gallery 渲染图文卡片并展示接口链接
 */
(function () {
  const spGrid = document.getElementById('sp_galleryGrid');
  const spSummary = document.getElementById('sp_gallerySummary');
  const spApiLink = document.getElementById('sp_apiLink');

  /**
   * 日期格式化
   * @param {string} spValue 时间字符串
   * @returns {string} 形如 2026-11-19
   */
  function sp_formatDateText(spValue) {
    const spDate = new Date(spValue);
    if (Number.isNaN(spDate.getTime())) return '';
    const spPad = function (spNum) {
      return String(spNum).padStart(2, '0');
    };
    return spDate.getFullYear() + '-' + spPad(spDate.getMonth() + 1) + '-' + spPad(spDate.getDate());
  }

  /**
   * 渲染图文卡片
   * @param {Array} spGalleryList 图文数据
   */
  function sp_renderGallery(spGalleryList) {
    if (!spGalleryList.length) {
      spGrid.innerHTML = '<p class="sp_empty">暂无图文数据</p>';
      return;
    }

    spGrid.innerHTML = spGalleryList.map(function (spItem) {
      return [
        '<article class="sp_gallery_card">',
        '  <img class="sp_gallery_img" src="' + sp_escapeHtml(spItem.sp_image_url) + '" alt="' + sp_escapeHtml(spItem.sp_title) + '" loading="lazy">',
        '  <div class="sp_gallery_body">',
        '    <div class="sp_gallery_top">',
        '      <span class="sp_gallery_tag">' + sp_escapeHtml(spItem.sp_tag) + '</span>',
        '      <span class="sp_gallery_time">' + sp_formatDateText(spItem.sp_publish_time) + '</span>',
        '    </div>',
        '    <h2 class="sp_gallery_title">' + sp_escapeHtml(spItem.sp_title) + '</h2>',
        '    <p class="sp_gallery_desc">' + sp_escapeHtml(spItem.sp_desc) + '</p>',
        '    <div class="sp_gallery_meta">浏览量：' + spItem.sp_view_count + '</div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  /**
   * 加载图文数据
   */
  async function sp_loadGallery() {
    spApiLink.href = location.origin + '/api/gallery';
    spApiLink.textContent = location.origin + '/api/gallery';

    try {
      const spData = await sp_api('/api/gallery');
      sp_renderGallery(spData.sp_list);
      spSummary.textContent = '共 ' + spData.sp_total + ' 条图文，数据来自 MySQL 表 sp_gallery';
    } catch (spErr) {
      spGrid.innerHTML = '<p class="sp_empty">图文加载失败：' + sp_escapeHtml(spErr.message) + '</p>';
      spSummary.textContent = '加载失败';
    }
  }

  /**
   * 页面初始化
   */
  function sp_initGalleryPage() {
    sp_mountTopbar('gallery_list.html');
    sp_loadGallery();
  }

  sp_initGalleryPage();
})();
