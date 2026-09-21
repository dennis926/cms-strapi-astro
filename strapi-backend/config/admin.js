module.exports = ({ env }) => ({
  // 管理员权限配置
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'your-admin-jwt-secret'),
    },
    // 启用API token
    apiToken: {
      salt: env('API_TOKEN_SALT', 'your-api-token-salt'),
    },
  },
});
