'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  async index() {
  	let {ctx, service} = this;
  	let pageSize = 20;
  	let {currentPage, phone, status} = ctx.query;
  	currentPage = currentPage || 1;
  	console.log('pageSize', pageSize);
  	let data = await service.account.getAccountsByUser(ctx.session.uid, pageSize, (parseInt(currentPage)-1)*pageSize, phone, status);
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

  async addAccount() {
    let {ctx, service} = this;
    
    let {phone, password} = ctx.request.body;
    if(!/^[0-9]{11}$/.test(phone)){
      ctx.body = {
        status: 'error',
        msg: '手机号格式错误'
      }
      return;
    }

    if(!password || password.length < 6){
      ctx.body = {
        status: 'error',
        msg: '密码格式错误'
      }
      return; 
    }

    let data = await service.account.insertAccount(ctx.session.uid, phone,password);
    
    ctx.body = {
      status: 'ok',
      msg: 'ok',
      data: data
    };
  }
}

module.exports = AccountController;
