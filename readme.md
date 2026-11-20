# 校园二手交易平台

> 姓名：苏鹏
> 学号：24002120412
> 项目类别：自选
> 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash

## 项目简介

面向校内学生的二手物品交易平台，前端使用原生 HTML / CSS / JavaScript，后端使用 Node.js + Express（RESTful + MVC），数据库使用 MySQL，所有接口以 `/api/` 为前缀，服务端口固定为 `8412`。

## 目录结构

```
supengpro/
├─ frontend/            # 前端静态资源（原生 HTML / CSS / JS）
│  ├─ css/
│  ├─ js/
│  ├─ fonts/            # iconfont 图标文件（如果有）
│  ├─ images/
│  └─ index.html        # 首页（项目信息 + 页面导航）
├─ backend/             # 后端服务（Node.js + Express）
│  ├─ config/           # 数据库连接池配置
│  ├─ controllers/      # 控制器
│  ├─ models/           # 数据模型
│  ├─ routes/           # 路由
│  ├─ .env              # 数据库凭据（不纳入版本控制）
│  ├─ app.js            # 服务入口
│  ├─ sp_interface.md   # 接口记录文档
│  └─ sp_database.md    # 数据库记录文档
├─ AGENTS.md            # 项目开发规则
└─ supeng_prompt.md     # 提示词记录
```

## 运行方式

1. 安装依赖（已在 `backend/package.json` 中声明）：

   ```bash
   cd backend
   npm config set registry https://registry.npmmirror.com
   npm i
   ```

2. 在 `backend/.env` 中配置数据库连接：

   ```
   DB_USER=root
   DB_PASSWORD=root
   DB_HOST=127.0.0.1
   DB_NAME=sp_campus_market
   ```

3. 启动服务：

   ```bash
   cd backend
   npm start
   ```

4. 浏览器访问 `http://localhost:8412/`，接口统一以 `http://localhost:8412/api/` 为前缀。

## 开发约定

详见 [AGENTS.md](./AGENTS.md)：CSS 类名 / JS 变量与函数名 / 数据库表与字段均以 `sp_` 开头；接口统一返回 `{ code, msg, data }`。
