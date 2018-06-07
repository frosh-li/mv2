/**
 * 登记下单服务
 * @type {[type]}
 */
const Service = require('egg').Service;
const request = require('request-promise-native');
const crypto = require('crypto');

class OrderService extends Service {

  /**
		 * 根据用户ID获取订单数据
		 *
		 * @param  {[type]} uid [description]
		 * @return {[type]}     [description]
		 */
  async getAllOrders(uid, limit = 20, offset = 0) {
    const { Account, Order, Address } = this.app.model;
    Order.belongsTo(Account, { foreignKey: 'phone', targetKey: 'phone' });
    Order.belongsTo(Address, { foreignKey: 'phone', targetKey: 'TelPhone' });
    const where = {};
    if (uid) {
      where.uid = uid;
    }
    const orders = await Order.findAndCountAll({
		      attributes: [ 'orderId', 'createTime', 'phone', 'count' ],
		      offset:offset,
		      limit:limit,
		      include: [
		      	{
			        model: Account,
			        attributes: ['uid', 'password'],
			        where:where,
			      },
			      {
			      	model:Address,
			      	attributes: ['ShipTo', 'AddressInfo']
			      }
		      ],
		      order: [['createTime', 'desc']],
		    });
		    return orders;
  }

}

module.exports = OrderService;
