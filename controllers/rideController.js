const database = require('../models');
const sequelize = require('sequelize');

async function postRide(rideData) {
  try {
    // Save ride details to the database
    await database.Rides.create({
      departure: rideData.departure,
      destination: rideData.destination,
      date: rideData.date,
      available_seats: rideData.available_seats,
      price: rideData.price,
      contact: rideData.contact,
      userid: rideData.userid
    });
  } catch (error) {
    console.error('Error posting ride:', error);
    throw new Error('Error posting ride: ' + error.message);
  }
}async function findRide(rideData) {
  const { destination, date } = rideData;
  const dateOnly = date.split('T')[0]; // Extract only the date part

  try {
    const rides = await database.Rides.findAll({
      where: {
        destination: destination,
        [sequelize.Op.and]: sequelize.where(sequelize.fn('DATE', sequelize.col('date')), dateOnly),
        available_seats: {
          [sequelize.Op.gt]: 0 // Check if available_seats is greater than 0
        }
      }
    });
    return rides;
  } catch (error) {
    console.error('Error finding rides:', error);
    throw new Error('Error finding rides: ' + error.message);
  }
}


module.exports = {
  postRide,
  findRide,
};
