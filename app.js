// {app_root}/app.js
  module.exports = app => {
    // if (app.config.env === 'local') {
    //   app.beforeStart(function* () {
    //     yield app.model.sync({force: true});
    //     console.log("beforeStart");
    //   });
    // }
    app.messenger.on('egg-ready', () => {
        app.messenger.sendToAgent("STARTTOWORK", process.pid);
        app.messenger.on("grab-order", data => {
            // 开始处理账号
            console.log('开始处理', data);
            setTimeout(() => {
                console.log('账号', data, '处理完成');
                app.messenger.sendToAgent("DONE", process.pid);
            }, 200);
        })
    })

  };
