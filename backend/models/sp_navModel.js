/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：页面导航数据模型，集中维护已完成的 HTML 页面列表
 */

// 已完成的页面清单：新增页面后在此追加一条记录
const spPages = [
  {
    sp_id: 1,
    sp_name: '首页',
    sp_path: 'index.html',
    sp_desc: '项目入口，展示项目信息与全部页面导航',
    sp_tag: '当前页面'
  }
];

/**
 * 查询页面导航列表
 * @returns {Promise<Array>} 页面列表
 */
async function sp_findAllPages() {
  return spPages;
}

module.exports = { sp_findAllPages };
