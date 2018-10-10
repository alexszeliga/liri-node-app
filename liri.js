// generate operational arguments
var userModeSelector = process.argv[2];
var userQueryString = "";
for (var i = 3; i < process.argv.length; i++) {
  userQueryString += `${process.argv[i]} `;
}
// date/time parsing
var moment = require("moment");
// endpoint packages
var Spotify = require("node-spotify-api");
var request = require("request");
// endpoint security
var dotenv = require("dotenv");
dotenv.config();
var keys = require("./keys");
var fs = require("file-system");
// endpoint variables
var omdbQueryUrl =
  "http://www.omdbapi.com/?apikey=82ce97ae" +
  "&type=movie&s=" +
  userQueryString;
var spotify = new Spotify(keys.spotify);
// operation modes

function executeMode(mode, string) {
  switch (mode) {
    case "concert-this":
      console.log("Bands in Town");
      request(
        `https://rest.bandsintown.com/artists/Foo Fighters/events?app_id=codingbootcamp`,
        (err, res, bod) => {
          var data = JSON.parse(bod);
          console.log(
            `They will be playing in ${data[0].venue.city} on ${moment(
              data[0].datetime,
              "dddd MMMM Do"
            )}`
          );
          console.log(err);
          // console.log(res);
        }
      );
      break;
    case "spotify-this-song":
      console.log(`Spotify search: ${string}`);
      spotify
        .search({ type: "track", query: string, limit: 1 })
        .then(function(response) {
          console.log(response.tracks.items[0].album.artists[0].name);
        })
        .catch(function(err) {
          console.log(err);
        });
      break;
    case "movie-this":
      console.log(`OMDB search: ${string}`);
      request(omdbQueryUrl, (err, res, bod) => {
        if (!err && res.statusCode === 200) {
          var data = JSON.parse(bod);
          console.log(
            `Film Name: ${data.Search[0].Title}\nRelease Year: ${
              data.Search[0].Year
            }`
          );
        } else {
          console.log(err);
        }
      });
      break;
    case "do-what-it-says":
      console.log("Read from text file.");
      break;
    default:
      console.log(
        "I don't get what you just said little kid, but you're special."
      );
      break;
  }
}

executeMode(userModeSelector, userQueryString);
