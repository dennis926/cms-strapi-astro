'use strict';

/**
 * Form Submission 控制器
 */
module.exports = {
  /**
   * 创建表单提交（公开接口）
   */
  async create(ctx) {
    const { body } = ctx.request;
    const { name, phone, email, company, message, formType } = body;

    // 基础验证
    if (!name || !phone || !message) {
      return ctx.badRequest('请填写必填字段');
    }

    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return ctx.badRequest('手机号格式不正确');
    }

    // 邮箱格式验证（如果有）
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return ctx.badRequest('邮箱格式不正确');
      }
    }

    // 获取IP地址和User-Agent
    const ipAddress =
      ctx.request.headers['x-forwarded-for'] ||
      ctx.request.headers['x-real-ip'] ||
      ctx.request.ip;
    const userAgent = ctx.request.headers['user-agent'] || '';

    // 创建提交
    const submission = await strapi.db
      .query('api::form-submission.form-submission')
      .create({
        data: {
          name,
          phone,
          email: email || null,
          company: company || null,
          message,
          formType: formType || 'contact',
          ipAddress,
          userAgent,
          status: 'new',
        },
      });

    // 发送通知（可选）
    // await strapi.plugins['email'].services.email.send({...});

    ctx.status = 201;
    return {
      success: true,
      message: '提交成功，我们会尽快与您联系',
      data: {
        id: submission.id,
        status: submission.status,
      },
    };
  },

  /**
   * 查询所有提交（需要认证）
   */
  async find(ctx) {
    const { page = 1, pageSize = 20, status, formType } = ctx.query;

    const filters = {};
    if (status) filters.status = status;
    if (formType) filters.formType = formType;

    const submissions = await strapi.db
      .query('api::form-submission.form-submission')
      .findMany({
        where: filters,
        orderBy: { createdAt: 'desc' },
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });

    const total = await strapi.db
      .query('api::form-submission.form-submission')
      .count({
        where: filters,
      });

    return {
      data: submissions,
      meta: {
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          pageCount: Math.ceil(total / pageSize),
        },
      },
    };
  },

  /**
   * 查询单个提交
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const submission = await strapi.db
      .query('api::form-submission.form-submission')
      .findOne({
        where: { id },
      });

    if (!submission) {
      return ctx.notFound('提交记录不存在');
    }

    return { data: submission };
  },

  /**
   * 更新提交状态
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { status, notes } = ctx.request.body;

    const submission = await strapi.db
      .query('api::form-submission.form-submission')
      .update({
        where: { id },
        data: { status, notes },
      });

    return { data: submission };
  },

  /**
   * 删除提交
   */
  async delete(ctx) {
    const { id } = ctx.params;
    await strapi.db.query('api::form-submission.form-submission').delete({
      where: { id },
    });

    return { success: true };
  },
};
