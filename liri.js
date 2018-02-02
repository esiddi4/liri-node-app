// Add code to read and set any environment variables with the dotenv package
require("dotenv").config();

// Import Spotify API
var Spotify = require('node-spotify-api');
// Import Twitter API
var Twitter = require('twitter');
// Import API keys
var keys = require("./keys.js");
// Import fs npm package
var fs = require('fs');

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

	var querySong = "";
	for (var i = 3; i < process.argv.length; i++) {
		querySong += process.argv[i] + " ";
	}

	// If user does not provide song, default to The Sign by Ace of Base
	if (querySong === "") {
		querySong = "The Sign Ace of Base";
	}

	spotify.search({ type: 'track', query: querySong }, function(err, data) {

		if (err) {
			return console.log('Error occurred: ' + err);
		}
	
		// Artist
		var artist = data.tracks.items[0].album.artists[0].name;
		console.log("Artist: " + artist);

		// Track
		var track = data.tracks.items[0].name;
	 	console.log("Track: " + track);

	 	// Preview Link
		var previewLink = data.tracks.items[0].external_urls.spotify;
	 	console.log("Spotify Link: " + previewLink);

		// Album Name
		var albumName = data.tracks.items[0].album.name;
	 	console.log("Album Name: " + albumName);

	});
}


// MOVIE THIS FUNCTION
function movieThis() {

	var movieName = "";
	// Use for loop so that movie names longer than one word are included in query
	for (var i = 3; i < process.argv.length; i++) {
		movieName += process.argv[i] + "+";
	}

	// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
	if (movieName === "") { movieName = "Mr. Nobody"; }

	// Run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	
	request(queryUrl, function(error, response, body) {

	  // If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode === 200) {

		// Title of the movie.
		var movieTitle = JSON.parse(body).Title;
		console.log("Title: " + movieTitle);

		// Year the movie came out.
		var movieYear = JSON.parse(body).Year;
		console.log("Year: " + movieYear);

		// IMDB Rating of the movie.
		var imdbRating = JSON.parse(body).imdbRating;
		console.log("IMDB Rating: " + imdbRating);

		// Rotten Tomatoes Rating of the movie.
		var rottenTomatoes = JSON.parse(body).Ratings[1].Value;
		console.log("Rotten Tomatoes Rating: " + rottenTomatoes);

		// Country where the movie was produced.
		var movieCountry = JSON.parse(body).Country;
		console.log("Country: " + movieCountry);

		// Language of the movie.
		var movieLanguage = JSON.parse(body).Language;
		console.log("Language: " + movieLanguage);

		// Plot of the movie.
		var moviePlot = JSON.parse(body).Plot;
		console.log("Plot: " + moviePlot);

		// Actors in the movie.
		var movieActors = JSON.parse(body).Actors;
		console.log("Actors: " + movieActors);

		}
	});

}


// DO WHAT IT SAYS FUNCTION
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }

	  // Then split it by commas (to make it more readable)
	  var dataArr = data.split(",");

	  // We will then re-display the content as an array for later use.
	  console.log(dataArr);

	  command = dataArr[0];
	  process.argv[3] = dataArr[1];
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

	});
}

