/**
 * 登记下单服务
 * @type {[type]}
 */
const Service = require('egg').Service;
// 代理服务器
   const proxyHost = "http-dyn.abuyun.com";
   const proxyPort = 9020;

   // 代理隧道验证信息 H102535F767T765D:1E911CA4F2DE03EE
   const proxyUser = "H102535F767T765D";
   const proxyPass = "1E911CA4F2DE03EE";

let request = require('request-promise-native');

const crypto = require('crypto');

class GrabService extends Service {
  constructor(options) {
    super(options);
    this.memberid="";
    this.auth = "";
  }

  submitUrl() {
    return 'https://www.emaotai.cn/cmaotai-application-ysdt/api/v1/qd/order/submitQdOrder';
  }

  get memberUrl(){
    return `https://www.emaotai.cn/yundt-application-trade-core/api/v1/yundt/trade/member/detail/get?`;
  }
  async login(account) {
    let tel = account.phone;
    let pass = account.password;
    const now = +new Date();
    const options = {
      url: 'https://www.emaotai.cn/huieryun-identity/api/v1/auth/XIANGLONG/user/o2omember/auth',
      method: 'post',
      headers: this.headers,
      form:{
          userCode: tel,
          userPassword: this.rstr2b64(pass),
          loginType: 'name',
          loginSource: 2,
          loginFlag: 1,
      },
      gzip:true,
      json:true,
      timeout: 5000,
      proxy: "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort,
    };
    const res = await request(options);
    console.log(res);

    if (res.resultCode === 0) {
        this.auth = res.data.auth || "";
        if(!account.memberid){
          let userdata = await this.userInfo();
          this.memberid = userdata.data.memberId;
          await this.ctx.model.Account.update({
            memberid: this.memberid
          },{
            where: {
              phone: tel,
            }
          })
        }else{
          this.memberid = account.memberid;
        }

        return res;
    } else if(res.resultCode === 10010) {
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
      proxy: "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort,
    };
    console.log('登记登陆', account.phone);
    const res = await request(options);
    console.log(JSON.stringify(res));
    return res;
  }

  async grabStatus(account) {
    const now = +new Date();

    const options = {
      method: 'get',
      jar: true,
      url: `https://www.emaotai.cn/cmaotai-application-ysdt/api/v1/qd/order/getQdOrders?orderStatus=-2&pageNum=1&pageSize=10`,
      headers: this.headers,
      json: true,
      timeout: 5000,
      gzip:true,
      proxy: "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort,
    };
    console.log('获取订单状态', account.phone);
    const res = await Promise.all([
      request(options),
      request(Object.assign(options,{
        url: `https://www.emaotai.cn/cmaotai-application-ysdt/api/v1/qd/order/getQdOrders?orderStatus=4&pageNum=1&pageSize=10`
      }))
    ]);
    console.log(JSON.stringify(res,null,4));
    if(res[1].data.list.length > 0){
      console.log("has order");
    }
    if(res[0].data.list.length === 0 && res[1].data.list.length === 0){
      // 重新开始登记一次
      await this.submit();
      return;
    }

    if(res[1].data.list.length > 0 || res[0].data.list.length > 0){
      await this.ctx.service.account.updateGrab(account, res[0].data.list.concat(res[1].data.list));
    }
  }

  async getFirstAddressId() {
    let res = await request({
        url: 'https://www.emaotai.cn/yundt-application-trade-core/api/v1/yundt/trade/member/address/list?',
        method: 'get',
        headers: this.headers,
        gzip:true,
        json:true,
        proxy: "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort,
    })
    return res;
  }

  async sleep(timer=5000) {
    return new Promise((resolve,reject) => {
      setTimeout(()=>{
        return resolve(true);
      }, timer);
    })
  }

  async submit(){
    let address = await this.getFirstAddressId();
    await this.sleep(500);
    let addressId = address.data[0].id;
    // 登记
    let res = await request({
        url: this.submitUrl(),
        method: 'post',
        headers: this.headers,
        gzip:true,
        form: {
          addressId:addressId,
          deliveryType:3,
          goodsNum:2,
          invoiceId:-1,
          itemId:'1179926380333332484',
          orderType:0,
          remark:"",
          skuId:'1179926380340672519'
        },
        json:true,
        proxy: "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort,
    })
    console.log(res);
    return res;
  }

  async userInfo() {
      let res = await request({
          url: this.memberUrl,
          method: 'get',
          headers: this.headers,
          gzip:true,
          json: true,
          proxy: "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort,
      })
      console.log('userinfo', res)
      return res;
  }



  rstr2b64(input)
   {
     let b64pad = '';
     try { b64pad } catch(e) { b64pad=''; }
     var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
     var output = "";
     var len = input.length;
     for(var i = 0; i < len; i += 3)
     {
       var triplet = (input.charCodeAt(i) << 16)
                   | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                   | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
       for(var j = 0; j < 4; j++)
       {
         if(i * 8 + j * 6 > input.length * 8) output += b64pad;
         else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
       }
     }
     return output;
   }

  get headers() {
    const base64    = new Buffer("H102535F767T765D:1E911CA4F2DE03EE").toString("base64");
    return {
      'Proxy-Authorization': "Basic " + base64,
      'memberid': this.memberid,
      'auth':this.auth || "",
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'appId': 1,
      'Cache-Control': 'no-cache',
      'tenantid': '02',
      'channelId': '01',
      'channelcode': '02',
      'appcode':2,
      'reqid':+new Date(),
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Flag': 1,
      'Origin': 'https://www.emaotai.cn',
      'Pragma': 'no-cache',
      'Referer': 'https://www.emaotai.cn/smartsales-b2c-web-pc/login',
      'Sign': 'd41d8cd98f00b204e9800998ecf8427e',
      'tenantid': 1,
      'Timestamp': +new Date(),
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    }
  }

}

module.exports = GrabService;
