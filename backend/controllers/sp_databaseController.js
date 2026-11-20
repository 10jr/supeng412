/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：数据库连接测试控制器，使用传入的账号密码尝试连接 MySQL
 */
const mysql = require('mysql2/promise');

// 常见连接错误码对应的中文提示
const spErrorTips = {
  ER_ACCESS_DENIED_ERROR: '用户名或密码错误，请检查后重试',
  ER_DBACCESS_DENIED_ERROR: '该账号没有访问权限',
  ECONNREFUSED: '无法连接数据库服务，请确认 MySQL 已启动',
  ETIMEDOUT: '连接超时，请确认数据库地址与端口是否正确',
  ENOTFOUND: '找不到数据库主机地址',
  ER_NOT_SUPPORTED_AUTH_MODE: '该账号的认证方式不受支持'
};

/**
 * 测试 MySQL 连接
 * @param {object} spReq Express 请求对象
 * @param {object} spRes Express 响应对象
 */
async function sp_testConnection(spReq, spRes) {
  const spBody = spReq.body || {};
  const spUser = String(spBody.sp_user || '').trim();
  const spPassword = String(spBody.sp_password === undefined ? '' : spBody.sp_password);
  const spHost = process.env.DB_HOST || '127.0.0.1';

  if (!spUser) {
    return spRes.json({ code: 1, msg: '请输入数据库用户名', data: null });
  }

  let spConn = null;
  try {
    spConn = await mysql.createConnection({
      host: spHost,
      port: Number(process.env.DB_PORT || 3306),
      user: spUser,
      password: spPassword,
      connectTimeout: 5000
    });

    const [spVersionRows] = await spConn.query('SELECT VERSION() AS sp_version');
    const [spDbRows] = await spConn.query('SHOW DATABASES');
    const spDatabases = spDbRows
      .map(function (spRow) {
        return spRow.Database || spRow.sp_Database;
      })
      .filter(Boolean)
      .slice(0, 30);

    console.log('数据库连接成功：', spUser, '@', spHost);
    spRes.json({
      code: 0,
      msg: '数据库连接成功',
      data: {
        sp_host: spHost,
        sp_user: spUser,
        sp_version: spVersionRows[0].sp_version,
        sp_databases: spDatabases
      }
    });
  } catch (spErr) {
    console.error('数据库连接失败：', spErr.code, spErr.message);
    spRes.json({
      code: 1,
      msg: spErrorTips[spErr.code] || '连接失败：' + spErr.message,
      data: { sp_code: spErr.code || 'UNKNOWN' }
    });
  } finally {
    if (spConn) {
      try {
        await spConn.end();
      } catch (spEndErr) {
        console.error('关闭数据库连接失败：', spEndErr.message);
      }
    }
  }
}

module.exports = { sp_testConnection };
