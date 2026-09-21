'use strict';

module.exports = {
  register({ strapi }) {
    // 注册SEO管理插件的Admin面板入口
    strapi.admin.injectionZones.push({
      // 在内容编辑页面注入SEO面板
      plugin: 'seo-manager',
      area: 'right-panel',
      component: () => null, // 暂时使用默认面板
    });
  },
};
