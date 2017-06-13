exports.findByCC = function(countryCode, tweets){
	let tweetsByCC = [];
	for(let i in tweets){
		if(tweets[i].geo.country_code === countryCode){
			tweetsByCC[i] = tweets[i]
		}
	}
	return tweetsByCC;
};

exports.buildTweets = function(tweets){
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
};
