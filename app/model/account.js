module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Account = app.model.define('account', {
    phone: STRING,
    password: STRING(30),
    grabNumber: INTEGER(1),
    status: INTEGER(1),
    orderId: STRING,
    orderStatus: STRING,
    createTime: STRING,
    sid: STRING,
    uid: INTEGER,
    cookie: STRING,
    created_at: DATE,
    updated_at: DATE,
  }, {
    tableName: 'accounts',
    timestamps: false,
    freezeTableName: true,
  });

  return Account;
};
