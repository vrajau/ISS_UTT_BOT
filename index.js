require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const Twitter = require('twitter')
const client = new Twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_KEY_SECRET,
	access_token_key: process.env.TOKEN,
	access_token_secret: process.env.TOKEN_SECRET
});

//middleware to parse body request
app.use(bodyParser.json());

// to use /public in html files
app.use('/public', express.static('public'));

// default route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.post('/tweet', function (req,res) {
    client.post('statuses/update',{status:req.body.status})
});

// run the app
app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
