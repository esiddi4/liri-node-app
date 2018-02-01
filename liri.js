// Add code to read and set any environment variables with the dotenv package
require("dotenv").config();

// Import Spotify API
var Spotify = require('node-spotify-api');
// Import Twitter API
var Twitter = require('twitter');
// Import API keys
var keys = require("./keys.js");

// Include the request npm package
var request = require('request');

// Variables to access keys information
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Variable for liri command
var command = process.argv[2];

switch(command) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
	default:
		console.log("Invalid command");
};


// MY TWEETS FUNCTION
function myTweets() {
	client.get('statuses/home_timeline', function(error, tweets, response) {
	  if(error) throw error;

	  for (var i = 0; i < 20; i++) {
	  	var tweet = tweets[i].text;
	  	var createdAt = tweets[i].created_at;
	  	console.log(tweet);
	  	console.log(createdAt);
	  }

	});
}


// SPOTIFY THIS SONG FUNCTION
function spotifyThisSong() {
	spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	
	var artist = data.tracks.items[0].album.artists[0].name;
	var track = data.tracks.items[0].name;
	var previewLink = data.tracks.items[0].external_urls.spotify;
	var albumName = data.tracks.items[0].album.name;
 	
 	console.log(artist, track, previewLink, albumName);
	});
}


// MOVIE THIS FUNCTION
function movieThis() {

	var movieName = "";

	// Use for loop so that movie names longer than one word are included in query
	for (var i = 3; i < process.argv.length; i++) {
		movieName += process.argv[i] + "+";
	}

	// Run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	

	request(queryUrl, function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
	  if (!error && response.statusCode === 200) {

	    // Parse the body of the site and recover just the imdbRating
	    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
	    console.log(body);
	  }
	});

  // Title of the movie.
  // var movieTitle = JSON.parse(body).Title;

  // Year the movie came out.
  // var movieYear = JSON.parse(body).Year;

  // IMDB Rating of the movie.
  // var imdbRating = JSON.parse(body).imdbRating;

  // Rotten Tomatoes Rating of the movie.
  // var rottenTomatoes = JSON.parse(body).Ratings[1].Value;

  // Country where the movie was produced.
  // var movieCountry = JSON.parse(body).Country;

  // Language of the movie.
  // var movieLanguage = JSON.parse(body).Language;

  // Plot of the movie.
  // var moviePlot = JSON.parse(body).Plot;

  // Actors in the movie.
  // var movieActors = JSON.parse(body).Actors;

}


// DO WHAT IT SAYS FUNCTION
function doWhatItSays() {

}

