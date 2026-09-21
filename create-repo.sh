#!/bin/bash
# 创建GitHub仓库

REPO_NAME="cms-strapi-astro"
DESCRIPTION="SEO+GEO双引擎CMS系统 - Strapi 5 + Astro"
TOKEN=$(grep 'machine github.com' -A2 ~/.netrc | grep password | awk '{print $2}')

echo "正在创建仓库: $REPO_NAME..."

curl -s -X POST https://api.github.com/user/repos \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $TOKEN" \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"$DESCRIPTION\",\"private\":false,\"has_issues\":true,\"has_projects\":true}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('✅ 仓库创建成功:', d.get('html_url', d.get('message', '未知')))" 2>/dev/null || echo "仓库创建完成"
