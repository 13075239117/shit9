import json
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# 创建 FastAPI 应用实例
app = FastAPI()
# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境需要指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 定义仓库项的 Pydantic 数据模型
class Repository(BaseModel):
    id: int
    name: str
    description: str
    path: str
    type: str
    download_link: str


class RepositoryResponse(BaseModel):
    id: int
    name: str
    type: str
    path: str
    children: List[Repository]


# 搜索 GitHub 仓库函数
def search_github_repositories(keyword: str, max_results=200):
    results = []
    page = 1

    while len(results) < max_results:
        url = f"https://api.github.com/search/repositories?q={keyword}&per_page=100&page={page}"
        response = requests.get(url)

        if response.status_code == 200:
            items = response.json().get("items", [])
            if not items:  # 如果没有更多结果，则停止分页
                break
            results.extend(items)
            page += 1
        else:
            print("Error:", response.status_code)
            break

    return results[:max_results]  # 限制返回最大结果数


# 格式化 GitHub 仓库数据
def format_repositories(repositories):
    # 返回 RepositoryResponse 对象，符合 Pydantic 模型
    return [
        Repository(
            id=repo["id"],
            type="File",
            name=repo.get("description", "无描述") or "无描述",
            description=repo.get("description", "无描述") or "无描述",
            path=repo["html_url"],
            download_link=f"https://api.github.com/repos/{repo['owner']['login']}/{repo['name']}/zipball/{repo['default_branch']}",
        )
        for repo in repositories
    ]


# FastAPI 搜索接口
@app.get("/search_repositories", response_model=List[Repository])
async def search_repositories(keyword: str):
    # 使用关键字搜索仓库
    repositories = search_github_repositories(keyword)
    with open("test.json", "w", encoding="utf-8") as f:
        json.dump(repositories, f, ensure_ascii=False, indent=4)
    if repositories:
        # 格式化数据并返回
        formatted_data = format_repositories(repositories)
        return formatted_data  # 返回一个包含单个 RepositoryResponse 的数组
    else:
        return []


# 启动应用的命令
# uvicorn app_name:app --reload
#if __name__ == "__main__":
#    uvicorn.run("backend:app", host="127.0.0.1", port=8889, reload=True)
