-- 姓名：苏鹏 | 学号：24002120412
-- 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
-- 功能：校园二手交易平台数据库记录（按执行顺序追加，仅凭本文件即可完整重建数据库）
-- 对应脚本：backend/database/sp_init.sql
-- 执行时间：2026-11-20 14:40

CREATE DATABASE IF NOT EXISTS sp_campus_market DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE sp_campus_market;

DROP TABLE IF EXISTS sp_goods;
DROP TABLE IF EXISTS sp_category;
DROP TABLE IF EXISTS sp_user;

-- 1. 用户表
CREATE TABLE sp_user (
  sp_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户主键',
  sp_username VARCHAR(50) NOT NULL COMMENT '登录账号',
  sp_password CHAR(32) NOT NULL COMMENT 'MD5 加密后的密码',
  sp_nickname VARCHAR(50) NOT NULL COMMENT '昵称',
  sp_phone VARCHAR(20) NOT NULL COMMENT '联系电话',
  sp_campus VARCHAR(30) NOT NULL COMMENT '所在校区',
  sp_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  PRIMARY KEY (sp_id),
  UNIQUE KEY uk_sp_username (sp_username)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '用户表';

-- 2. 商品分类表
CREATE TABLE sp_category (
  sp_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类主键',
  sp_name VARCHAR(30) NOT NULL COMMENT '分类名称',
  sp_sort INT NOT NULL DEFAULT 0 COMMENT '排序值，越小越靠前',
  sp_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (sp_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '商品分类表';

-- 3. 商品表
CREATE TABLE sp_goods (
  sp_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品主键',
  sp_title VARCHAR(80) NOT NULL COMMENT '商品标题',
  sp_desc VARCHAR(500) NOT NULL DEFAULT '' COMMENT '商品描述',
  sp_price DECIMAL(10, 2) NOT NULL COMMENT '出售价格',
  sp_original_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '原价',
  sp_condition VARCHAR(10) NOT NULL COMMENT '成色',
  sp_category_id INT UNSIGNED NOT NULL COMMENT '分类主键',
  sp_user_id INT UNSIGNED NOT NULL COMMENT '发布者主键',
  sp_status TINYINT NOT NULL DEFAULT 1 COMMENT '0 已下架 / 1 在售 / 2 已售出',
  sp_view_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
  sp_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  PRIMARY KEY (sp_id),
  KEY idx_sp_category (sp_category_id),
  KEY idx_sp_user (sp_user_id),
  CONSTRAINT fk_sp_goods_category FOREIGN KEY (sp_category_id) REFERENCES sp_category (sp_id),
  CONSTRAINT fk_sp_goods_user FOREIGN KEY (sp_user_id) REFERENCES sp_user (sp_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '商品表';

-- 4. 用户测试数据（密码均为 123456）
INSERT INTO sp_user (sp_username, sp_password, sp_nickname, sp_phone, sp_campus, sp_created_at) VALUES
('sp_supeng', MD5('123456'), '苏鹏', '13800001111', '南校区', '2026-09-01 09:10:00'),
('sp_lina', MD5('123456'), '李娜', '13800002222', '南校区', '2026-09-02 10:20:00'),
('sp_wangqiang', MD5('123456'), '王强', '13800003333', '北校区', '2026-09-03 11:30:00'),
('sp_zhaomin', MD5('123456'), '赵敏', '13800004444', '东校区', '2026-09-05 14:15:00'),
('sp_liuyang', MD5('123456'), '刘洋', '13800005555', '南校区', '2026-09-08 16:40:00'),
('sp_chenxi', MD5('123456'), '陈曦', '13800006666', '西校区', '2026-09-12 08:50:00'),
('sp_hujie', MD5('123456'), '胡杰', '13800007777', '北校区', '2026-09-18 19:05:00'),
('sp_sunyi', MD5('123456'), '孙怡', '13800008888', '东校区', '2026-09-25 20:25:00');

-- 5. 分类测试数据
INSERT INTO sp_category (sp_name, sp_sort) VALUES
('数码电子', 1),
('教材书籍', 2),
('生活用品', 3),
('运动器材', 4),
('美妆护肤', 5),
('服饰鞋包', 6),
('乐器文娱', 7),
('交通代步', 8);

-- 6. 商品测试数据
INSERT INTO sp_goods (sp_title, sp_desc, sp_price, sp_original_price, sp_condition, sp_category_id, sp_user_id, sp_status, sp_view_count, sp_created_at) VALUES
('iPad 2021 第九代 64G 深空灰', '自用平板，屏幕无划痕，电池健康 92%，配件齐全，可当面验机。', 1650.00, 2499.00, '九成新', 1, 3, 1, 126, '2026-11-18 09:30:00'),
('小米 27 英寸显示器', '宿舍升级换下，2K 分辨率，无坏点，带原装支架和电源线。', 620.00, 1099.00, '八成新', 1, 4, 1, 88, '2026-11-17 15:20:00'),
('高等数学 第七版 上下册', '教材保存完好，仅前几页有少量笔记，期末复习好帮手。', 25.00, 78.00, '九成新', 2, 1, 1, 54, '2026-11-16 11:05:00'),
('大学英语六级真题 2025 版', '全新未拆封，买重了，便宜出，可送到宿舍楼下。', 18.00, 45.00, '全新', 2, 2, 1, 73, '2026-11-15 18:45:00'),
('护眼台灯 三档调光', 'LED 护眼台灯，三档色温，宿舍必备，功能完好。', 35.00, 129.00, '八成新', 3, 5, 1, 41, '2026-11-14 20:10:00'),
('美的 1.5L 迷你电热水壶', '宿舍限功率可用，烧水快，自动断电，无故障。', 45.00, 99.00, '九成新', 3, 6, 1, 62, '2026-11-13 07:55:00'),
('捷安特 山地自行车 26 寸', '骑行两年，刚换新链条与刹车皮，车锁一并赠送。', 480.00, 1599.00, '七成新', 8, 7, 1, 210, '2026-11-12 17:35:00'),
('斯伯丁 7 号篮球', '室内外通用，气足弹性好，无明显磨损。', 55.00, 129.00, '八成新', 4, 8, 1, 37, '2026-11-11 12:25:00'),
('雅马哈 单板民谣吉他', '41 寸单板吉他，手感好，附赠琴包与变调夹。', 680.00, 1280.00, '九成新', 7, 2, 1, 155, '2026-11-10 19:00:00'),
('兰蔻 小黑瓶精华 50ml', '专柜购入，仅用过两次，正品有购买凭证。', 420.00, 890.00, '九成新', 5, 4, 1, 96, '2026-11-09 21:15:00'),
('耐克 跑鞋 42 码', '穿了三回，尺码偏小，鞋面干净，鞋盒完好。', 260.00, 699.00, '九成新', 6, 6, 1, 58, '2026-11-08 10:40:00'),
('罗技 无线键盘 K380', '蓝牙三设备切换，键位正常，附电池。', 95.00, 239.00, '八成新', 1, 1, 0, 29, '2026-11-07 16:50:00');

-- 7. 科技新闻表（执行时间：2026-11-20 15:20）
DROP TABLE IF EXISTS sp_news;

CREATE TABLE sp_news (
  sp_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '新闻主键',
  sp_title VARCHAR(120) NOT NULL COMMENT '新闻标题',
  sp_summary VARCHAR(300) NOT NULL COMMENT '新闻摘要',
  sp_source VARCHAR(50) NOT NULL COMMENT '来源媒体',
  sp_author VARCHAR(30) NOT NULL COMMENT '作者',
  sp_tag VARCHAR(20) NOT NULL COMMENT '科技标签',
  sp_publish_time DATETIME NOT NULL COMMENT '发布时间',
  sp_view_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '阅读量',
  PRIMARY KEY (sp_id),
  KEY idx_sp_publish_time (sp_publish_time)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '科技新闻表';

-- 8. 科技新闻测试数据
INSERT INTO sp_news (sp_title, sp_summary, sp_source, sp_author, sp_tag, sp_publish_time, sp_view_count) VALUES
('国产大模型开源新版本，推理成本下降四成', '新版本在长文本理解与代码生成任务上表现突出，官方同步开放量化部署方案，中小团队可低成本私有化部署。', '科技前线', '林一舟', '人工智能', '2026-11-19 09:20:00', 1862),
('端侧 AI 芯片进入 3nm 时代，手机可离线跑多模态模型', '多家芯片厂商发布面向移动端的 3nm AI 芯片，端侧多模态推理延迟降至百毫秒级，隐私数据无需上云。', '数码观察', '周明', '芯片', '2026-11-18 14:05:00', 1420),
('折叠屏出货量同比增长 62%，铰链与屏幕成本持续下探', '供应链数据显示折叠屏核心部件良率提升，整机价格带下探至五千元档，校园群体成为新增用户主力。', '硬件周刊', '许晴', '消费电子', '2026-11-17 10:40:00', 980),
('量子计算原型机实现千比特纠错演示', '研究团队在超导量子路线上完成千比特级纠错实验，逻辑错误率下降一个数量级，为实用化奠定基础。', '科学通讯', '陈立', '量子计算', '2026-11-16 20:15:00', 764),
('低轨卫星互联网完成新一轮组网，校园宽带开始试点', '新增一批低轨卫星入轨后，偏远校区网络时延明显改善，运营商与高校合作开展卫星宽带试点。', '通信视界', '黄岩', '通信', '2026-11-15 08:30:00', 655),
('固态电池中试线投产，能量密度突破 400Wh/kg', '首批中试电芯通过安全测试，循环寿命达 1200 次，预计两年内率先在高端电动车型上量产装车。', '新能源报', '沈雨', '新能源', '2026-11-14 16:45:00', 912),
('AR 眼镜重量降至 38 克，办公场景成为新战场', '新一代 AR 眼镜采用衍射光波导方案，支持多窗口办公与实时翻译，续航提升至 8 小时。', '智能穿戴', '唐悦', '智能硬件', '2026-11-13 11:10:00', 738),
('人形机器人进入校园实验室，开源仿真平台同步发布', '开源仿真平台提供上千种操作任务与标准评测集，多所高校已用它开展机器人控制课程与科研实验。', '机器人产业', '苏文', '机器人', '2026-11-12 19:25:00', 1103),
('6G 太赫兹通信完成室外长距离验证', '试验在 300 米距离下实现百 Gbps 级传输速率，为 6G 空口关键技术提供了外场验证依据。', '通信视界', '郑楠', '通信', '2026-11-11 09:50:00', 588),
('操作系统新版本开放分布式能力，跨设备协同更顺滑', '新版系统强化了手机、平板与车机之间的任务流转，开发者可通过统一接口调用多设备算力。', '软件与系统', '吴桐', '操作系统', '2026-11-10 15:35:00', 842);
