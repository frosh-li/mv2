module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    username: STRING,
    password: STRING
  }, {
    tableName: 'users',
    timestamps: false,
    freezeTableName: true,
  });

  return User;
};
