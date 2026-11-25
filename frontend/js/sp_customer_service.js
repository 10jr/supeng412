/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 功能：在线客服页脚本，维护对话上下文并调用硅基流动 AI 接口
 */
(function () {
  // 客服系统提示词：限定回答范围，减少无关内容
  const spSystemPrompt =
    '你是「校园二手集市」的在线客服，名字叫小集。' +
    '该平台面向在校学生发布和浏览二手商品，支持搜索商品、发布商品、管理我的商品、查看科技新闻与图文列表。' +
    '请用简洁友好的中文回答，控制在 120 字以内；涉及价格、交易纠纷时提醒用户线下当面验货。' +
    '如果问题与平台无关，先简短回答再引导回二手交易话题。';

  // 最多携带的历史消息条数，避免上下文过长
  const spMaxHistory = 12;

  const spState = {
    sp_history: [],
    sp_pending: false
  };

  const spChatBody = document.getElementById('sp_chatBody');
  const spChatForm = document.getElementById('sp_chatForm');
  const spChatInput = document.getElementById('sp_chatInput');
  const spSendBtn = document.getElementById('sp_sendBtn');
  const spClearBtn = document.getElementById('sp_clearBtn');
  const spChatStatus = document.getElementById('sp_chatStatus');
  const spModelText = document.getElementById('sp_modelText');
  const spApiLink = document.getElementById('sp_apiLink');

  /**
   * 向对话区追加一条消息气泡
   * @param {string} spRole user / assistant / error
   * @param {string} spText 消息内容
   * @returns {HTMLElement} 气泡元素，便于后续更新
   */
  function sp_appendMessage(spRole, spText) {
    const spRow = document.createElement('div');
    spRow.className = 'sp_msg ' + (spRole === 'user' ? 'sp_msg_user' : 'sp_msg_bot');
    if (spRole === 'error') {
      spRow.className += ' sp_msg_error';
    }

    const spAvatar = document.createElement('span');
    spAvatar.className = 'sp_msg_avatar';
    spAvatar.textContent = spRole === 'user' ? '我' : '集';

    const spBubble = document.createElement('div');
    spBubble.className = 'sp_msg_bubble';
    spBubble.textContent = spText;

    spRow.appendChild(spAvatar);
    spRow.appendChild(spBubble);
    spChatBody.appendChild(spRow);
    spChatBody.scrollTop = spChatBody.scrollHeight;
    return spBubble;
  }

  /**
   * 显示「正在输入」的等待气泡
   * @returns {HTMLElement} 气泡容器，回复到达后用于替换
   */
  function sp_showTyping() {
    const spRow = document.createElement('div');
    spRow.className = 'sp_msg sp_msg_bot';

    const spAvatar = document.createElement('span');
    spAvatar.className = 'sp_msg_avatar';
    spAvatar.textContent = '集';

    const spBubble = document.createElement('div');
    spBubble.className = 'sp_msg_bubble';
    spBubble.innerHTML = '<span class="sp_typing"><i></i><i></i><i></i></span>';

    spRow.appendChild(spAvatar);
    spRow.appendChild(spBubble);
    spChatBody.appendChild(spRow);
    spChatBody.scrollTop = spChatBody.scrollHeight;
    return spRow;
  }

  /**
   * 切换发送状态，防止重复提交
   * @param {boolean} spPending 是否请求中
   */
  function sp_setPending(spPending) {
    spState.sp_pending = spPending;
    spSendBtn.disabled = spPending;
    spSendBtn.textContent = spPending ? '思考中…' : '发送';
    spChatStatus.textContent = spPending ? '客服正在输入…' : '客服在线，随时为你解答';
  }

  /**
   * 发送一条用户消息并请求 AI 回复
   * @param {string} spText 用户输入内容
   */
  async function sp_sendMessage(spText) {
    const spQuestion = String(spText || '').trim();
    if (!spQuestion || spState.sp_pending) return;

    sp_appendMessage('user', spQuestion);
    spState.sp_history.push({ sp_role: 'user', sp_content: spQuestion });
    spChatInput.value = '';
    sp_setPending(true);

    const spTypingRow = sp_showTyping();

    try {
      const spData = await sp_sendJson('/api/ai/chat', {
        sp_provider: 'siliconflow',
        sp_system: spSystemPrompt,
        sp_messages: spState.sp_history.slice(-spMaxHistory),
        sp_temperature: 0.6,
        sp_max_tokens: 512
      });

      const spReply = String(spData.sp_reply || '').trim() || '（客服暂时没有返回内容，请稍后再试）';
      spTypingRow.remove();
      sp_appendMessage('assistant', spReply);
      spState.sp_history.push({ sp_role: 'assistant', sp_content: spReply });
      spModelText.textContent = spData.sp_model || spModelText.textContent;
    } catch (spErr) {
      spTypingRow.remove();
      spAppendError(spErr.message);
    } finally {
      sp_setPending(false);
      spChatInput.focus();
    }
  }

  /**
   * 追加一条错误提示气泡
   * @param {string} spMessage 错误信息
   */
  function spAppendError(spMessage) {
    sp_appendMessage('error', '抱歉，客服暂时无法回答：' + spMessage);
    console.error('在线客服请求失败：', spMessage);
  }

  /**
   * 初始化：加载 AI 配置、渲染欢迎语、绑定交互事件
   */
  async function sp_init() {
    sp_mountTopbar('customer_service.html');
    const spOrigin = location.protocol === 'file:' ? 'http://localhost:8412' : location.origin;
    spApiLink.href = spOrigin + '/api/ai/chat';
    spApiLink.textContent = spOrigin + '/api/ai/chat';

    sp_appendMessage(
      'assistant',
      '你好，我是校园二手集市客服小集。发布商品、搜索商品、交易安全等问题都可以问我～'
    );

    try {
      const spInfo = await sp_api('/api/ai/info');
      spModelText.textContent = spInfo.sp_model;
      if (!spInfo.sp_has_api_key) {
        spChatStatus.textContent = '提示：尚未配置硅基流动 API Key';
      }
    } catch (spErr) {
      spModelText.textContent = '获取失败';
      console.error('获取 AI 配置失败：', spErr.message);
    }

    spChatForm.addEventListener('submit', function (spEvent) {
      spEvent.preventDefault();
      sp_sendMessage(spChatInput.value);
    });

    // Enter 发送，Shift + Enter 换行
    spChatInput.addEventListener('keydown', function (spEvent) {
      if (spEvent.key === 'Enter' && !spEvent.shiftKey) {
        spEvent.preventDefault();
        sp_sendMessage(spChatInput.value);
      }
    });

    spClearBtn.addEventListener('click', function () {
      spState.sp_history = [];
      spChatBody.innerHTML = '';
      sp_appendMessage('assistant', '对话已清空，有什么可以帮你的吗？');
      sp_showToast('对话已清空', 'success');
    });

    document.getElementById('sp_quickBox').addEventListener('click', function (spEvent) {
      const spBtn = spEvent.target.closest('[data-sp-question]');
      if (spBtn) {
        sp_sendMessage(spBtn.getAttribute('data-sp-question'));
      }
    });
  }

  sp_init();
})();
