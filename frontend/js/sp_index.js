/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：首页导航脚本，请求 /api/pages 渲染页面卡片，并将数据输出到控制台
 */
(function () {
  // 后端不可用时的兜底数据，保证页面仍可正常导航
  const spFallbackPages = [
    {
      sp_name: '首页',
      sp_path: 'index.html',
      sp_desc: '项目入口，展示项目信息与全部页面导航',
      sp_tag: '当前页面'
    }
  ];

  const spNavGrid = document.getElementById('sp_navGrid');
  const spPageCount = document.getElementById('sp_pageCount');

  /**
   * 将页面数据渲染为导航卡片
   * @param {Array} spPages 页面列表
   */
  function sp_renderPages(spPages) {
    spNavGrid.innerHTML = '';

    if (!spPages || spPages.length === 0) {
      spNavGrid.innerHTML = '<p class="sp_nav_empty">暂无已完成页面</p>';
      spPageCount.textContent = '共 0 个页面';
      return;
    }

    spPages.forEach(function (spPage, spIndex) {
      const spCard = document.createElement('a');
      spCard.className = 'sp_nav_card';
      spCard.href = spPage.sp_path;

      const spNo = document.createElement('span');
      spNo.className = 'sp_nav_no';
      spNo.textContent = String(spIndex + 1).padStart(2, '0');

      const spBody = document.createElement('div');
      spBody.className = 'sp_nav_body';

      const spTitle = document.createElement('h3');
      spTitle.className = 'sp_nav_title';
      spTitle.textContent = spPage.sp_name;

      if (spPage.sp_tag) {
        const spBadge = document.createElement('span');
        spBadge.className = 'sp_nav_badge';
        spBadge.textContent = spPage.sp_tag;
        spTitle.appendChild(spBadge);
      }

      const spDesc = document.createElement('p');
      spDesc.className = 'sp_nav_desc';
      spDesc.textContent = spPage.sp_desc || '';

      const spArrow = document.createElement('span');
      spArrow.className = 'sp_nav_arrow';
      spArrow.textContent = '→';

      spBody.appendChild(spTitle);
      spBody.appendChild(spDesc);
      spCard.appendChild(spNo);
      spCard.appendChild(spBody);
      spCard.appendChild(spArrow);
      spNavGrid.appendChild(spCard);
    });

    spPageCount.textContent = '共 ' + spPages.length + ' 个页面';
  }

  /**
   * 请求后端页面列表接口，成功则渲染，失败则使用兜底数据
   */
  async function sp_loadPages() {
    try {
      const spResponse = await fetch('/api/pages');
      const spResult = await spResponse.json();
      console.log('页面列表接口返回：', spResult);
      if (spResult.code !== 0) {
        throw new Error(spResult.msg || '接口返回异常');
      }
      sp_renderPages(spResult.data);
    } catch (spErr) {
      console.error('获取页面列表失败，使用本地兜底数据：', spErr);
      sp_renderPages(spFallbackPages);
    }
  }

  /**
   * 页面初始化入口
   */
  function sp_initIndex() {
    if (!spNavGrid) return;
    sp_loadPages();
  }

  sp_initIndex();
})();
