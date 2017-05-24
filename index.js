const express = require('express');
const path = require('path');
const app = express();

// to use /public in html files
app.use('/public', express.static('public'));

// default route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

// run the app
app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
