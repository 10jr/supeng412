/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 功能：AI 对话服务，按 AI_PROVIDER 调用硅基流动或七牛（OpenAI 兼容接口）
 */

// 可选服务商配置读取（统一转成 OpenAI 兼容的三要素：地址、密钥、模型）
const spProviders = {
  siliconflow: function () {
    return {
      sp_name: 'siliconflow',
      sp_base_url: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1',
      sp_api_key: process.env.SILICONFLOW_API_KEY || '',
      sp_model: process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-7B-Instruct'
    };
  },
  qiniu: function () {
    return {
      sp_name: 'qiniu',
      sp_base_url: process.env.QINIU_CUSTOMER_SERVICE_BASE_URL || 'https://api.qnaigc.com/v1',
      sp_api_key: process.env.QINIU_CUSTOMER_SERVICE_API_KEY || '',
      sp_model: process.env.QINIU_CUSTOMER_SERVICE_MODEL || 'qiniu/conatus-free'
    };
  }
};

/**
 * 获取当前生效的服务商配置
 * @param {string} spProviderName 服务商名称（为空时取 .env 的 AI_PROVIDER）
 * @returns {object} 服务商配置
 */
function sp_getProviderConfig(spProviderName) {
  const spName = String(spProviderName || process.env.AI_PROVIDER || 'siliconflow').trim();
  const spFactory = spProviders[spName];
  if (!spFactory) {
    const spErr = new Error('不支持的 AI 服务商：' + spName + '，可选 siliconflow / qiniu');
    spErr.spType = 'BAD_PROVIDER';
    throw spErr;
  }
  return spFactory();
}

/**
 * 调用 OpenAI 兼容的 /chat/completions 接口
 * @param {object} spOptions 调用参数
 * @param {Array} spOptions.sp_messages 消息数组（role/content）
 * @param {string} spOptions.sp_provider 服务商（可空）
 * @param {number} spOptions.sp_temperature 温度（可空）
 * @param {number} spOptions.sp_max_tokens 最大生成 token（可空）
 * @returns {Promise<object>} 归一化后的回复数据
 */
async function sp_chatCompletion(spOptions) {
  const spCfg = sp_getProviderConfig(spOptions.sp_provider);

  if (!spCfg.sp_api_key || spCfg.sp_api_key === '你的key') {
    const spErr = new Error('未配置 ' + spCfg.sp_name + ' 的 API Key，请在 backend/.env 中填写');
    spErr.spType = 'NO_API_KEY';
    throw spErr;
  }

  const spUrl = spCfg.sp_base_url.replace(/\/+$/, '') + '/chat/completions';
  const spBody = {
    model: spCfg.sp_model,
    messages: spOptions.sp_messages,
    stream: false
  };
  if (typeof spOptions.sp_temperature === 'number') {
    spBody.temperature = spOptions.sp_temperature;
  }
  if (typeof spOptions.sp_max_tokens === 'number') {
    spBody.max_tokens = spOptions.sp_max_tokens;
  }

  // 30 秒超时保护，避免请求一直挂起
  const spController = new AbortController();
  const spTimer = setTimeout(function () {
    spController.abort();
  }, 30000);

  let spRes;
  try {
    spRes = await fetch(spUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + spCfg.sp_api_key
      },
      body: JSON.stringify(spBody),
      signal: spController.signal
    });
  } catch (spFetchErr) {
    const spErr = new Error(
      spFetchErr.name === 'AbortError' ? 'AI 服务响应超时（30 秒）' : 'AI 服务网络请求失败：' + spFetchErr.message
    );
    spErr.spType = 'NETWORK';
    throw spErr;
  } finally {
    clearTimeout(spTimer);
  }

  if (!spRes.ok) {
    let spDetail = '';
    try {
      spDetail = await spRes.text();
    } catch (spReadErr) {
      spDetail = '';
    }
    const spErr = new Error('AI 服务返回错误（HTTP ' + spRes.status + '）：' + (spDetail || spRes.statusText));
    spErr.spType = 'UPSTREAM';
    spErr.spStatus = spRes.status;
    throw spErr;
  }

  const spJson = await spRes.json();
  const spChoice = (spJson.choices && spJson.choices[0]) || null;
  const spReply = spChoice && spChoice.message ? spChoice.message.content : '';

  return {
    sp_provider: spCfg.sp_name,
    sp_model: spJson.model || spCfg.sp_model,
    sp_reply: spReply,
    sp_usage: spJson.usage || null
  };
}

module.exports = { sp_chatCompletion, sp_getProviderConfig };
