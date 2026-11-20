/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：数据库连接页脚本，提交账号密码并展示连接成功或失败提示
 */
(function () {
  const spForm = document.getElementById('sp_dbForm');
  const spUserInput = document.getElementById('sp_dbUser');
  const spPasswordInput = document.getElementById('sp_dbPassword');
  const spTip = document.getElementById('sp_dbTip');
  const spSubmit = document.getElementById('sp_dbSubmit');
  const spResult = document.getElementById('sp_dbResult');

  /**
   * 渲染连接成功提示
   * @param {object} spData 接口返回的连接信息
   */
  function sp_renderSuccess(spData) {
    const spDatabases = (spData.sp_databases || [])
      .map(function (spName) {
        return '<li>' + sp_escapeHtml(spName) + '</li>';
      })
      .join('');

    spResult.innerHTML = [
      '<div class="sp_db_box sp_db_success">',
      '  <p class="sp_db_title"><span class="sp_db_dot"></span>连接成功</p>',
      '  <p class="sp_db_desc">主机：' + sp_escapeHtml(spData.sp_host) + ' · 账号：' + sp_escapeHtml(spData.sp_user) + '</p>',
      '  <p class="sp_db_desc">MySQL 版本：' + sp_escapeHtml(spData.sp_version) + '</p>',
      '  <p class="sp_db_desc">可见数据库（最多 30 个）：</p>',
      '  <ul class="sp_db_list">' + spDatabases + '</ul>',
      '</div>'
    ].join('');
  }

  /**
   * 渲染连接失败提示
   * @param {string} spMessage 失败原因
   */
  function sp_renderError(spMessage) {
    spResult.innerHTML = [
      '<div class="sp_db_box sp_db_error">',
      '  <p class="sp_db_title"><span class="sp_db_dot"></span>连接失败</p>',
      '  <p class="sp_db_desc">' + sp_escapeHtml(spMessage) + '</p>',
      '  <p class="sp_db_desc">请检查 MySQL 服务是否启动，以及用户名和密码是否正确。</p>',
      '</div>'
    ].join('');
  }

  /**
   * 提交连接测试
   * @param {Event} spEvent 表单提交事件
   */
  async function sp_handleSubmit(spEvent) {
    spEvent.preventDefault();
    spTip.textContent = '';
    const spUser = spUserInput.value.trim();
    const spPassword = spPasswordInput.value;

    if (!spUser) {
      spTip.textContent = '请输入数据库用户名';
      return;
    }

    spSubmit.disabled = true;
    spResult.innerHTML = '<p class="sp_empty">正在连接数据库…</p>';
    try {
      const spData = await sp_sendJson('/api/database/test', {
        sp_user: spUser,
        sp_password: spPassword
      });
      sp_renderSuccess(spData);
      sp_showToast('数据库连接成功', 'success');
    } catch (spErr) {
      sp_renderError(spErr.message);
      sp_showToast('数据库连接失败', 'error');
    } finally {
      spSubmit.disabled = false;
    }
  }

  /**
   * 重置表单为默认账号密码
   */
  function sp_resetForm() {
    spUserInput.value = 'root';
    spPasswordInput.value = '060701';
    spTip.textContent = '';
    spResult.innerHTML = '';
  }

  /**
   * 页面初始化
   */
  function sp_initDatabasePage() {
    sp_mountTopbar('database.html');
    spForm.addEventListener('submit', sp_handleSubmit);
    document.getElementById('sp_dbReset').addEventListener('click', sp_resetForm);
  }

  sp_initDatabasePage();
})();
