/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：登录与注册页脚本，处理表单切换、登录、注册与跳转
 */
(function () {
  const spLoginForm = document.getElementById('sp_loginForm');
  const spRegisterForm = document.getElementById('sp_registerForm');
  const spTabLogin = document.getElementById('sp_tabLogin');
  const spTabRegister = document.getElementById('sp_tabRegister');

  /**
   * 切换登录 / 注册表单
   * @param {string} spTab 目标页签（login / register）
   */
  function sp_switchTab(spTab) {
    const spIsLogin = spTab === 'login';
    spTabLogin.classList.toggle('sp_active', spIsLogin);
    spTabRegister.classList.toggle('sp_active', !spIsLogin);
    spLoginForm.classList.toggle('sp_hidden', !spIsLogin);
    spRegisterForm.classList.toggle('sp_hidden', spIsLogin);
  }

  /**
   * 登录成功后跳转：优先回到来源页，否则进入商品列表
   * @param {object} spUser 登录用户
   */
  function sp_afterAuth(spUser) {
    sp_saveUser(spUser);
    const spRedirect = sp_getQuery('sp_redirect', 'goods_list.html');
    location.href = decodeURIComponent(spRedirect);
  }

  /**
   * 提交登录表单
   * @param {Event} spEvent 表单提交事件
   */
  async function sp_handleLogin(spEvent) {
    spEvent.preventDefault();
    const spTip = document.getElementById('sp_loginTip');
    const spSubmit = document.getElementById('sp_loginSubmit');
    spTip.textContent = '';

    const spUsername = document.getElementById('sp_loginUsername').value.trim();
    const spPassword = document.getElementById('sp_loginPassword').value;

    if (!spUsername || !spPassword) {
      spTip.textContent = '请输入账号和密码';
      return;
    }

    spSubmit.disabled = true;
    try {
      const spUser = await sp_sendJson('/api/auth/login', {
        sp_username: spUsername,
        sp_password: spPassword
      });
      sp_showToast('登录成功', 'success');
      sp_afterAuth(spUser);
    } catch (spErr) {
      spTip.textContent = spErr.message;
    } finally {
      spSubmit.disabled = false;
    }
  }

  /**
   * 提交注册表单
   * @param {Event} spEvent 表单提交事件
   */
  async function sp_handleRegister(spEvent) {
    spEvent.preventDefault();
    const spTip = document.getElementById('sp_regTip');
    const spSubmit = document.getElementById('sp_regSubmit');
    spTip.textContent = '';

    const spPayload = {
      sp_username: document.getElementById('sp_regUsername').value.trim(),
      sp_password: document.getElementById('sp_regPassword').value,
      sp_nickname: document.getElementById('sp_regNickname').value.trim(),
      sp_phone: document.getElementById('sp_regPhone').value.trim(),
      sp_campus: document.getElementById('sp_regCampus').value.trim()
    };

    spSubmit.disabled = true;
    try {
      const spUser = await sp_sendJson('/api/auth/register', spPayload);
      sp_showToast('注册成功，已自动登录', 'success');
      sp_afterAuth(spUser);
    } catch (spErr) {
      spTip.textContent = spErr.message;
    } finally {
      spSubmit.disabled = false;
    }
  }

  /**
   * 页面初始化
   */
  function sp_initAuthPage() {
    sp_mountTopbar('login.html');

    // 已登录用户直接进入商品列表
    if (sp_getUser()) {
      location.href = 'goods_list.html';
      return;
    }

    spTabLogin.addEventListener('click', function () {
      sp_switchTab('login');
    });
    spTabRegister.addEventListener('click', function () {
      sp_switchTab('register');
    });
    spLoginForm.addEventListener('submit', sp_handleLogin);
    spRegisterForm.addEventListener('submit', sp_handleRegister);
  }

  sp_initAuthPage();
})();
