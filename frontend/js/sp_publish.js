/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：发布商品页脚本，校验表单并调用发布接口
 */
(function () {
  const spUser = sp_getUser();
  const spForm = document.getElementById('sp_publishForm');
  const spCategorySelect = document.getElementById('sp_category');
  const spTip = document.getElementById('sp_publishTip');
  const spSubmit = document.getElementById('sp_publishSubmit');

  /**
   * 加载分类选项
   */
  async function sp_loadCategoryOptions() {
    try {
      const spCategories = await sp_api('/api/categories');
      spCategories.forEach(function (spCategory) {
        const spOption = document.createElement('option');
        spOption.value = spCategory.sp_id;
        spOption.textContent = spCategory.sp_name;
        spCategorySelect.appendChild(spOption);
      });
    } catch (spErr) {
      sp_showToast('分类加载失败：' + spErr.message, 'error');
    }
  }

  /**
   * 提交发布表单
   * @param {Event} spEvent 表单提交事件
   */
  async function sp_handleSubmit(spEvent) {
    spEvent.preventDefault();
    spTip.textContent = '';

    const spPayload = {
      sp_userId: spUser.sp_id,
      sp_title: document.getElementById('sp_title').value.trim(),
      sp_category_id: Number(spCategorySelect.value),
      sp_condition: document.getElementById('sp_condition').value,
      sp_price: Number(document.getElementById('sp_price').value),
      sp_original_price: Number(document.getElementById('sp_original_price').value || 0),
      sp_desc: document.getElementById('sp_desc').value.trim()
    };

    if (spPayload.sp_title.length < 2) {
      spTip.textContent = '请填写商品标题（至少 2 个字符）';
      return;
    }
    if (!spPayload.sp_category_id) {
      spTip.textContent = '请选择商品分类';
      return;
    }
    if (!spPayload.sp_condition) {
      spTip.textContent = '请选择商品成色';
      return;
    }
    if (!(spPayload.sp_price > 0)) {
      spTip.textContent = '请输入正确的出售价格';
      return;
    }

    spSubmit.disabled = true;
    try {
      const spData = await sp_sendJson('/api/goods', spPayload);
      sp_showToast('发布成功，即将跳转到我的商品', 'success');
      window.setTimeout(function () {
        location.href = 'my_goods.html';
      }, 800);
      console.log('新商品主键：', spData.sp_id);
    } catch (spErr) {
      spTip.textContent = spErr.message;
    } finally {
      spSubmit.disabled = false;
    }
  }

  /**
   * 页面初始化
   */
  function sp_initPublishPage() {
    sp_mountTopbar('publish.html');
    if (!sp_requireLogin('publish.html')) return;
    spForm.addEventListener('submit', sp_handleSubmit);
    sp_loadCategoryOptions();
  }

  sp_initPublishPage();
})();
