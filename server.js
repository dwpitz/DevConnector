//Reminder: require() function takes whatever code was written for the specified library (this case express) and returns it. It's stored in a variable (express). The variable is the library itself.
const express = require('express');
const connectDB = require('./config/db');

//
const app = express();

//Connect DB
connectDB();

//Simple Get Request to see if the server is running. Clients of our server can retrieve information from it. The 2nd parameter (a callback) is executed each time a client goes to the index site. This callback features a request and a response.  The request features an object containing information about the request being made.  The response is an object containing methods for sending info back to the client. '/' is actually 'http://localhost:5000'.
app.get('/', (req, res) => {
  res.send('API Running');
});

//Define Routes
//This pertains to the / in the above Get Route. '/api/users' is appended to 'http://localhost:5000', and requires the get route in 'routes/api/users'.
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//This will look for an environment variable called PORT to use.  When we deploy to Heroku, this is where it will get the PORT Number. Locally it will run on Port 5000, which is also the default.
//REMINDER: || Logical OR operator.  If the environmental variable is not set, default (OR) is 5000. process.env.PORT is not yet defined.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
