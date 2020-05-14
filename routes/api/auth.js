const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//@route Get api/auth
//@descript Test route
//@access Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//@route Post api/auth
//@descript Authenticate User & get token
//@access Public
router.post(
  '/',
  //This is our Login Route that checks if both the email and password exists .
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // req.body is the object of data that's going to be sent to this route.
    // console.log(req.body);
    //This will pull all of this out of req.body.
    const { email, password } = req.body;

    try {
      //Check to see if there's NOT a user. If there is NOT a user, send back an error.
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credintials' }] });
      }

      //We need to check that the password matches. We're going to use a bcrypt method called compare which compares a plain next password to the encrypted password, which we can get from the user.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credintials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      //This signs the token, passes in the payload, secret, and expiration.
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
