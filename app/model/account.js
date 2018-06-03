module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Account = app.model.define('account', {
    phone: STRING,
    password: STRING(30),
    cookie: STRING,
    created_at: DATE,
    updated_at: DATE,
  });

  return Account;
};
