---
**时间**: 2026-11-20 00:00
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 在当前项目根目录创建 AGENTS.md，写入以下规则。
>
> ## 项目结构与技术栈
> - 前端：frontend/ 目录
>   - 原生 HTML、CSS、JavaScript，禁止使用任何第三方库、框架、CDN 链接
>   - 目录结构：frontend/ 下建 css/、js/、fonts/、images/ 子目录；
>     fonts/ 存放 iconfont 图标文件（如果有）
> - 后端：backend/ 目录，Node.js + Express，RESTful+MVC 风格，
>   所有接口以 /api/ 为前缀，端口固定为 8412。
> - 使用 express.static 托管 frontend/ 静态资源目录。
> - 后端通过 cors 中间件开放全部跨域访问，本配置仅用于课程作业。
> - 后端依赖安装：预先将 npm 源切换为国内镜像：
>   npm config set registry https://registry.npmmirror.com
> - 后端依赖安装： npm i 包名
> - 数据库：MySQL（用户名 root、密码：root）
> - 数据库凭据写入 backend/.env（变量名：DB_USER、DB_PASSWORD、DB_HOST、DB_NAME），
>   不得出现在代码或 AGENTS.md 中；.env 同时加入 .gitignore
> - 根据后端的要求自行建立和修改数据库表，每张表建立后，插入至少 8 条有真实业务意义的测试数据
>
> ## 命名与注释
> - CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）一律以 sp_ 开头
> - 每个文件头部包含注释块：
>   姓名：苏鹏 | 学号：24002120412
>   时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}
>
> ## 记录文件（一律追加写入，禁止覆盖已有内容）
> - supeng_prompt.md（项目根目录）：每次向 AI 发出开发指令后，追加记录：时间 | 提示词全文 | 大模型名称
> - backend/sp_interface.md：每次创建或修改接口后，追加：接口路径 | HTTP 方法 | 请求参数（含示例）| 响应格式（含 JSON 示例）| 修改时间
> - backend/sp_database.md：每次建表、改表或插入数据后，按执行顺序追加对应 SQL 语句（含测试数据的 INSERT），要求仅凭此文件即可在新机器上完整重建数据库
> - 统一 JSON 响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }，code=0 表示成功，非 0 表示失败
>
> ## 前端约定
> - 服务器返回的数据和错误信息输出到浏览器控制台（console.log / console.error）；
> - 新建 HTML 页面后，在 frontend/index.html 中追加超链接入口；文件名包含 detail 的页面除外
---

---
**时间**: 2026-11-20 14:21
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 请初始化本项目：
> 1、git init + .gitignore（排除 node_modules、.env）+ 首次提交
> 2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、
> 3、创建前端首页 index.html，包括姓名苏鹏、学号24002120412、项目名称、项目类别（自选、模仿），所有完成的 html 页面的超链接。有 canvas 背景动画。主体是页面链接导航。页面美观。
> 4、创建 readme.md，在根目录下，包括学号、姓名。
---

---
**时间**: 2026-11-20 14:38
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 好的，按这个方案来
>
> （补充确认：项目名称「校园二手交易平台」；继续开发功能模块；本机 MySQL80 的 root 密码为 060701，且密码处于过期状态，已按 AGENTS.md 重置为 root）
---

---
**时间**: 2026-11-20 14:51
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 创建运行后台的bat文件，在根目录下。
---

---
**时间**: 2026-11-20 15:05
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 创建 database.html 页面，输入用户名，密码，链接数据库，数据库使用 mysql，成功和错误都有提示，默认用户名 root，密码 060701。
---

---
**时间**: 2026-11-20 15:20
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 完成科技新闻列表页面，新闻的数据存在数据库表里。网页显示后端接口链接和数据内容。
---

---
**时间**: 2026-11-20 15:45
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 完成图文列表，图片可以使用网络图片或创建图片，创建一个新的表，网页显示后端接口链接和数据内容。
---

---
**时间**: 2026-11-20 16:10
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 你看红框的位置这是需要的他的是8400，我是8412还有为啥我的图文列表里没图片
---

---
**时间**: 2026-11-25 09:30
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> # 硅基流动 API Key
> SILICONFLOW_API_KEY=你的key
> # API 接入地址（固定）
> SILICONFLOW_BASE_URL=" https://api.siliconflow.cn/v1 "
> SILICONFLOW_MODEL="Qwen/Qwen2.5-7B-Instruct"
> SILICONFLOW_VISION_MODEL="Qwen/Qwen3-VL-8B-Instruct"
> # AI 默认服务商：siliconflow / qiniu
> AI_PROVIDER=siliconflow
> # 七牛在线客服 API 配置（QINIU_ 前缀，明确区分其他服务）
> QINIU_CUSTOMER_SERVICE_BASE_URL=" https://api.qnaigc.com/v1 "
> QINIU_CUSTOMER_SERVICE_MODEL="qiniu/conatus-free"
> QINIU_CUSTOMER_SERVICE_API_KEY=sk-****（已脱敏）放到env里
---

---
**时间**: 2026-11-25 09:40
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 好的，创建 AI 接口
---

---
**时间**: 2026-11-25 10:05
**模型**: DeepSeek-V4.1-Flash
**提示词内容**:
> 使用硅基流动 完成在线客服页面：
---





