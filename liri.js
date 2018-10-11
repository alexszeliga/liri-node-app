// clear terminal
process.stdout.write("\033c");
// generate operational arguments
var userModeSelector = process.argv[2];
var userQueryConcat = "";
for (var i = 3; i < process.argv.length; i++) {
  userQueryConcat += `${process.argv[i]} `;
}
var userQueryString = userQueryConcat.trim();

// file system access
var fs = require("fs");
// date/time parsing
var moment = require("moment");
// endpoint packages
var Spotify = require("node-spotify-api");
var request = require("request");
// endpoint security
var dotenv = require("dotenv");
dotenv.config();
var keys = require("./keys");
// endpoint variables
var spotify = new Spotify(keys.spotify);

// operation modes
function executeMode(mode, string) {
  switch (mode) {
    case "concert-this":
      concertMode(string);
      break;
    case "spotify-this-song":
      songMode(string);
      break;
    case "movie-this":
      movieMode(string);
      break;
    case "do-what-it-says":
      parseFile(string);
      break;
    case "help":
      helpMode();
      break;
    default:
      if (mode === undefined) {
        console.log(
          `You must enter an argument. Try typing "node liri help" into the command line for more info.`
        );
        break;
      }
      console.log(`"${mode}" is not a valid converstaion mode.`);
      break;
  }
}
function concertMode(string) {
  // request from Bands in Town API to get full band name (and correct spelling if possible)
  request(
    `https://rest.bandsintown.com/artists/${string}/?app_id=197bdf9089eb68136f2e7f1477514ec3`,
    function(err, res, bod) {
      // basic validation: does the API respond?
      if (!err && res.statusCode === 200) {
        var artistData = JSON.parse(bod);
        // input validation: if there's a result, no error key exists
        if (artistData.error === "Not Found") {
          return console.log(
            "I'm sorry, we're unable to locate an artist with that name."
          );
        }
        var artistName = artistData.name;
        request(
          `https://rest.bandsintown.com/artists/${artistName}/events?app_id=197bdf9089eb68136f2e7f1477514ec3`,
          function(err, res, bod) {
            // error handling here is less strict since I'm assuming the endpoint is up
            // and the band name will conform, since it's coming direct from their db.
            var allEventData = JSON.parse(bod);
            if (allEventData.length === 0) {
              console.log(
                `I'm sorry, ${artistName} has no events booked at this time.`
              );
              return;
            }
            var venueData = allEventData[0].venue;
            var showDateTimeRaw = allEventData[0].datetime;
            var showDateTimeFormatted = moment(showDateTimeRaw).format(
              "MM/DD/YYYY"
            );
            var venueName = venueData.name;
            var venueLocation = `${venueData.city}, ${venueData.country}`;
            console.log("Next performance info for: " + artistName);
            console.log("Date: " + showDateTimeFormatted);
            console.log("Location: " + venueLocation);
            console.log("Venue name: " + venueName);
          }
        );
      } else {
        // error mode in bands in town
        console.log(err);
        console.log(res.statusCode, res.statusMessage);
      }
    }
  );
}
function songMode(string) {
  if (string === "") {
    string = "Ace of Base The Sign";
  }
  spotify
    .search({ type: "track", query: string, limit: 1 })
    .then(function(response) {
      var artistName = response.tracks.items[0].artists[0].name;
      var songName = response.tracks.items[0].name;
      var albumName = response.tracks.items[0].album.name;
      var spotifySongURL = response.tracks.items[0].external_urls.spotify;
      console.log(
        `
        Song Name: ${songName}
        Artist Name: ${artistName}
        Album Name: ${albumName}
        Spotify URL: ${spotifySongURL}
        `
      );
    })
    .catch(function(err) {
      console.log(err);
    });
}
function movieMode(string) {
  var omdbQueryUrl =
    "http://www.omdbapi.com/?apikey=82ce97ae&type=movie&s=" + string;
  request(omdbQueryUrl, (err, res, bod) => {
    if (!err && res.statusCode === 200) {
      var imdbID = JSON.parse(bod).Search[0].imdbID;
      request(
        "http://www.omdbapi.com/?apikey=82ce97ae&i=" + imdbID,
        (err, res, bod) => {
          if (!err && res.statusCode === 200) {
            var data = JSON.parse(bod);
            console.log(
              `
              Movie Name: ${data.Title}
              Release Year: ${data.Year}
              IMDB Rating: ${data.imdbRating}
              Rotten Tomatoes Rating: ${
                data.Ratings.filter(function(el) {
                  return el.Source === "Rotten Tomatoes";
                })[0].Value
              }
              Country: ${data.Country}
              Languages: ${data.Language}
              Plot: ${data.Plot}
              Actors: ${data.Actors}
              `
            );
          }
        }
      );
    } else {
      console.log(err);
    }
  });
}
function parseFile() {
  fs.readFile("./random.txt", "utf8", (err, data) => {
    if (!err) {
      var textFileParsed = data.split(",");
      // console.log(textFileParsed[0], textFileParsed[1]);

      executeMode(textFileParsed[0], textFileParsed[1]);
    } else {
      console.log("Error: unable to parse text file");
    }
  });
}
function helpMode() {
  console.log(`
  This is a command line application that retreives some basic info about songs, movies, and concerts.

  The first argument defines what type information you want, the second is your your topic of search

  The following commands are supported as a first argument:

  1. concert-this
  2. spotify-this-song
  3. movie-this
  4. do-what-it-says

  The second argument in concert-this mode should be the name of a musical performer
  
  The second argument in spotify-this-song should be a song title (hint: include the artist name as well if you're having trouble getting what you want...or include no second argument at all if you want to go that route.)
  
  The Second argument for movie-this should be the name of a movie

  do-what-it-says parses a preprogrammed Spotify search which can be edited/viewed in random.txt
  `);
}
executeMode(userModeSelector, userQueryString);
