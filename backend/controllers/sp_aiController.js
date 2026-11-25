/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 功能：AI 接口控制器，提供对话接口与当前配置查询
 */
const spAiService = require('../services/sp_aiService');

/**
 * 把消息输入统一转成 OpenAI 格式的消息数组
 * @param {object} spBody 请求体
 * @returns {Array|null} 消息数组，非法时返回 null
 */
function sp_buildMessages(spBody) {
  // 方式一：直接传消息数组 sp_messages
  if (Array.isArray(spBody.sp_messages) && spBody.sp_messages.length) {
    const spValid = spBody.sp_messages.filter(function (spItem) {
      return spItem && typeof spItem.sp_content === 'string' && spItem.sp_content.trim();
    });
    if (!spValid.length) return null;
    const spMessages = spValid.map(function (spItem) {
      return {
        role: ['system', 'assistant', 'user'].indexOf(spItem.sp_role) >= 0 ? spItem.sp_role : 'user',
        content: spItem.sp_content
      };
    });

    // 数组里未包含 system 消息时，用 sp_system 补在开头
    const spHasSystem = spMessages.some(function (spItem) {
      return spItem.role === 'system';
    });
    if (!spHasSystem && typeof spBody.sp_system === 'string' && spBody.sp_system.trim()) {
      spMessages.unshift({ role: 'system', content: spBody.sp_system });
    }
    return spMessages;
  }

  // 方式二：只传一句 sp_message，自动包裹成 user 消息
  if (typeof spBody.sp_message === 'string' && spBody.sp_message.trim()) {
    const spMessages = [];
    if (typeof spBody.sp_system === 'string' && spBody.sp_system.trim()) {
      spMessages.push({ role: 'system', content: spBody.sp_system });
    }
    spMessages.push({ role: 'user', content: spBody.sp_message });
    return spMessages;
  }

  return null;
}

/**
 * AI 对话
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_chat(spReq, spRes) {
  const spBody = spReq.body || {};
  const spMessages = sp_buildMessages(spBody);

  if (!spMessages) {
    return spRes.status(400).json({
      code: 400,
      msg: '请传入 sp_message（单句）或 sp_messages（消息数组）',
      data: null
    });
  }

  const spTemperature = Number(spBody.sp_temperature);
  const spMaxTokens = Number(spBody.sp_max_tokens);

  try {
    const spData = await spAiService.sp_chatCompletion({
      sp_messages: spMessages,
      sp_provider: spBody.sp_provider,
      sp_temperature: Number.isFinite(spTemperature) ? Math.min(Math.max(spTemperature, 0), 2) : undefined,
      sp_max_tokens: Number.isFinite(spMaxTokens) && spMaxTokens > 0 ? Math.min(spMaxTokens, 4096) : undefined
    });

    console.log('[AI] ' + spData.sp_provider + ' 对话成功，模型：' + spData.sp_model);
    spRes.json({ code: 0, msg: 'AI 回复成功', data: spData });
  } catch (spErr) {
    console.error('[AI] 对话失败：', spErr.message);

    // 按错误类型给出中文提示与合适的 HTTP 状态码
    const spMap = {
      NO_API_KEY: { spStatus: 500, spMsg: spErr.message },
      BAD_PROVIDER: { spStatus: 400, spMsg: spErr.message },
      NETWORK: { spStatus: 502, spMsg: spErr.message },
      UPSTREAM: { spStatus: 502, spMsg: spErr.message }
    };
    const spInfo = spMap[spErr.spType] || { spStatus: 500, spMsg: 'AI 调用失败：' + spErr.message };
    spRes.status(spInfo.spStatus).json({ code: spInfo.spStatus, msg: spInfo.spMsg, data: null });
  }
}

/**
 * 查询当前 AI 配置（不返回密钥本身）
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
function sp_getAiInfo(spReq, spRes) {
  try {
    const spCfg = spAiService.sp_getProviderConfig(spReq.query.sp_provider);
    spRes.json({
      code: 0,
      msg: '获取 AI 配置成功',
      data: {
        sp_provider: spCfg.sp_name,
        sp_model: spCfg.sp_model,
        sp_base_url: spCfg.sp_base_url,
        sp_has_api_key: Boolean(spCfg.sp_api_key) && spCfg.sp_api_key !== '你的key'
      }
    });
  } catch (spErr) {
    console.error('[AI] 获取配置失败：', spErr.message);
    spRes.status(400).json({ code: 400, msg: spErr.message, data: null });
  }
}

module.exports = { sp_chat, sp_getAiInfo };
