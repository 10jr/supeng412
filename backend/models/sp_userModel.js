/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：用户数据模型，负责用户查询与注册写入
 */
const spPool = require('../config/sp_db');

/**
 * 按登录账号查询用户
 * @param {string} spUsername 登录账号
 * @returns {Promise<object|null>} 用户记录
 */
async function sp_findByUsername(spUsername) {
  const [spRows] = await spPool.query(
    'SELECT * FROM sp_user WHERE sp_username = ? LIMIT 1',
    [spUsername]
  );
  return spRows[0] || null;
}

/**
 * 按主键查询用户（不返回密码）
 * @param {number} spId 用户主键
 * @returns {Promise<object|null>} 用户记录
 */
async function sp_findById(spId) {
  const [spRows] = await spPool.query(
    'SELECT sp_id, sp_username, sp_nickname, sp_phone, sp_campus, sp_created_at FROM sp_user WHERE sp_id = ? LIMIT 1',
    [spId]
  );
  return spRows[0] || null;
}

/**
 * 新增用户
 * @param {object} spData 用户信息
 * @returns {Promise<number>} 新增用户主键
 */
async function sp_createUser(spData) {
  const [spResult] = await spPool.query(
    'INSERT INTO sp_user (sp_username, sp_password, sp_nickname, sp_phone, sp_campus) VALUES (?, ?, ?, ?, ?)',
    [spData.spUsername, spData.spPassword, spData.spNickname, spData.spPhone, spData.spCampus]
  );
  return spResult.insertId;
}

module.exports = { sp_findByUsername, sp_findById, sp_createUser };
