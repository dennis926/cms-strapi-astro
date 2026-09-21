/**
 * Strapi API 工具函数
 */

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:1337';
const API_TOKEN = import.meta.env.PUBLIC_API_TOKEN || '';

/**
 * 获取API URL
 */
export function getApiUrl() {
  return API_URL;
}

/**
 * 构建API请求URL
 */
function buildUrl(path: string, params?: Record<string, any>) {
  const url = new URL(`/api${path}`, API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

/**
 * 通用请求函数
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * 获取站点配置
 */
export async function getSiteConfig() {
  return request<{ data: any }>(buildUrl('/site-config')).then((res) => res.data);
}

/**
 * 获取文章列表
 */
export async function getArticles(params?: { page?: number; pageSize?: number; category?: string }) {
  const populate = ['seo', 'cover', 'category', 'tags', 'author'].join(',');
  return request<{ data: any[]; meta: any }>(
    buildUrl('/articles', { populate, ...params })
  );
}

/**
 * 获取单篇文章
 */
export async function getArticle(slug: string) {
  const populate = ['seo', 'cover', 'category', 'tags', 'author', 'geoMeta'].join(',');
  const result = await request<{ data: any }>(
    buildUrl('/articles', { filters: { slug: { $eq: slug } }, populate })
  );
  return result.data?.[0];
}

/**
 * 获取产品列表
 */
export async function getProducts(params?: { page?: number; pageSize?: number; category?: string }) {
  const populate = ['seo', 'cover', 'gallery', 'category', 'tags'].join(',');
  return request<{ data: any[]; meta: any }>(
    buildUrl('/products', { populate, ...params })
  );
}

/**
 * 获取单个产品
 */
export async function getProduct(slug: string) {
  const populate = ['seo', 'cover', 'gallery', 'category', 'tags', 'features', 'geoMeta'].join(',');
  const result = await request<{ data: any }>(
    buildUrl('/products', { filters: { slug: { $eq: slug } }, populate })
  );
  return result.data?.[0];
}

/**
 * 获取单页面
 */
export async function getPage(slug: string) {
  const populate = ['seo', 'geoMeta', 'blocks'].join(',');
  const result = await request<{ data: any }>(
    buildUrl('/pages', { filters: { slug: { $eq: slug } }, populate })
  );
  return result.data?.[0];
}

/**
 * 获取分类列表
 */
export async function getCategories() {
  return request<{ data: any[] }>(buildUrl('/categories')).then((res) => res.data);
}

/**
 * 获取标签列表
 */
export async function getTags() {
  return request<{ data: any[] }>(buildUrl('/tags')).then((res) => res.data);
}

/**
 * 提交表单
 */
export async function submitForm(data: {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  message: string;
  formType?: string;
}) {
  return request<{ success: boolean; message: string; data: any }>(
    buildUrl('/form-submissions'),
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

/**
 * 格式化图片URL
 */
export function getImageUrl(image: any) {
  if (!image?.url) return '';
  if (image.url.startsWith('http')) return image.url;
  return `${API_URL}${image.url}`;
}
