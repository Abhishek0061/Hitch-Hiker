///models/users.js
const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    userid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    // firstname: DataTypes.STRING,
    // lastname: DataTypes.STRING,
    gender: DataTypes.STRING,
    mobile: DataTypes.STRING,
    email: DataTypes.STRING,
    pic: DataTypes.STRING,
    profiletext: DataTypes.STRING,
  }, {
    tableName: "users",
    timestamps: false,
  });
  users.associate = function(models) {
    users.hasMany(models.Bookings, { foreignKey: 'user_id' });
    users.hasMany(models.Rides, { foreignKey: 'userid' });
  };
  return users;
};
