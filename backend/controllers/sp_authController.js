/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：用户认证控制器，处理注册与登录
 */
const crypto = require('crypto');
const spUserModel = require('../models/sp_userModel');

/**
 * 生成 MD5 摘要（与数据库中的密码存储方式保持一致）
 * @param {string} spText 明文
 * @returns {string} 32 位小写 MD5
 */
function sp_md5(spText) {
  return crypto.createHash('md5').update(spText).digest('hex');
}

/**
 * 组装对外返回的用户信息（去除密码字段）
 * @param {object} spUser 数据库用户记录
 * @returns {object} 可安全返回的用户信息
 */
function sp_pickUserInfo(spUser) {
  return {
    sp_id: spUser.sp_id,
    sp_username: spUser.sp_username,
    sp_nickname: spUser.sp_nickname,
    sp_phone: spUser.sp_phone,
    sp_campus: spUser.sp_campus
  };
}

/**
 * 用户注册
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_register(spReq, spRes) {
  const spBody = spReq.body || {};
  const spUsername = String(spBody.sp_username || '').trim();
  const spPassword = String(spBody.sp_password || '');
  const spNickname = String(spBody.sp_nickname || '').trim();
  const spPhone = String(spBody.sp_phone || '').trim();
  const spCampus = String(spBody.sp_campus || '').trim();

  if (spUsername.length < 3 || spUsername.length > 20) {
    return spRes.json({ code: 1, msg: '账号长度需为 3-20 个字符', data: null });
  }
  if (spPassword.length < 6) {
    return spRes.json({ code: 1, msg: '密码长度不少于 6 位', data: null });
  }
  if (!spNickname) {
    return spRes.json({ code: 1, msg: '请填写昵称', data: null });
  }
  if (!/^1\d{10}$/.test(spPhone)) {
    return spRes.json({ code: 1, msg: '请填写 11 位手机号', data: null });
  }
  if (!spCampus) {
    return spRes.json({ code: 1, msg: '请填写所在校区', data: null });
  }

  try {
    const spExist = await spUserModel.sp_findByUsername(spUsername);
    if (spExist) {
      return spRes.json({ code: 1, msg: '该账号已被注册', data: null });
    }

    const spUserId = await spUserModel.sp_createUser({
      spUsername: spUsername,
      spPassword: sp_md5(spPassword),
      spNickname: spNickname,
      spPhone: spPhone,
      spCampus: spCampus
    });
    const spUser = await spUserModel.sp_findById(spUserId);
    spRes.json({ code: 0, msg: '注册成功', data: spUser });
  } catch (spErr) {
    console.error('注册失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '注册失败，请稍后重试', data: null });
  }
}

/**
 * 用户登录
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_login(spReq, spRes) {
  const spBody = spReq.body || {};
  const spUsername = String(spBody.sp_username || '').trim();
  const spPassword = String(spBody.sp_password || '');

  if (!spUsername || !spPassword) {
    return spRes.json({ code: 1, msg: '请输入账号和密码', data: null });
  }

  try {
    const spUser = await spUserModel.sp_findByUsername(spUsername);
    if (!spUser || spUser.sp_password !== sp_md5(spPassword)) {
      return spRes.json({ code: 1, msg: '账号或密码错误', data: null });
    }
    spRes.json({ code: 0, msg: '登录成功', data: sp_pickUserInfo(spUser) });
  } catch (spErr) {
    console.error('登录失败：', spErr);
    spRes.status(500).json({ code: 500, msg: '登录失败，请稍后重试', data: null });
  }
}

module.exports = { sp_register, sp_login };
