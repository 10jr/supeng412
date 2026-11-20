# 接口文档

> 姓名：苏鹏 | 学号：24002120412
> 统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 表示成功，非 0 表示失败。

---

## 健康检查

- 接口路径：`/api/health`
- HTTP 方法：`GET`
- 请求参数：无

请求示例：

```
GET http://localhost:8412/api/health
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "服务运行正常",
  "data": {
    "spPort": 8412,
    "spTime": "2026-11-20T06:21:00.000Z"
  }
}
```

- 修改时间：2026-11-20 14:21

---

## 获取页面导航列表

- 接口路径：`/api/pages`
- HTTP 方法：`GET`
- 请求参数：无

请求示例：

```
GET http://localhost:8412/api/pages
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "获取页面列表成功",
  "data": [
    {
      "sp_id": 1,
      "sp_name": "首页",
      "sp_path": "index.html",
      "sp_desc": "项目入口，展示项目信息与全部页面导航",
      "sp_tag": "当前页面"
    }
  ]
}
```

- 修改时间：2026-11-20 14:21

---

## 用户注册

- 接口路径：`/api/auth/register`
- HTTP 方法：`POST`
- 请求参数（JSON）：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| sp_username | string | 是 | 账号，3-20 个字符，唯一 |
| sp_password | string | 是 | 密码，不少于 6 位 |
| sp_nickname | string | 是 | 昵称 |
| sp_phone | string | 是 | 11 位手机号 |
| sp_campus | string | 是 | 所在校区 |

请求示例：

```json
{
  "sp_username": "sp_supeng",
  "sp_password": "123456",
  "sp_nickname": "苏鹏",
  "sp_phone": "13800001111",
  "sp_campus": "南校区"
}
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "注册成功",
  "data": {
    "sp_id": 1,
    "sp_username": "sp_supeng",
    "sp_nickname": "苏鹏",
    "sp_phone": "13800001111",
    "sp_campus": "南校区"
  }
}
```

- 修改时间：2026-11-20 14:40

---

## 用户登录

- 接口路径：`/api/auth/login`
- HTTP 方法：`POST`
- 请求参数（JSON）：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| sp_username | string | 是 | 账号 |
| sp_password | string | 是 | 密码 |

请求示例：

```json
{ "sp_username": "sp_supeng", "sp_password": "123456" }
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "登录成功",
  "data": {
    "sp_id": 1,
    "sp_username": "sp_supeng",
    "sp_nickname": "苏鹏",
    "sp_phone": "13800001111",
    "sp_campus": "南校区"
  }
}
```

- 修改时间：2026-11-20 14:40

---

## 获取商品分类

- 接口路径：`/api/categories`
- HTTP 方法：`GET`
- 请求参数：无

请求示例：

```
GET http://localhost:8412/api/categories
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "获取分类成功",
  "data": [
    { "sp_id": 1, "sp_name": "数码电子", "sp_sort": 1 },
    { "sp_id": 2, "sp_name": "教材书籍", "sp_sort": 2 }
  ]
}
```

- 修改时间：2026-11-20 14:40

---

## 商品列表（分页 / 搜索 / 分类筛选）

- 接口路径：`/api/goods`
- HTTP 方法：`GET`
- 请求参数（Query）：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| sp_keyword | string | 否 | 关键词，匹配标题或描述 |
| sp_categoryId | number | 否 | 分类主键，0 或不传表示全部 |
| sp_page | number | 否 | 页码，默认 1 |
| sp_pageSize | number | 否 | 每页条数，默认 8，最大 50 |

请求示例：

```
GET http://localhost:8412/api/goods?sp_page=1&sp_pageSize=8&sp_keyword=iPad&sp_categoryId=1
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "获取商品列表成功",
  "data": {
    "sp_list": [
      {
        "sp_id": 1,
        "sp_title": "iPad 2021 第九代 64G 深空灰",
        "sp_desc": "自用平板，屏幕无划痕，电池健康 92%，配件齐全，可当面验机。",
        "sp_price": "1650.00",
        "sp_original_price": "2499.00",
        "sp_condition": "九成新",
        "sp_category_id": 1,
        "sp_user_id": 3,
        "sp_status": 1,
        "sp_view_count": 126,
        "sp_created_at": "2026-11-18T01:30:00.000Z",
        "sp_category_name": "数码电子",
        "sp_seller": "王强"
      }
    ],
    "sp_total": 12,
    "sp_page": 1,
    "sp_pageSize": 8
  }
}
```

- 修改时间：2026-11-20 14:40

---

## 商品详情

- 接口路径：`/api/goods/:sp_id`
- HTTP 方法：`GET`
- 请求参数：路径参数 `sp_id`（商品主键），每次请求浏览量 +1

请求示例：

```
GET http://localhost:8412/api/goods/1
```

- 响应格式（在列表字段基础上增加卖家联系方式）：

```json
{
  "code": 0,
  "msg": "获取商品详情成功",
  "data": {
    "sp_id": 1,
    "sp_title": "iPad 2021 第九代 64G 深空灰",
    "sp_price": "1650.00",
    "sp_status": 1,
    "sp_category_name": "数码电子",
    "sp_seller": "王强",
    "sp_seller_phone": "13800003333",
    "sp_seller_campus": "北校区",
    "sp_view_count": 127
  }
}
```

- 修改时间：2026-11-20 14:40

---

## 发布商品

- 接口路径：`/api/goods`
- HTTP 方法：`POST`
- 请求参数（JSON）：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| sp_userId | number | 是 | 发布者主键 |
| sp_title | string | 是 | 标题，2-80 个字符 |
| sp_category_id | number | 是 | 分类主键 |
| sp_condition | string | 是 | 成色（全新/九成新/八成新/七成新/有瑕疵） |
| sp_price | number | 是 | 出售价格，大于 0 |
| sp_original_price | number | 否 | 原价，默认 0 |
| sp_desc | string | 否 | 描述，最多 500 字 |

请求示例：

```json
{
  "sp_userId": 1,
  "sp_title": "测试用蓝牙耳机",
  "sp_category_id": 1,
  "sp_condition": "九成新",
  "sp_price": 88,
  "sp_original_price": 199,
  "sp_desc": "接口自动化测试数据"
}
```

- 响应格式：

```json
{ "code": 0, "msg": "发布成功", "data": { "sp_id": 13 } }
```

- 修改时间：2026-11-20 14:40

---

## 我的商品

- 接口路径：`/api/goods/mine`
- HTTP 方法：`GET`
- 请求参数（Query）：`sp_userId`（用户主键，必填）

请求示例：

```
GET http://localhost:8412/api/goods/mine?sp_userId=1
```

- 响应格式：`data` 为商品数组（含已下架、已售出商品，字段同商品列表）

```json
{
  "code": 0,
  "msg": "获取我的商品成功",
  "data": [
    { "sp_id": 3, "sp_title": "高等数学 第七版 上下册", "sp_status": 1, "sp_price": "25.00" }
  ]
}
```

- 修改时间：2026-11-20 14:40

---

## 修改商品状态

- 接口路径：`/api/goods/:sp_id/status`
- HTTP 方法：`PUT`
- 请求参数：路径参数 `sp_id`；请求体 JSON：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| sp_userId | number | 是 | 操作用户主键，仅发布者本人可操作 |
| sp_status | number | 是 | 0 已下架 / 1 在售 / 2 已售出 |

请求示例：

```json
PUT http://localhost:8412/api/goods/1/status
{ "sp_userId": 1, "sp_status": 0 }
```

- 响应格式：

```json
{ "code": 0, "msg": "状态修改成功", "data": { "sp_id": 1, "sp_status": 0 } }
```

- 修改时间：2026-11-20 14:40

---

## 删除商品

- 接口路径：`/api/goods/:sp_id`
- HTTP 方法：`DELETE`
- 请求参数：路径参数 `sp_id`；Query 参数 `sp_userId`（仅发布者本人可删除）

请求示例：

```
DELETE http://localhost:8412/api/goods/1?sp_userId=1
```

- 响应格式：

```json
{ "code": 0, "msg": "删除成功", "data": { "sp_id": 1 } }
```

- 修改时间：2026-11-20 14:40

---

## 测试数据库连接

- 接口路径：`/api/database/test`
- HTTP 方法：`POST`
- 请求参数（JSON）：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| sp_user | string | 是 | MySQL 用户名 |
| sp_password | string | 否 | MySQL 密码 |

请求示例：

```json
{ "sp_user": "root", "sp_password": "060701" }
```

- 响应格式（成功时返回版本号与可见数据库列表，单次最多 30 个）：

```json
{
  "code": 0,
  "msg": "数据库连接成功",
  "data": {
    "sp_host": "127.0.0.1",
    "sp_user": "root",
    "sp_version": "8.0.30",
    "sp_databases": ["information_schema", "mysql", "sp_campus_market", "sys"]
  }
}
```

- 响应格式（失败示例）：

```json
{
  "code": 1,
  "msg": "用户名或密码错误，请检查后重试",
  "data": { "sp_code": "ER_ACCESS_DENIED_ERROR" }
}
```

- 修改时间：2026-11-20 15:05

---

## 获取科技新闻列表

- 接口路径：`/api/news`
- HTTP 方法：`GET`
- 请求参数（Query，可选）：`sp_tag` 科技标签，如 `人工智能`

请求示例：

```
GET http://localhost:8412/api/news
GET http://localhost:8412/api/news?sp_tag=通信
```

- 响应格式：

```json
{
  "code": 0,
  "msg": "获取科技新闻成功",
  "data": {
    "sp_total": 10,
    "sp_list": [
      {
        "sp_id": 1,
        "sp_title": "国产大模型开源新版本，推理成本下降四成",
        "sp_summary": "新版本在长文本理解与代码生成任务上表现突出，官方同步开放量化部署方案。",
        "sp_source": "科技前线",
        "sp_author": "林一舟",
        "sp_tag": "人工智能",
        "sp_publish_time": "2026-11-19T01:20:00.000Z",
        "sp_view_count": 1862
      }
    ]
  }
}
```

- 修改时间：2026-11-20 15:20

---

## 获取图文列表

- 接口路径：`/api/gallery`
- HTTP 方法：`GET`
- 请求参数（Query，可选）：`sp_tag` 标签，如 `数码`

请求示例：

```
GET http://localhost:8412/api/gallery
GET http://localhost:8412/api/gallery?sp_tag=书籍
```

- 响应格式（`sp_image_url` 为相对 frontend 根目录的图片路径）：

```json
{
  "code": 0,
  "msg": "获取图文列表成功",
  "data": {
    "sp_total": 8,
    "sp_list": [
      {
        "sp_id": 1,
        "sp_title": "宿舍桌面数码套装",
        "sp_desc": "平板 + 无线键盘 + 蓝牙音箱，屏幕无划痕，键盘键位完好，毕业打包出，可当面验货。",
        "sp_image_url": "images/gallery/sp_gallery_1.jpg",
        "sp_tag": "数码",
        "sp_publish_time": "2026-11-19T02:10:00.000Z",
        "sp_view_count": 328
      }
    ]
  }
}
```

- 修改时间：2026-11-20 15:45
