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
app.use(express.static('public'));

// default route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

// run the app
app.listen(3000, function () {
  console.log('ISS UTT BOT');
});

/*
	CODE API
 */

//Route to get all tweet or post a tweet
app.route('/tweet')
 .post((req,res,next)=>{
	 client.post('statuses/update',{
		 status:req.body.status,
		 lat:req.body.lat,
		 long:req.body.lng,
		 display_coordinates: true},(e)=>{
			 console.log(e);
		 });
 })
 .get((req,res,next) => {
		client.get('statuses/user_timeline',(req,tweets,resp) => {
			res.json(build_tweets(tweets));
		})
 })


 app.get('/tweet/:countrycode',(req,res) => {
	 client.get('statuses/user_timeline',(r,tweets) => {
		 res.json(findByCC(req.params.countrycode,build_tweets(tweets)));
	 })
 })

function findByCC(countryCode, tweets){
	let tweetsByCC = [];
	for(let i in tweets){
		if(tweets[i].geo.country_code === countryCode){
			tweetsByCC[i] = tweets[i]
		}
	}
	return tweetsByCC;
}

function build_tweets(tweets){
	let tweets_formated = [];
	for(let tweet of tweets){
		tweets_formated.push({
			time: tweet.created_at,
			text: tweet.text,
			url: `https://twitter.com/UTT_ISS_BOT/status/${tweet.id_str}`,
			geo:{
				lat: tweet.coordinates.coordinates[0],
				lng: tweet.coordinates.coordinates[1],
				city: tweet.place ? tweet.place.name : "",
				country: tweet.place ? tweet.place.country : "",
				country_code: tweet.place ? tweet.place.country_code : ""
			}
		});
	}
	return tweets_formated;
}
