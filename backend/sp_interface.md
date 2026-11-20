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
