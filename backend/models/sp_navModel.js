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
  },
  {
    sp_id: 6,
    sp_name: '数据库连接',
    sp_path: 'database.html',
    sp_desc: '输入 MySQL 账号密码，测试数据库连接是否成功',
    sp_tag: ''
  },
  {
    sp_id: 7,
    sp_name: '科技新闻',
    sp_path: 'news_list.html',
    sp_desc: '展示 MySQL 表 sp_news 中的科技新闻数据与后端接口链接',
    sp_tag: ''
  },
  {
    sp_id: 8,
    sp_name: '图文列表',
    sp_path: 'gallery_list.html',
    sp_desc: '展示 MySQL 表 sp_gallery 中的图文数据与本地生成图片',
    sp_tag: ''
  },
  {
    sp_id: 9,
    sp_name: '在线客服',
    sp_path: 'customer_service.html',
    sp_desc: '基于七牛云 Conatus 大模型的智能客服，支持多轮对话问答',
    sp_tag: ''
  },
  {
    sp_id: 10,
    sp_name: 'AI 聊天',
    sp_path: 'ai_chat.html',
    sp_desc: '基于硅基流动 DeepSeek 模型的通用 AI 聊天应用',
    sp_tag: ''
  },
  {
    sp_id: 11,
    sp_name: '知识库问答',
    sp_path: 'knowledge_base.html',
    sp_desc: '上传 doc/docx/ppt/pptx/pdf/txt 构建专属知识库，基于知识库问答（RAG）',
    sp_tag: '新增'
  },
  {
    sp_id: 12,
    sp_name: '图像识别',
    sp_path: 'image_recognition.html',
    sp_desc: '上传图片，调用硅基流动视觉模型返回图片描述',
    sp_tag: '新增'
  },
  {
    sp_id: 13,
    sp_name: '语音识别',
    sp_path: 'speech_recognition.html',
    sp_desc: '上传语音，调用七牛 Qwen-Audio-3.0-ASR-Flash 模型转写文字',
    sp_tag: '新增'
  },
  {
    sp_id: 14,
    sp_name: '实践板块',
    sp_path: 'practice.html',
    sp_desc: 'AI 聊天、客服、知识库、图像识别、语音识别的运行截图展示',
    sp_tag: '新增'
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
