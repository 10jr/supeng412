/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 功能：AI 聊天页脚本，维护对话上下文并调用硅基流动对话接口
 */
(function () {
  // 通用助手提示词
  const spSystemPrompt = '你是一个乐于助人的中文 AI 助手，回答准确、简洁，必要时使用分点说明。';

  // 最多携带的历史消息条数
  const spMaxHistory = 16;

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
  const spMsgCount = document.getElementById('sp_msgCount');
  const spApiLink = document.getElementById('sp_apiLink');

  /**
   * 更新消息数量展示
   */
  function sp_updateCount() {
    spMsgCount.textContent = String(spState.sp_history.length);
  }

  /**
   * 追加一条消息气泡
   * @param {string} spRole user / assistant / error
   * @param {string} spText 消息内容
   * @returns {HTMLElement} 气泡元素
   */
  function sp_appendMessage(spRole, spText) {
    const spRow = document.createElement('div');
    spRow.className = 'sp_msg ' + (spRole === 'user' ? 'sp_msg_user' : 'sp_msg_bot');
    if (spRole === 'error') {
      spRow.className += ' sp_msg_error';
    }

    const spAvatar = document.createElement('span');
    spAvatar.className = 'sp_msg_avatar';
    spAvatar.textContent = spRole === 'user' ? '我' : 'AI';

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
   * 显示等待回复的气泡
   * @returns {HTMLElement} 等待气泡所在行，回复到达后移除
   */
  function sp_showTyping() {
    const spRow = document.createElement('div');
    spRow.className = 'sp_msg sp_msg_bot';

    const spAvatar = document.createElement('span');
    spAvatar.className = 'sp_msg_avatar';
    spAvatar.textContent = 'AI';

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
   * 切换发送状态，避免重复提交
   * @param {boolean} spPending 是否请求中
   */
  function sp_setPending(spPending) {
    spState.sp_pending = spPending;
    spSendBtn.disabled = spPending;
    spSendBtn.textContent = spPending ? '思考中…' : '发送';
    spChatStatus.textContent = spPending ? 'AI 正在思考…' : '模型就绪，开始对话吧';
  }

  /**
   * 发送消息并请求 AI 回复
   * @param {string} spText 用户输入
   */
  async function sp_sendMessage(spText) {
    const spQuestion = String(spText || '').trim();
    if (!spQuestion || spState.sp_pending) return;

    sp_appendMessage('user', spQuestion);
    spState.sp_history.push({ sp_role: 'user', sp_content: spQuestion });
    sp_updateCount();
    spChatInput.value = '';
    sp_setPending(true);

    const spTypingRow = sp_showTyping();

    try {
      const spData = await sp_sendJson('/api/ai/chat', {
        sp_provider: 'siliconflow',
        sp_system: spSystemPrompt,
        sp_messages: spState.sp_history.slice(-spMaxHistory),
        sp_temperature: 0.7,
        sp_max_tokens: 1024
      });

      const spReply = String(spData.sp_reply || '').trim() || '（模型没有返回内容，请稍后再试）';
      spTypingRow.remove();
      sp_appendMessage('assistant', spReply);
      spState.sp_history.push({ sp_role: 'assistant', sp_content: spReply });
      sp_updateCount();
      if (spData.sp_model) {
        spModelText.textContent = spData.sp_model;
      }
    } catch (spErr) {
      spTypingRow.remove();
      sp_appendMessage('error', '请求失败：' + spErr.message);
      console.error('AI 聊天请求失败：', spErr.message);
    } finally {
      sp_setPending(false);
      spChatInput.focus();
    }
  }

  /**
   * 初始化页面：加载模型信息、渲染欢迎语、绑定事件
   */
  async function sp_init() {
    sp_mountTopbar('ai_chat.html');
    spApiLink.href = location.origin + '/api/ai/chat';
    spApiLink.textContent = location.origin + '/api/ai/chat';

    sp_appendMessage(
      'assistant',
      '你好，我是 AI 聊天助手。可以问我知识问答、写作润色、学习规划等问题，试试下面的快捷提问吧。'
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
      sp_updateCount();
      sp_appendMessage('assistant', '对话已清空，我们重新开始吧。');
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
