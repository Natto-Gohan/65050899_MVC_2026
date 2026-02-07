const express = require('express');
const path = require('path');

const app = express();

// parse form
app.use(express.urlencoded({ extended: true }));

// ตั้งค่า view
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// controller (route)
const mainRoute = require('./controller/route');
app.use('/', mainRoute);

// start server
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
