/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：科技新闻列表页脚本，调用 /api/news 渲染新闻卡片并展示接口链接
 */
(function () {
  const spList = document.getElementById('sp_newsList');
  const spSummary = document.getElementById('sp_newsSummary');
  const spApiLink = document.getElementById('sp_apiLink');

  /**
   * 格式化日期时间
   * @param {string} spValue 时间字符串
   * @returns {string} 形如 2026-11-20 09:20
   */
  function sp_formatDateTime(spValue) {
    const spDate = new Date(spValue);
    if (Number.isNaN(spDate.getTime())) return '';
    const spPad = function (spNum) {
      return String(spNum).padStart(2, '0');
    };
    return sp_dateString(spDate) + ' ' + spPad(spDate.getHours()) + ':' + spPad(spDate.getMinutes());
  }

  /**
   * 拼接日期部分
   * @param {Date} spDate 日期对象
   * @returns {string} 形如 2026-11-20
   */
  function sp_dateString(spDate) {
    const spPad = function (spNum) {
      return String(spNum).padStart(2, '0');
    };
    return spDate.getFullYear() + '-' + spPad(spDate.getMonth() + 1) + '-' + spPad(spDate.getDate());
  }

  /**
   * 渲染新闻列表
   * @param {Array} spNewsList 新闻数组
   */
  function sp_renderNews(spNewsList) {
    if (!spNewsList.length) {
      spList.innerHTML = '<p class="sp_empty">暂无科技新闻数据</p>';
      return;
    }

    spList.innerHTML = spNewsList.map(function (spNews, spIndex) {
      return [
        '<article class="sp_news_card">',
        '  <div class="sp_news_top">',
        '    <span class="sp_news_index">#' + String(spIndex + 1).padStart(2, '0') + '</span>',
        '    <span class="sp_news_tag">' + sp_escapeHtml(spNews.sp_tag) + '</span>',
        '    <h2 class="sp_news_title">' + sp_escapeHtml(spNews.sp_title) + '</h2>',
        '  </div>',
        '  <p class="sp_news_summary">' + sp_escapeHtml(spNews.sp_summary) + '</p>',
        '  <div class="sp_news_meta">',
        '    <span>来源：' + sp_escapeHtml(spNews.sp_source) + '</span>',
        '    <span>作者：' + sp_escapeHtml(spNews.sp_author) + '</span>',
        '    <span>发布时间：' + sp_formatDateTime(spNews.sp_publish_time) + '</span>',
        '    <span>阅读量：' + spNews.sp_view_count + '</span>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  /**
   * 加载新闻数据
   */
  async function sp_loadNews() {
    spApiLink.href = location.origin + '/api/news';
    spApiLink.textContent = location.origin + '/api/news';

    try {
      const spData = await sp_api('/api/news');
      sp_renderNews(spData.sp_list);
      spSummary.textContent = '共 ' + spData.sp_total + ' 条科技新闻，数据来自 MySQL 表 sp_news';
    } catch (spErr) {
      spList.innerHTML = '<p class="sp_empty">新闻加载失败：' + sp_escapeHtml(spErr.message) + '</p>';
      spSummary.textContent = '加载失败';
    }
  }

  /**
   * 页面初始化
   */
  function sp_initNewsPage() {
    sp_mountTopbar('news_list.html');
    sp_loadNews();
  }

  sp_initNewsPage();
})();
