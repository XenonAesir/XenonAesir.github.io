
面向编辑与内容团队的技术内容研究工作台：科技榜单入库、深度文章分析、今日选题、行业情报、事件追踪与盲测评测。
主题覆盖 AI 工程、基础设施、数据、开发工具、前端与安全。
前后端完整保留原产品的页面结构与交互，演示环境用 SQLite 和本地合成数据一键启动。

> **作品集演示版。** 所有内容、作者、榜单、日报、周报、评测卡和正文文件都由
> `backend/app/portfolio_seed.py` 生成，**不包含任何真实内容正文、真实企业、客户或个人信息**。
> 页面、品牌与数据源名称已脱敏；正文文件开头带有“虚构演示内容”标识。

## 界面

![登录](/projects/tech-content-workbench/login.png)

| 今日选题 | 盲测评测 |
| --- | --- |
| ![今日选题](/projects/tech-content-workbench/home.png) | ![盲测评测](/projects/tech-content-workbench/review.png) |

| 深度榜单 | 内容详情 |
| --- | --- |
| ![深度榜单](/projects/tech-content-workbench/rankings.png) | ![内容详情](/projects/tech-content-workbench/work-detail.png) |

| 精选专题 | 运行概览 |
| --- | --- |
| ![精选专题](/projects/tech-content-workbench/booklist.png) | ![运行概览](/projects/tech-content-workbench/admin-ops.png) |

## 功能

- **榜单与研究库**：技术深度榜单、内容搜索、内容详情、榜单历史、精选专题与用户导入。
- **分析链路**：榜单导入 → 下载任务 → 六维分析 → 分析记录；Mock 分析无需模型。
- **内容运营**：今日主题/行业、事件追踪、选题周报、行业情报与资讯订阅。
- **盲测评测**：逐张展示卡片、喜欢/不喜欢、每日配额、键盘快捷键、AI 自评雷达图。
- **任务与后台**：worker 队列、定时任务、模型与用量、审计日志、用户、界面显示设置。

## 技术栈

- **后端**：Flask 3 + SQLAlchemy 2 + Flask-Migrate，按领域拆分的蓝图与服务层。
- **前端**：Vue 3 + Vite + Pinia + Tailwind，页面 → `api/*.js` → `api/http.js` 分层。
- **数据**：默认 SQLite；设置 `DATABASE_URL` 可切到 MySQL。
- **异步**：单 worker 轮询任务队列，租约 + 重试；演示数据下定时任务默认关闭。


### 一些工程取舍

- **统一响应信封**：`{data, meta}` / `{error: {code, message, details}, meta}`，带 request id 与 trace id。
- **演示适配器**：下载器使用 `mock`，分析使用 `mock-v1`；`DEMO_MODE=true` 时行业情报与事件聚类返回本地合成数据，
  不访问任何外部服务。真实适配器仍保留在 `app/adapters/`。
- **演示鉴权**：保留原项目的用户名/密码 + 角色模型，种子账号使用固定演示密码；所有写操作仍需 CSRF token。
- **演示建表**：`AUTO_CREATE_DB=true` 时使用 `db.create_all()` 启动；`migrations/` 保留给真实部署路径。
- **审计与状态**：状态枚举集中在 `app/enums.py`，审计事件与业务写入在同一事务。

## 快速开始

要求 Python 3.12+、Node 22+。

```bash
# 1. 后端
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -e ".[dev]"
flask --app app.app seed-portfolio --reset
flask --app app.app run --port 5000

# 2. 前端（另一个终端）
cd web
npm ci
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173)。演示账号（也可点“先以访客身份浏览”）：

| 账号 | 密码 | 角色 |
| --- | --- | --- |
| `writer` | `Demo@123456` | 编辑 |
| `supervisor` | `Demo@123456` | 主编 |
| `admin` | `Demo@123456` | 管理员 |
| `guest` | `Demo@123456` | 访客 |

前端 Vite 默认把 `/api` 代理到 `http://localhost:5000`，可用 `VITE_API_TARGET` 覆盖。

## Docker

```bash
docker compose up --build
```

- Web：[http://localhost:8080](http://localhost:8080)
- API：[http://localhost:5000/healthz](http://localhost:5000/healthz)

API 容器首次启动会执行 `flask --app app.app seed-portfolio`，数据落在 `workbench-data` 卷里。

## 演示数据

```bash
cd backend
flask --app app.app seed-portfolio --reset
```

会生成 3 个虚构科技榜单来源、24 篇技术内容、48 条榜单记录、下载/分析任务、精选专题、内容模板库、
两天的科技日报与周报、盲测评测批次、审计日志和模型调用记录。数据生成位置：

- `app/portfolio_seed.py`：所有标题、作者、分数、文案与评测卡；
- `backend/instance/files/`：导入记录与模板库产物；
- `backend/instance/downloads/`：**合成占位正文**，开头明确标注“不包含真实内容正文”。

`DEMO_MODE=true` 时行业情报、资讯和事件聚类返回本地合成样本，不需要任何外部 API Key。

## 测试

```bash
cd backend
pytest tests/unit -q          # 428 个 hermetic 单元测试
ruff check .
ruff format --check .

cd ../web
npm test                      # 38 个前端单测
npm run build
```

CI 配置在 `.github/workflows/ci.yml`。

## 脱敏说明

本项目为个人作品集，所有数据均为模拟数据。

## 已知限制

- 演示鉴权不含注册/找回密码的真实邮件链路，管理员与角色为固定种子账号。
- 定时任务在演示数据中默认关闭，避免访问外部服务；需要时可在“自动化与数据源”中手动开启。
- 外部情报源、下载器和模型网关在演示模式下走本地 Mock，生产接入方式保留在适配器层。
- 单 worker、SQLite 默认配置只面向演示环境。

## License

未授予开源许可证。本仓库仅作为个人作品集展示，未经作者许可不得复用。
