'use strict';

/**
 * Sitemap Generator 插件
 * 自动生成XML Sitemap
 */
module.exports = {
  register({ strapi }) {
    console.log('✅ Sitemap Generator 插件已注册');

    // 注册自定义路由
    strapi.router.get('/sitemap.xml', async (ctx) => {
      try {
        const sitemap = await generateSitemap(strapi);
        ctx.type = 'application/xml';
        ctx.body = sitemap;
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Sitemap generation failed' };
      }
    });
  },
};

/**
 * 生成Sitemap XML
 */
async function generateSitemap(strapi) {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/articles</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/franchise</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

  // 获取所有已发布的文章
  const articles = await strapi.db.query('api::article.article').findMany({
    where: { publishedAt: { $lte: new Date() } },
    select: ['slug', 'updatedAt'],
  });

  articles.forEach((article) => {
    xml += `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // 获取所有已发布的产品
  const products = await strapi.db.query('api::product.product').findMany({
    where: { publishedAt: { $lte: new Date() } },
    select: ['slug', 'updatedAt'],
  });

  products.forEach((product) => {
    xml += `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += '\n</urlset>';
  return xml;
}
