// config/config.${env}.js
exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: '127.0.0.1',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: '123456',
    // 数据库名
    database: 'cmaotai',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: true,
};


exports.sequelize = {
  dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
  database: 'cmaotai',
  host: 'localhost',
  port: '3306',
  username: 'root',
  password: '123456',
};

exports.watcher: {
    type: 'development',
};