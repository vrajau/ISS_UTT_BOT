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

const tweetFunctions = require('./public/js/tweet_functions');

const countryCodeRegex = new RegExp(/^[a-z]{2}$/i);

/*
 	Middlewares
*/

//  parse body request
app.use(bodyParser.json());

// use /public in html files
app.use(express.static('public'));

// check if the country code has the right format
app.use('/tweet/:countryCode', (req, res, next) => {
	req.params.countryCode.match(countryCodeRegex) ? next() : res.status(400).send("Wrong country code");
});

/*
	Routes
*/

// default route
app.get('/', function (req, res) {
  	res.sendFile(path.join(__dirname + '/views/index.html'));
});

// Route to get all tweet or post a tweet
app.route('/tweet')
	.post((req,res,next) => {
		client.post('statuses/update', {
		 	status:req.body.status,
		 	lat:req.body.lat,
		 	long:req.body.lng,
		 	display_coordinates: true
		}, e => {
		 	console.log(e);
	 	});
	})
 	.get((req,res,next) => {
	 	client.get('statuses/user_timeline',(req,tweets,resp) => {
			res.json(tweetFunctions.buildTweets(tweets));
		})
 	});

// Route to get all the tweets by country code
app.get('/tweet/:countryCode',(req,res) => {
 	client.get('statuses/user_timeline',(r,tweets) => {
	 	res.json(tweetFunctions.findByCC(req.params.countryCode, tweetFunctions.buildTweets(tweets)));
 	})
});

/*
	Run the app
*/

app.listen(3000, function () {
  	console.log('ISS UTT BOT');
});
