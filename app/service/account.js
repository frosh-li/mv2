const Service = require('egg').Service;

class AccountService extends Service {
  async findAll() {
    const account = await this.ctx.model.Account.findAll({
      where: {
        status: 1,
      },
    });

    return account;
  }

  async updateGrab(account, grabData) {
    await this.ctx.model.Account.update({
      createTime: grabData[0].createTime,
      orderId: grabData[0].orderId,
      orderStatus: grabData[0].orderStatus,
      updated_at: new Date(),
    }, {
      where: {
        phone: account.phone,
      },
    });

    grabData.map(async grabItem => {
      if (grabItem.orderStatus >= 4) {
        await this.ctx.model.Order.findOrCreate({
          where: {
            orderId: grabItem.orderId,
          },
          defaults: {
            createTime: grabItem.createTime,
            phone: account.phone,
            count: grabItem.goodsNum,
          }
        });
      }
    });
  }

  async Login(username, password) {
    const { User } = this.ctx.model;
    const res = await User.find({
      where: {
        username: username,
        password: password,
      },
    });
    return res;
  }

  async getAccountsByUser(uid, limit = 20, offset = 0, phone, status){
    console.log('limit,offset',limit,offset);
    let where = {
      uid: uid
    };

    if(phone){
      where['phone'] = phone;
    }
    if(status){
      where['status'] = status;
    }
    const {Account, Address} = this.ctx.model;
    Account.belongsTo(Address, { foreignKey: 'phone', targetKey: 'TelPhone' });
    const account = await Account.findAndCountAll({
      where: where,
      offset: offset,
      limit:limit,
      include: {
        model: Address,
        attributes: ['ShipTo', 'CityId', 'AddressInfo'],
      },
      order: [['createTime', 'desc'], ['status', 'desc']],
    });

    return account;
  }

  async insertAccount(uid, phone, password) {
    return await this.ctx.model.Account.findOrCreate({
      where: {
        phone: phone,
      },
      defaults: {
        password: password,
        uid: uid
      }
    })
  }
}

module.exports = AccountService;
