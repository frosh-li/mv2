/**
 * 登记下单服务
 * @type {[type]}
 */
const Service = require('egg').Service;
const request = require('request-promise-native');
const crypto = require('crypto');

class GrabService extends Service {
  async login(tel, pass, userAgent) {
    userAgent = userAgent || this.userAgent(tel);
    const now = +new Date();
    const options = {
      method: 'POST',
      url: 'https://www.cmaotai.com/API/Servers.ashx',
      headers: this.headers(userAgent),
      form: {
        action: 'UserManager.login',
        tel,
        pwd: pass,
        timestamp121: now,
      },
      json: true,
      jar: true,
      timeout: 5000,
    };
    const res = await request(options);
    console.log(res);
    if (res.state === true && res.code === 0) {
        		return res;
    } else if (res.state === true && res.msg === '密码错误') {
        	// 更新数据为密码错误
        	await this.ctx.model.Account.update({
        			status: 3,
        	}, {
        where: {
          phone: tel,
        },
      });
      throw new Error(`${tel}:${pass}:账号密码错误`);
    } else {
        	throw new Error(`${tel}:${pass}:未知错误:${res.msg}`);
    }

  }

  async GrabLogin(account) {
    const now = +new Date();
    const userAgent = this.userAgent(account.phone);
    const options = {
      method: 'POST',
      jar: true,
      url: 'https://www.cmaotai.com/API/Servers.ashx',
      headers: {
        'cache-control': 'no-cache',
        'accept-language': 'zh-CN,en-US;q=0.8',
        accept: 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Connection: 'keep-alive',
        referer: 'https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleProductDetails.html?pid=391',
        'user-agent': userAgent,
        'x-requested-with': 'XMLHttpRequest',
      },
      form: {
        pid: 391,
        action:	'GrabSingleManager.grabSingleLogin',
        timestamp121:	now,
      },
      json: true,
      timeout: 5000,
    };
    console.log('登记登陆', account.phone);
    const res = await request(options);
    console.log(JSON.stringify(res));
    return res;
  }

  async grabStatus(account) {
    const now = +new Date();
    const userAgent = this.userAgent(account.phone);

    const options = {
      method: 'POST',
      jar: true,
      url: 'https://www.cmaotai.com/API/Servers.ashx',
      headers: {
        'cache-control': 'no-cache',
        'accept-language': 'zh-CN,en-US;q=0.8',
        accept: 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Connection: 'keep-alive',
        referer: 'https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html',
        'user-agent': userAgent,
        'x-requested-with': 'XMLHttpRequest',
      },
      form: {
        timestamp121:	now,
        action: 'GrabSingleManager.getList',
        index: 1,
        status: -1,
        size: 10,
      },
      json: true,
      timeout: 5000,
    };
      // console.log(options.form);
    console.log('获取订单状态', account.phone);
    const res = await request(options);
    // console.log(res);
    if (res.state === false) {
      	return new Promise((resolve, reject) => {
      			return resolve([]);
      	});
    } else if (res.data && JSON.parse(res.data).data) {

      	return new Promise((resolve, reject) => {
      			const orderLists = JSON.parse(res.data).data.data;
      			const ret = [];
      			orderLists && orderLists.forEach(item => {
      				const timer = new Date() - new Date(item.createTime) < 1000 * 60 * 60 * 10;
      				if (item.orderStatus <= 5 && timer) {
      						ret.push(item);
      				}
      			});
      			return resolve(ret);
      	});
    }
      	return new Promise((resolve, reject) => {
      			return resolve([]);
      	});

  }

  async getAddressId(tel) {
    
    console.log('start get addressID from mobile:', tel);
    const now = +new Date();
    const userAgent = this.userAgent(tel);
    const options = {
      method: 'POST',
      jar: true,
      url: 'https://www.cmaotai.com/YSApp_API/YSAppServer.ashx',
      headers: {
        'cache-control': 'no-cache',
		            'accept-language': 'zh-CN,en-US;q=0.8',
		            accept: 'application/json, text/javascript, */*; q=0.01',
		            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
		            Connection: 'keep-alive',
		            referer: 'https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html',
		            'user-agent': userAgent,
		            'x-requested-with': 'XMLHttpRequest',
      },
      form: {
        action: 'AddressManager.list',
        index: '1',
        size: '10',
        timestamp121: now,
      },
      json: true,
      timeout: 5000,
    };

    const res = await request(options);
    console.log('address', res.data);
    if (res.data && res.data.list && res.data.list.length > 0) {
        	const sid = res.data.list[0].SId;
          const currentAddress = res.data.list[0];
          const {
                UserId,
                TelPhone,
                Zipcode,
                Address,
                AddressInfo,
                ShipTo,
                Remark,
                ProvinceId,
                CityId,
                DistrictsId,
                SMNo,
                RelPhone,
                Longitude,
                Latitude,
                TimeStamp,
              } = currentAddress;
        	return new Promise((resolve, reject) => {
            
            this.ctx.model.Address.findOrCreate({
              where: {
                SId: sid,
              },
              defaults: {
                UserId,
                TelPhone,
                Zipcode,
                Address,
                AddressInfo,
                ShipTo,
                Remark,
                ProvinceId,
                CityId,
                DistrictsId,
                SMNo,
                RelPhone,
                Longitude,
                Latitude,
                TimeStamp,
              }
            }).then(() => {
                return resolve(sid);  
            }).catch(e=>{
                console.log(e);
                return resolve(sid);
            })
      			
      		});

    }
        	return new Promise((resolve, reject) => {
      			return resolve(-1);
      		});

  }

  async GrabSubmit(account) {
    const now = +new Date();
    const userAgent = this.userAgent(account.phone);
    const addressId = await this.getAddressId(account.phone);
    console.log('addressID', addressId);
    if (addressId === -1) {
      	throw new Error('无法获取账号地址');
      	return;
    }
    const options = {
      method: 'POST',
      jar: true,
      url: 'https://www.cmaotai.com/API/Servers.ashx',
      headers: {

        'cache-control': 'no-cache',
        'accept-language': 'zh-CN,en-US;q=0.8',
        accept: 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Connection: 'keep-alive',
        referer: 'https://www.cmaotai.com/ysh5/page/GrabSingle/grabSingleOrderSubmit.html',
        'user-agent': userAgent,
        'x-requested-with': 'XMLHttpRequest',
      },
      form: {
        sid:	addressId,
        iid:	-1,
        qty:	account.grabNumber || 6,
        express:	14,
        product:	'{"Pid":391,"PName":"贵州茅台酒 (新飞天) 53%vol 500ml","PCode":"23","Unit":"瓶","CoverImage":"/upload/fileStore/20180415/6365942315164224808933821.jpg","SalePrice":1499}',
        remark: '',
        action:	'GrabSingleManager.submit',
        timestamp121:	now,
      },
      json: true,
      timeout: 5000,
    };
      // console.log(options.form);
    console.log('开始下单', account.phone, addressId);
    const res = await request(options);
    return res;
  }

  headers(userAgent, cookies = '') {
    return {
      // // "proxy-authorization" : "Basic " + proxy.proxyAuth,
      'cache-control': 'no-cache',
      cookie: cookies,
      'accept-language': 'zh-CN,en-US;q=0.8',
      accept: 'application/json, text/javascript, */*; q=0.01',
      'content-type': 'application/x-www-form-urlencoded',
      referer: 'https://www.cmaotai.com/ysh5/page/LoginRegistr/userLogin.html',
      'user-agent': userAgent,
      'x-requested-with': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
    };
  }
  get signSecrit() {
    return 'my secrit';
  }

  md5(str) {
    const _md5 = crypto.createHash('md5');
    const result = _md5.update(str).digest('hex');
    return result.toLowerCase();
  }

  userAgent(mobile) {
    const os = 'android';
    const version = '1.0.23';
    const appIndent = this.md5(mobile + this.signSecrit);
    const signString = '7c60b232d79d34d727c12c6f33ad8fea29ebb333ae0c1b3822e5a18934c8f189';
    const appIndentSign = this.md5([ os, version, appIndent, signString ].join('-'));
    return `Mozilla/5.0 (Linux; Android 4.4.4; LA2-SN Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36[${os}/${version}/${appIndent}/${appIndentSign}]`;
  }

}

module.exports = GrabService;
