const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//@route Post api/users
//@descript Register User route
//@access Public
router.post(
  '/',
  //This is the express validator dependency which checks if the user has met all requirements for registration.
  [
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please include a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // req.body is the object of data that's going to be sent to this route.
    // console.log(req.body);
    res.send('User Route');
  }
);

module.exports = router;
