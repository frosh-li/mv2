const fs = require('fs');

process.env.TZ = 'Asia/Shanghai';
// agent.js
module.exports = agent => {
  // 在这里写你的初始化逻辑


  // 也可以通过 messenger 对象发送消息给 App Worker
  // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失
  agent.messenger.on('egg-ready', async () => {
    let counts = 0;

    let originCounts = -1;

    let accounts = await agent.model.Account.findAll({
      where: {
        status: 1,
      },
    });

    originCounts = accounts.length;

    agent.messenger.sendToApp('agentReady', false);

    agent.messenger.on('STARTTOWORK', pid => {
      const account = accounts.shift();
      if (account) {
        agent.messenger.sendTo(pid, 'grab-order', account);
      }
    });

    agent.messenger.on('DONE', pid => {
      counts++;
      agent.logger.info('待处理个数为', originCounts - counts);
      if (counts >= originCounts) {
        agent.logger.info('操作全部结束，一分钟后继续');
        setTimeout(() => {
          agent.model.Account.findAndCountAll({
            where: {
              status: 1,
            },
          }).then(accountsQuery => {
            accounts.length = 0;
            accounts = accountsQuery.rows;
            counts = 0;
            originCounts = accountsQuery.count;
            agent.logger.info('counts', counts, 'originCounts', originCounts);
            agent.messenger.sendToApp('agentReady', true);
          });

        }, 30000);
      } else {
        const account = accounts.shift();
        if (account) {
          agent.messenger.sendTo(pid, 'grab-order', account);
        }
      }
    });

  });
};
