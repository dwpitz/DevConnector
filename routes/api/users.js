const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//User Model
const User = require('../../models/User');

//@route Post api/users
//@descript Register User route
//@access Public
router.post(
  '/',
  //This is the express validator dependency which checks if the user has met all requirements for registration. User has to enter all the correct information when they make the request.
  [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please include a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // req.body is the object of data that's going to be sent to this route.
    // console.log(req.body);
    //This will pull all of this out of req.body.
    const { name, email, password } = req.body;

    try {
      //See if the user exists. If user exists we'll send back an error. We don't want to collect multiple emails.
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      //Get user's gravatar, which will let us pull in their github profile
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      //This creates an instance of the user.
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encrypt the password using bcrypt. First creat the Salt w/ a recommendation of 10 characters.
      const salt = await bcrypt.genSalt(10);
      //This takes the user's password and applies the salt to it, encripting it.
      user.password = await bcrypt.hash(password, salt);
      //This saves the user in the DB.
      await user.save();
      //return the json web token.  When the user registers we want them to be logged in right away, and you need the json web token to do that. The user uses the token to authenticate and access protected routes.
      //This is the payload, which includes the user ID.
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
