const jwt = require('jsonwebtoken');
const config = require('config');

//exporting middleware function
module.exports = function (req, res, next) {
  //Get The Token from the header
  const token = req.header('x-auth-token');
  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No Token, authorization denied' });
  }

  //Verify Token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
