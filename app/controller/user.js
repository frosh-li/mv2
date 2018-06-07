'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    // this.ctx.body = 'hi, egg';
    let {userName, password, type} = this.ctx.request.body;
    let res = await this.service.account.Login(userName, password);
    this.app.logger.info('登录', res);
    if(res){
    	this.ctx.session = {
    		phone: userName,
    		uid:res.dataValues.id 
    	}
    	this.ctx.body = {
        status: 'ok',
        type,
        currentAuthority: 'admin',
      }
    }else{
    	this.ctx.body = {
    		status: 'error',
	      type,
	      currentAuthority: 'guest',
    	}
    }
  }

  async currentUser() {
  	this.ctx.body = {
  		uid: this.ctx.session.uid,
  		name: this.ctx.session.phone,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12
    }
  }


}

module.exports = UserController;
