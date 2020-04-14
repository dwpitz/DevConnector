const mongoose = require('mongoose');
const config = require('config');
//This references the link we brought in from Mongo DB Atlas
const db = config.get('mongoURI');

//This method connects our DB using a Try Catch. A Try Catch represents a block of statements and specifies a response should an exception be thrown.
const connectDB = async () => {
  //Try to connect w/ our DB
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB is Connected...');
    //If you can't connect, catch the error and throw an error message.
  } catch (err) {
    console.error('err.message');
    //Exit process with failure.
    process.exit(1);
  }
};

module.exports = connectDB;
