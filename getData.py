import requests
import json


def search_github_repositories(keyword):
    url = f"https://api.github.com/search/repositories?q={keyword}&per_page=200"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()["items"]
    else:
        print("Error:", response.status_code)
        return []


def save_to_json(data, filename="repositories.json"):
    # 检查文件是否存在并且不为空
    try:
        with open(filename, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        existing_data = {
            "id": 1,
            "name": "2024最新毕设项目集合",
            "type": "Folder",
            "path": "",
            "children": [],
        }

    # 如果文件存在并且有内容，则将新数据添加到旧数据后面
    if isinstance(existing_data, dict) and "children" in existing_data:
        existing_data["children"].extend(data["children"])
    else:
        existing_data = data

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)
    print(f"数据已保存到 {filename}")


def format_repositories(repositories):
    formatted_data = {
        "id": 1,
        "name": "2024最新毕设项目集合",
        "type": "Folder",
        "path": "",
        "children": [
            {
                "id": repo["id"],
                "name": repo.get("description", "无描述"),
                "type": "File",
                "path": repo["html_url"],
                "download_link": f"https://api.github.com/repos/{repo['owner']['login']}/{repo['name']}/zipball/{repo['default_branch']}",  # 拼接下载链接
                "children": [],
            }
            for repo in repositories
        ],
    }
    return formatted_data


def main():
    keyword = input("请输入要搜索的关键字: ")
    repositories = search_github_repositories(keyword)

    if repositories:
        # 格式化数据
        formatted_data = format_repositories(repositories)

        # 输出项目信息
        for child in formatted_data["children"]:
            print(f"名称: {child['name']}")
            print(f"链接: {child['path']}")
            print(f"描述: {child['name']}")
            print("-" * 40)

        # 保存到 JSON 文件
        save_to_json(formatted_data)


if __name__ == "__main__":
    main()
