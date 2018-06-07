
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Address = app.model.define('address', {
       SId: INTEGER,
       UserId: STRING,
       TelPhone: STRING,
       Zipcode: STRING,
       Address: STRING,
       AddressInfo: STRING,
       ShipTo: STRING,
       Remark: STRING,
       ProvinceId: STRING,
       CityId: STRING,
       DistrictsId: STRING,
       SMNo: STRING,
       RelPhone: STRING,
       Longitude: STRING,
       Latitude: STRING,
       TimeStamp: STRING
  }, {
    tableName: 'addresss',
    timestamps: false,
    freezeTableName: true,
  });

  return Address;
};
