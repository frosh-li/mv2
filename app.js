// {app_root}/app.js
process.env.TZ = 'Asia/Shanghai';
module.exports = app => {
  // if (app.config.env === 'local') {
  //   app.beforeStart(function* () {
  //     yield app.model.sync({force: true});
  //     console.log("beforeStart");
  //   });
  // }
  // console.log(app.model);
  // app.messenger.sendToAgent('STARTTOWORK', process.pid);
  app.messenger.on('agentReady', notFirst => {
    app.messenger.sendToAgent('STARTTOWORK', process.pid);
    if (notFirst) {
      return;
    }
    app.messenger.on('grab-order', async data => {
      // 如果时间不对，不进行任何操作，直接结束
      const ctimer = new Date();
      const chour = ctimer.getHours();
      console.log('当前时间', ctimer);
      if (chour > 18 || chour < 9) {
        app.logger.info('当前时间不适合处理', chour, data);
        app.messenger.sendToAgent('DONE', process.pid);
        return;
      }
      // 开始处理账号
      console.log('开始处理', data);
      try {
        const updated = new Date(data.updated_at);
        const now = new Date();
        // if (now - updated <= 1000 * 60 * 10) { // 10分钟内获取不再获取
        //   app.logger.info('处理成功', data);
        //   app.messenger.sendToAgent('DONE', process.pid);
        //   return;
        // }

        const ctx = app.createAnonymousContext();
        const res = await ctx.service.grab.login(data);
        await ctx.service.grab.sleep(100);
        const grabList = await ctx.service.grab.grabStatus(data);
        await ctx.service.grab.sleep(100);
        app.logger.info('处理成功', data);
        app.messenger.sendToAgent('DONE', process.pid);


      } catch (e) {
        app.logger.info('处理失败', data, e.message);
        app.messenger.sendToAgent('DONE', process.pid);
      }
    });
  });

};
