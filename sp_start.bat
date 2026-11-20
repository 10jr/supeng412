@echo off
rem 姓名：苏鹏 | 学号：24002120412
rem 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
rem 功能：一键启动后端服务（Node.js + Express，端口 8412）
chcp 65001 >nul
setlocal
cd /d "%~dp0backend"

set "SP_NODE="
where node >nul 2>nul
if not errorlevel 1 set "SP_NODE=node"
if not defined SP_NODE if exist "%USERPROFILE%\.local\node\node-v20.18.1-win-x64\node.exe" set "SP_NODE=%USERPROFILE%\.local\node\node-v20.18.1-win-x64\node.exe"

if not defined SP_NODE (
  echo [错误] 未检测到 Node.js，请先安装 Node.js 或将其加入 PATH。
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [提示] 尚未安装依赖，正在安装...
  call npm install
)

echo ============================================
echo  校园二手交易平台 - 后端服务
echo  访问地址：http://localhost:8412
echo  接口前缀：http://localhost:8412/api
echo  关闭本窗口即可停止服务
echo ============================================
echo.

"%SP_NODE%" app.js
echo.
echo [提示] 服务已停止（退出码：%errorlevel%）
pause
