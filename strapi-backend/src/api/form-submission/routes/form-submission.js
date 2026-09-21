'use strict';

/**
 * Form Submission 自定义路由
 */
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/form-submissions',
      handler: 'form-submission.create',
      config: {
        auth: false, // 公开提交
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/form-submissions',
      handler: 'form-submission.find',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/form-submissions/:id',
      handler: 'form-submission.findOne',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/form-submissions/:id',
      handler: 'form-submission.update',
      config: {
        auth: true,
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/form-submissions/:id',
      handler: 'form-submission.delete',
      config: {
        auth: true,
        policies: [],
      },
    },
  ],
};
