const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:1337';

export function getApiUrl(): string {
  return API_URL;
}

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function getArticles() {
  return safeFetch<any[]>(`${API_URL}/api/articles`) || { data: [], meta: { pagination: { total: 0 } } };
}

export async function getArticle(slug: string) {
  const result = await safeFetch<any[]>(`${API_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`);
  return result?.data?.[0] || null;
}

export async function getProducts() {
  return safeFetch<any[]>(`${API_URL}/api/products`) || { data: [], meta: { pagination: { total: 0 } } };
}

export async function getProduct(slug: string) {
  const result = await safeFetch<any[]>(`${API_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`);
  return result?.data?.[0] || null;
}

export async function getPage(slug: string) {
  return safeFetch<any>(`${API_URL}/api/${slug}`) || null;
}

export async function submitForm(data: any) {
  try {
    const response = await fetch(`${API_URL}/api/form-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    return { success: false, message: '提交失败' };
  }
}
