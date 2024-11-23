const express = require('express');
const router = express.Router();
const database = require("../models");
const rideController = require('../controllers/rideController');
const { checkLogin } = require('../service/userService');
const { hashPass, comparePass } = require('../service/bcryptService');
const { generateToken, verifyToken } = require('../service/jwtService');

database.sequelize.sync();

router.get('/', function(req, res, next) {
  res.render('index', { message: '' });
});

router.post('/login', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  let user = await checkLogin(username, password);
  if (user) {
    const token = generateToken(user);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

router.get("/home", function(req, res, next){
  res.render('home');
});

router.get("/create", async(req, res, next) => {
  res.render('createaccount');
});

router.post("/create", async(req, res, next)=>{
  const user = req.body;
  const password = user.password;

  const hashedPassword = await hashPass(password);
  const newUser = {
    username: user.username,
    hashedPassword: hashedPassword,
    gender: user.gender,
    mobile: user.mobile,
    email: user.email,
    profile_text: user.profiletext
  };

  const userSaved = await database.users.create(newUser);
  res.render('index', { message: 'Account created successfully' });
});

router.get('/check/:username', async(req, res, next) => {
  const name = req.params.username;
  // console.log(name);
  const user = await database.users.findOne({where: {username: name}});

  if(user){
    res.json({available: false});
  }
  else res.json({available: true});
});

router.get("/create", async(req, res, next) => {
  res.render('createaccount');
});
router.post('/findRide', verifyToken, async (req, res, next) => {
  try {
    const rideData = { ...req.body };
    const rides = await rideController.findRide(rideData);
    res.json({ rides: rides });
    // console.log("done");
  } catch (error) {
    console.error('Error finding ride:', error);
    res.status(500).send('Error finding ride: ' + error.message);
  }
});

router.get('/findRide', async function(req, res, next) {
  try {
    res.render('findRide');
  } catch (error) {
    next(error);
  }
});


router.post('/postRide', verifyToken, async (req, res, next) => {
  const user = req.user;

  try {
    const rideData = {
      ...req.body,
      userid: user.userid,
      // username: user.username  
    };

    await rideController.postRide(rideData);
    
    res.json({message: "Ride successfully posted!"});
    console.log("ride posted");
  } catch (error) {
    console.error('Error posting ride:', error);
    res.status(500).send('Error posting ride: ' + error.message);
  }
});

router.get('/postRide', async function(req, res, next) {
  try {
    res.render('postRide');
  } catch (error) {
    next(error);
  }
});

router.get('/bookingRide', async (req, res, next) => {
    try {
      const rideId = req.query.ride;
      const rideDetails = await database.Rides.findByPk(rideId);
      res.render('bookingConfirmation', { ride: rideDetails });
    } catch (error) {
      console.error('Error handling booking:', error);
      res.status(500).send('Error handling booking: ' + error.message);
    }
  });
  
  router.post('/submit-booking',verifyToken,  async (req, res) => {
    try {
        const { rideId } = req.body;
        const user=req.user;
        // console.log(user);
        const ride = await database.Rides.findOne({ where: { rideId: rideId } });
        // console.log(ride.available_seats);
        if (ride &&  ride.available_seats> 0) {
          ride.available_seats -= 1;
            await ride.save();
            await database.Bookings.create({
                userid: user.userid,
                rideid: ride.rideId, // Use rideId as the primary key
                bookingdate: new Date(),
            });
            // alert("ride booked successfully");
            res.redirect(`/bookingConfirmation?ride=${ride.rideId}`); // Use rideId as the primary key
        } else {
            res.status(400).send('Ride is not available or fully booked.');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        res.status(500).send('Error submitting booking: ' + error.message);
    }
});

router.get('/bookingConfirmation', async (req, res, next) => {
  try {
      const rideId = req.query.ride;
      const rideDetails = await database.Rides.findByPk(rideId);
      res.render('bookingConfirmation', { ride: rideDetails });
  } catch (error) {
      console.error('Error handling booking:', error);
      res.status(500).send('Error handling booking: ' + error.message);
  }
});


router.get('/helpAndSupport', function(req, res, next) {
  res.render('helpAndSupport');
});



router.get('/aboutus', function(req, res, next) {
    res.render('aboutus');
  });
router.get('/updateAccount', verifyToken, async function(req, res, next) {
  const user = req.user;
  try {
      const userDetails = await database.users.findByPk(user.userid);
      res.render('updateAccount', { user: userDetails });
  } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).send('Error fetching user details: ' + error.message);
  }
});
router.post('/updateAccount', verifyToken, async (req, res) => {
    const user = req.user;
    const { name, email, phone, password, confirmpassword } = req.body;

    if (password && password !== confirmpassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const updateUser = await database.users.findByPk(user.userid);

        if (!updateUser) {
            return res.status(404).send('User not found');
        }

        updateUser.name = name;
        updateUser.email = email;
        updateUser.mobile = phone;
        if (password) {
            updateUser.hashedPassword = await hashPass(password);
        }

        await updateUser.save();
        res.redirect('/home');
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).send('Error updating account: ' + error.message);
    }
});


router.get('/logout', async function(req, res, next){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
