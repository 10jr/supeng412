-- 姓名：苏鹏 | 学号：24002120412
-- 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
-- 功能：图文列表表结构与测试数据（图片为本地生成的校园闲置场景图）

USE sp_campus_market;

DROP TABLE IF EXISTS sp_gallery;

CREATE TABLE sp_gallery (
  sp_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图文主键',
  sp_title VARCHAR(80) NOT NULL COMMENT '图文标题',
  sp_desc VARCHAR(300) NOT NULL COMMENT '图文描述',
  sp_image_url VARCHAR(200) NOT NULL COMMENT '图片地址（相对 frontend 根目录）',
  sp_tag VARCHAR(20) NOT NULL COMMENT '标签',
  sp_publish_time DATETIME NOT NULL COMMENT '发布时间',
  sp_view_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  PRIMARY KEY (sp_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '图文列表表';

INSERT INTO sp_gallery (sp_title, sp_desc, sp_image_url, sp_tag, sp_publish_time, sp_view_count) VALUES
('宿舍桌面数码套装', '平板 + 无线键盘 + 蓝牙音箱，屏幕无划痕，键盘键位完好，毕业打包出，可当面验货。', 'images/gallery/sp_gallery_1.jpg', '数码', '2026-11-19 10:10:00', 328),
('考研教材打包转让', '高数、线代、英语真题共 12 本，笔记齐全，重点已用标签标注，适合考研起步的同学。', 'images/gallery/sp_gallery_2.jpg', '书籍', '2026-11-18 16:30:00', 264),
('通勤山地车 26 寸', '骑行两年，刚换链条和刹车皮，车锁随车赠送，适合校园通勤与周末骑行。', 'images/gallery/sp_gallery_3.jpg', '出行', '2026-11-17 09:45:00', 412),
('单板民谣吉他', '41 寸单板吉他，手感顺滑，附赠琴包与变调夹，适合入门与社团排练。', 'images/gallery/sp_gallery_4.jpg', '乐器', '2026-11-16 19:20:00', 296),
('跑鞋与篮球组合', '42 码跑鞋只穿过三次，篮球气足弹性好，打包出售更划算，可到操场自提。', 'images/gallery/sp_gallery_5.jpg', '运动', '2026-11-15 13:05:00', 187),
('护肤小样套装', '专柜赠品小样组合，包含喷雾、精华与面霜，均为全新未开封，正品可验。', 'images/gallery/sp_gallery_6.jpg', '美妆', '2026-11-14 20:40:00', 233),
('护眼台灯 夜读必备', '三档色温可调，光照均匀不刺眼，宿舍书桌适配，功能完好无故障。', 'images/gallery/sp_gallery_7.jpg', '生活', '2026-11-13 21:15:00', 154),
('单反相机与头戴耳机', '入门单反搭配 18-55 镜头，快门数不高；头戴耳机音质完好，配件齐全，可拆分出售。', 'images/gallery/sp_gallery_8.jpg', '数码', '2026-11-12 15:50:00', 372);
