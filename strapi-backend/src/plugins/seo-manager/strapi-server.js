'use strict';

const { getAbsoluteServerUrl } = require('@strapi/utils');

/**
 * SEO Manager 插件
 * 自动生成Schema.org JSON-LD结构化数据
 */
module.exports = {
  register({ strapi }) {
    console.log('✅ SEO Manager 插件已注册');
  },

  bootstrap({ strapi }) {
    // 注册生命周期钩子，在内容创建/更新时自动生成JSON-LD
    strapi.db.lifecycle.subscribe({
      models: ['api::article.article', 'api::product.product', 'api::page.page'],
      async afterFindOne(event) {
        const { result } = event;
        if (!result) return;

        // 根据内容类型生成对应的JSON-LD
        const modelUid = event.model.uid;
        const jsonld = generateJSONLD(modelUid, result, strapi);
        if (jsonld) {
          result.jsonld = jsonld;
        }
      },
    });
  },
};

/**
 * 根据内容类型生成JSON-LD
 */
function generateJSONLD(modelUid, data, strapi) {
  const baseUrl = process.env.PUBLIC_SITE_URL || 'http://localhost:3000';
  const seo = data.seo || {};

  switch (modelUid) {
    case 'api::article.article':
      return generateArticleJSONLD(data, seo, baseUrl);
    case 'api::product.product':
      return generateProductJSONLD(data, seo, baseUrl);
    case 'api::page.page':
      return generatePageJSONLD(data, seo, baseUrl);
    default:
      return null;
  }
}

/**
 * 生成Article JSON-LD
 */
function generateArticleJSONLD(data, seo, baseUrl) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: seo.seoDescription || data.excerpt || '',
    url: `${baseUrl}/articles/${data.slug}`,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    author: {
      '@type': 'Person',
      name: data.author?.name || '卿尔美',
    },
    publisher: {
      '@type': 'Organization',
      name: '卿尔美',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  if (data.cover?.url) {
    jsonld.image = data.cover.url;
  }

  // 添加FAQ
  if (data.geoMeta?.geoFaq) {
    jsonld.mainEntity = {
      '@type': 'FAQPage',
      mainEntity: data.geoMeta.geoFaq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }

  return jsonld;
}

/**
 * 生成Product JSON-LD
 */
function generateProductJSONLD(data, seo, baseUrl) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: seo.seoDescription || data.description?.substring(0, 200) || '',
    url: `${baseUrl}/products/${data.slug}`,
    brand: {
      '@type': 'Brand',
      name: '卿尔美',
    },
  };

  if (data.cover?.url) {
    jsonld.image = data.cover.url;
  }

  if (data.gallery?.length) {
    jsonld.image = data.gallery.map((img) => img.url);
  }

  return jsonld;
}

/**
 * 生成Page JSON-LD
 */
function generatePageJSONLD(data, seo, baseUrl) {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.title,
    description: seo.seoDescription || '',
    url: `${baseUrl}/${data.slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: '卿尔美',
      url: baseUrl,
    },
  };

  // 如果是关于我们页面
  if (data.template === 'about') {
    jsonld['@type'] = 'AboutPage';
    jsonld.mainEntity = {
      '@type': 'Organization',
      name: '卿尔美',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    };
  }

  // 如果是联系我们页面
  if (data.template === 'contact') {
    jsonld['@type'] = 'ContactPage';
  }

  return jsonld;
}
