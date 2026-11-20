/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：全站公共脚本，提供接口请求、登录态存储、顶栏渲染与格式化工具
 */
(function (spGlobal) {
  const spUserKey = 'sp_user';

  /**
   * 统一请求后端接口，自动解析 JSON 并输出日志
   * @param {string} spUrl 接口地址
   * @param {object} spOptions fetch 配置
   * @returns {Promise<any>} 接口 data 字段
   */
  async function sp_api(spUrl, spOptions) {
    const spConfig = Object.assign({}, spOptions);
    spConfig.headers = Object.assign({ 'Content-Type': 'application/json' }, spConfig.headers);

    try {
      const spResponse = await fetch(spUrl, spConfig);
      const spResult = await spResponse.json();
      if (spResult.code !== 0) {
        console.error('接口返回失败：' + spUrl, spResult);
        throw new Error(spResult.msg || '请求失败');
      }
      console.log('接口返回成功：' + spUrl, spResult);
      return spResult.data;
    } catch (spErr) {
      console.error('接口请求异常：' + spUrl, spErr);
      throw spErr;
    }
  }

  /**
   * 发送 JSON 格式的 POST/PUT 请求
   * @param {string} spUrl 接口地址
   * @param {object} spData 请求体
   * @param {string} spMethod 请求方法
   * @returns {Promise<any>} 接口 data 字段
   */
  function sp_sendJson(spUrl, spData, spMethod) {
    return sp_api(spUrl, {
      method: spMethod || 'POST',
      body: JSON.stringify(spData || {})
    });
  }

  /**
   * 读取本地保存的登录用户
   * @returns {object|null} 用户信息
   */
  function sp_getUser() {
    try {
      const spRaw = localStorage.getItem(spUserKey);
      return spRaw ? JSON.parse(spRaw) : null;
    } catch (spErr) {
      console.error('读取登录态失败：', spErr);
      return null;
    }
  }

  /**
   * 保存登录用户信息
   * @param {object} spUser 用户信息
   */
  function sp_saveUser(spUser) {
    localStorage.setItem(spUserKey, JSON.stringify(spUser));
  }

  /**
   * 清除登录态
   */
  function sp_clearUser() {
    localStorage.removeItem(spUserKey);
  }

  /**
   * 校验登录，未登录时跳转登录页并携带回跳地址
   * @param {string} spRedirect 登录成功后的回跳页面
   * @returns {object|null} 已登录用户
   */
  function sp_requireLogin(spRedirect) {
    const spUser = sp_getUser();
    if (!spUser) {
      location.href = 'login.html?sp_redirect=' + encodeURIComponent(spRedirect || location.pathname.split('/').pop());
      return null;
    }
    return spUser;
  }

  /**
   * 转义文本，防止拼接 HTML 时产生注入风险
   * @param {any} spText 原始文本
   * @returns {string} 转义后的文本
   */
  function sp_escapeHtml(spText) {
    return String(spText === undefined || spText === null ? '' : spText)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * 价格格式化，保留两位小数
   * @param {any} spValue 价格
   * @returns {string} 形如 ¥12.00
   */
  function sp_formatPrice(spValue) {
    const spNum = Number(spValue);
    return '¥' + (Number.isFinite(spNum) ? spNum.toFixed(2) : '0.00');
  }

  /**
   * 日期格式化
   * @param {any} spValue 时间字符串
   * @returns {string} 形如 2026-11-20
   */
  function sp_formatDate(spValue) {
    const spDate = new Date(spValue);
    if (Number.isNaN(spDate.getTime())) return '';
    const spPad = function (spNum) {
      return String(spNum).padStart(2, '0');
    };
    return spDate.getFullYear() + '-' + spPad(spDate.getMonth() + 1) + '-' + spPad(spDate.getDate());
  }

  /**
   * 商品状态码转文案
   * @param {number} spStatus 状态码
   * @returns {string} 状态文案
   */
  function sp_statusText(spStatus) {
    return { 0: '已下架', 1: '在售', 2: '已售出' }[Number(spStatus)] || '未知';
  }

  /**
   * 读取地址栏查询参数
   * @param {string} spKey 参数名
   * @param {string} spDefault 默认值
   * @returns {string} 参数值
   */
  function sp_getQuery(spKey, spDefault) {
    const spValue = new URLSearchParams(location.search).get(spKey);
    return spValue === null || spValue === '' ? spDefault : spValue;
  }

  /**
   * 显示轻提示
   * @param {string} spMsg 提示内容
   * @param {string} spType 类型（success / error）
   */
  function sp_showToast(spMsg, spType) {
    const spToast = document.createElement('div');
    spToast.className = 'sp_toast ' + (spType === 'error' ? 'sp_toast_error' : 'sp_toast_success');
    spToast.textContent = spMsg;
    document.body.appendChild(spToast);
    window.setTimeout(function () {
      spToast.remove();
    }, 2400);
  }

  /**
   * 渲染全站顶栏，包含导航与登录状态
   * @param {string} spActive 当前激活的页面文件名
   */
  function sp_mountTopbar(spActive) {
    const spNavItems = [
      { sp_name: '首页', sp_path: 'index.html' },
      { sp_name: '商品列表', sp_path: 'goods_list.html' },
      { sp_name: '发布商品', sp_path: 'publish.html' },
      { sp_name: '我的商品', sp_path: 'my_goods.html' },
      { sp_name: '科技新闻', sp_path: 'news_list.html' }
    ];
    const spUser = sp_getUser();

    const spHeader = document.createElement('header');
    spHeader.className = 'sp_topbar';

    const spInner = document.createElement('div');
    spInner.className = 'sp_topbar_inner';

    const spBrand = document.createElement('a');
    spBrand.className = 'sp_brand';
    spBrand.href = 'index.html';
    spBrand.innerHTML = '校园二手<span>集市</span>';

    const spNav = document.createElement('nav');
    spNav.className = 'sp_topnav';
    spNavItems.forEach(function (spItem) {
      const spLink = document.createElement('a');
      spLink.href = spItem.sp_path;
      spLink.textContent = spItem.sp_name;
      if (spItem.sp_path === spActive) {
        spLink.className = 'sp_active';
      }
      spNav.appendChild(spLink);
    });

    const spUserBox = document.createElement('div');
    spUserBox.className = 'sp_userbox';

    if (spUser) {
      const spAvatar = document.createElement('span');
      spAvatar.className = 'sp_avatar';
      spAvatar.textContent = String(spUser.sp_nickname || 'U').slice(0, 1);

      const spName = document.createElement('span');
      spName.textContent = spUser.sp_nickname + ' · ' + spUser.sp_campus;

      const spLogout = document.createElement('button');
      spLogout.className = 'sp_link_btn';
      spLogout.type = 'button';
      spLogout.textContent = '退出';
      spLogout.addEventListener('click', function () {
        sp_clearUser();
        location.href = 'index.html';
      });

      spUserBox.appendChild(spAvatar);
      spUserBox.appendChild(spName);
      spUserBox.appendChild(spLogout);
    } else {
      const spLoginLink = document.createElement('a');
      spLoginLink.href = 'login.html';
      spLoginLink.textContent = '登录 / 注册';
      spUserBox.appendChild(spLoginLink);
    }

    spInner.appendChild(spBrand);
    spInner.appendChild(spNav);
    spInner.appendChild(spUserBox);
    spHeader.appendChild(spInner);
    document.body.insertBefore(spHeader, document.body.firstChild);
  }

  spGlobal.sp_api = sp_api;
  spGlobal.sp_sendJson = sp_sendJson;
  spGlobal.sp_getUser = sp_getUser;
  spGlobal.sp_saveUser = sp_saveUser;
  spGlobal.sp_clearUser = sp_clearUser;
  spGlobal.sp_requireLogin = sp_requireLogin;
  spGlobal.sp_escapeHtml = sp_escapeHtml;
  spGlobal.sp_formatPrice = sp_formatPrice;
  spGlobal.sp_formatDate = sp_formatDate;
  spGlobal.sp_statusText = sp_statusText;
  spGlobal.sp_getQuery = sp_getQuery;
  spGlobal.sp_showToast = sp_showToast;
  spGlobal.sp_mountTopbar = sp_mountTopbar;
})(window);
