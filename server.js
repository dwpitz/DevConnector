const express = require('express');

const app = express();

//Simple Get Request to see if the server is running.
app.get('/', (req, res) => res.send('API Running'));

//This will look for an environment variable called PORT to use.  When we deploy to Heroku, this is where it will get the PORT Number. Locally it will run on Port 5000, which is also the default.
//REMINDER: || Logical OR operator.  If the environmental variable is not set, default (OR) is 5000.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
