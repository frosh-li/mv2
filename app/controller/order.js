'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async index() {
  	let {ctx, service} = this;
  	let pageSize = 20;
  	let {currentPage} = ctx.query;
  	currentPage = currentPage || 1;
  	console.log('pageSize', pageSize);
  	let data = await service.order.getAllOrders(ctx.session.uid, pageSize, (parseInt(currentPage)-1)*pageSize)
  	let dataSource = data.rows;

    ctx.body = {
	    list: dataSource,
	    pagination: {
	      total: data.count,
	      pageSize,
	      current: parseInt(currentPage, 10) || 1,
	    },
	  };
  }
}

module.exports = OrderController;
