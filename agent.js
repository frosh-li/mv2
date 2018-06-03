const fs = require('fs');
// agent.js
module.exports = agent => {
  // 在这里写你的初始化逻辑

  let counts = 0;
  let accounts = [];
  let originCounts = -1;
  // 也可以通过 messenger 对象发送消息给 App Worker
  // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失
  agent.messenger.on('egg-ready', () => {
    // agent.messenger.sendTo('','STARTTOWORK', data);
    accounts = JSON.parse(fs.readFileSync('./beijing.json').toString('utf-8'));
    originCounts = accounts.length;
    agent.messenger.on('STARTTOWORK', (pid) => {
        let account = accounts.shift();
        if(account){
          agent.messenger.sendTo(pid,'grab-order', account);
        }
    })

    agent.messenger.on("DONE", (pid) => {
        counts++;
        console.log('待处理个数为', originCounts-counts);
        if(counts === originCounts){
            console.log('all done');
            accounts = fs.readFileSync('./beijing.json');
            originCounts = accounts.length;
            return;
        }

        let account = accounts.shift();
        if(account){
          agent.messenger.sendTo(pid,'grab-order', account);
        }

    })

  });
};
