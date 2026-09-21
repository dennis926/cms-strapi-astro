'use strict';

module.exports = {
  register({ strapi }) {
    // 启动时的初始化逻辑
    console.log('Strapi CMS 启动成功');
  },
  bootstrap({ strapi }) {
    // 初始化内容类型权限等
  },
  destroy({ strapi }) {
    // 销毁时的清理逻辑
  },
};
