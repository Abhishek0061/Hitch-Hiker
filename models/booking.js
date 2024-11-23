module.exports = (sequelize, DataTypes) => {
    const Bookings = sequelize.define('Bookings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userid: DataTypes.INTEGER,
      rideId: DataTypes.INTEGER,
      bookingdate: DataTypes.DATE,
    }, {
      tableName: 'bookings',
      timestamps: false,
    });
  
    Bookings.associate = function(models) {
      Bookings.belongsTo(models.users, { foreignKey: 'userid' });
      Bookings.belongsTo(models.Rides, { foreignKey: 'rideid' });
    };
  
    return Bookings;
  };
  