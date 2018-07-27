'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/maotai/api/currentUser', controller.user.currentUser);
  router.post('/api/login/account', controller.user.login);
  router.get('/api/rule', controller.account.index);
  router.post('/api/rule', controller.account.addAccount);
  router.get('/api/order', controller.order.index);
};
