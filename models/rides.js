///models/rides.js
module.exports = (sequelize, DataTypes) => {
  const Rides = sequelize.define('Rides', {
    rideId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departure: DataTypes.STRING,
    destination: DataTypes.STRING,
    date: DataTypes.DATE,
    available_seats: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    contact: DataTypes.STRING
  });
   return Rides;
};
