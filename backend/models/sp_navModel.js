/**
 * 姓名：苏鹏 | 学号：24002120412
 * 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：页面导航数据模型，集中维护已完成的 HTML 页面列表
 */

// 已完成的页面清单：新增页面后在此追加一条记录（detail 详情页按规则不进入导航）
const spPages = [
  {
    sp_id: 1,
    sp_name: '首页',
    sp_path: 'index.html',
    sp_desc: '项目信息与全部页面导航入口',
    sp_tag: '当前页面'
  },
  {
    sp_id: 2,
    sp_name: '商品列表',
    sp_path: 'goods_list.html',
    sp_desc: '浏览在售商品，支持关键词搜索、分类筛选与分页',
    sp_tag: ''
  },
  {
    sp_id: 3,
    sp_name: '发布商品',
    sp_path: 'publish.html',
    sp_desc: '填写商品信息，快速发布闲置物品',
    sp_tag: ''
  },
  {
    sp_id: 4,
    sp_name: '我的商品',
    sp_path: 'my_goods.html',
    sp_desc: '管理自己发布的商品，支持下架、重新上架与删除',
    sp_tag: ''
  },
  {
    sp_id: 5,
    sp_name: '登录 / 注册',
    sp_path: 'login.html',
    sp_desc: '账号登录与注册，登录后即可发布与收藏商品',
    sp_tag: ''
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
