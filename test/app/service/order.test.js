'use strict';

const { app, assert } = require('egg-mock/bootstrap');
// const testUserId = 1635;
const testUserId = 1635;
describe('orders', () => {

  it('should get orders', async () => {
    const ctx = app.mockContext();
    const list = await ctx.service.order.getAllOrders();

    list.rows.forEach(item => {
      console.log(JSON.stringify(item, null, 4));
    });
    assert(list);
  });

  // it('should get userBaseInfo', async() => {
  //     const ctx = app.mockContext();
  //     const ret = await ctx.service.user.userBaseInfo(testUserId); // 戴维
  //     console.log(JSON.stringify(ret, null, 4));
  //     assert(ret);
  // });

  // it('should get userCardList', async() => {
  //     const ctx = app.mockContext();
  //     const ret = await ctx.service.user.userCardList(testUserId); // 戴维
  //     ret.rows.forEach(item => {
  //       console.log(JSON.stringify(item, null, 4));
  //     })
  //     assert(ret);
  // });

  // it('should get rechargeTotals', async() => {
  //     const ctx = app.mockContext();
  //     const ret = await ctx.service.user.rechargeTotals(testUserId); // 戴维
  //     console.log('累计充值', ret);
  //     assert(typeof ret === 'number');
  // });

  // it('should get withoutTotals', async() => {
  //     const ctx = app.mockContext();
  //     const ret = await ctx.service.user.withoutTotals(testUserId); // 戴维
  //     console.log('累计提现', ret);
  //     // console.log(JSON.stringify(ret, null, 4));
  //     assert(typeof ret === 'number');
  // });

  // it('should get accountFlow', async() => {
  //     const ctx = app.mockContext();
  //     const ret = await ctx.service.user.accountFlow(testUserId); // 戴维
  //     ret.rows.forEach(item => {
  //       console.log(JSON.stringify(item, null, 4));
  //     })
  //     // console.log(JSON.stringify(ret, null, 4));
  //     assert(ret);
  // });

  // it('should get borrowInfo', async() => {
  //     const ctx = app.mockContext();
  //     const ret = await ctx.service.user.borrowInfo(testUserId); // 戴维
  //     console.log(JSON.stringify(ret, null, 4));
  //     assert(ret)
  // });

  // it('should get lenderInfo', async() => {
  //     const ctx = app.mockContext();
  //     const ret = await ctx.service.user.lenderInfo(testUserId); // 戴维
  //     console.log(JSON.stringify(ret, null, 4));
  //     assert(ret)
  // });


});
