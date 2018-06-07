'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1528034492295_159';
  config.session = {
	  key: 'EGG_SESS',
	  maxAge: 24 * 3600 * 1000, // 1 天
	  httpOnly: true,
	  encrypt: true,
  };

  config.security = {
    csrf: {
      ignoreJSON:true
    }
  };

  // add your config here
  config.middleware = [];

  return config;
};
