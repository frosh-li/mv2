module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Order = app.model.define('order', {
    phone: STRING,
    orderId: STRING,
    createTime: STRING,
    count: INTEGER,
  }, {
    tableName: 'orders',
    timestamps: false,
    freezeTableName: true,
  });

  return Order;
};
