require("dotenv").config();
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Spotify = require("node-spotify-api");
const inquirer = require('inquirer');

const keys = require('./keys');

const spotify = new Spotify(keys.spotify);

inquirer
    .prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Make your choice',
            choices: ['spotify-this-song', 'do-what-it-says', 'movie-this']
        },

    ])
    .then(answers => {
        if (answers.choice !== 'do-what-it-says') {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'arg',
                        message: 'If you want to search for a specific one, enter text, if not enter nothing.',
                    },

                ])
                .then(answersTwo => {
                    if (answersTwo.arg !== '') {
                        //this means they wante dto searh with an arg
                        handleCommand(answers.choice, answersTwo.arg);
                    }
                    else {
                        //search standard
                        handleCommand(answers.choice);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        else {
            //Here we run do what it says
            handleCommand(answers.choice);
            
        }
    })
    .catch(err => {
        console.log(err);
    });



function handleCommand(command, arg = null) {
    switch (command) {
        // case "concert-this":
        //     concertThis();
        //     break;

        case "spotify-this-song":
            spotifyThisSong(arg);
            break;

        case "movie-this":
            movieThis(arg);
            break;

        case "do-what-it-says":
            whatItSays();
            break;
    };
}

function whatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        const dataArr = data.split(",");
        console.log(dataArr);
        let action = dataArr[0];
        let value = dataArr[1];

        handleCommand(action, value);



    });

};

function spotifyThisSong(value) {
    console.log("I Love Music!");



    let musicTrack;
    if (!value) {
        musicTrack = "The Sign Ace of Base";
    } else {
        musicTrack = value;
    }

    spotify.search({ type: 'track', query: musicTrack }, function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        } else {

            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Here: " + data.tracks.items[0].preview_url);
        }
    });
};

function movieThis(value) {
    // console.log("What movie would you like to watch?");
    console.log(value);


    // let searchMovie;
    if (!value) {
        value = 'Mr. Nobody';
    }


    let queryUrl = 'https://www.omdbapi.com/?t=' + value + '&y=&plot=short&apikey=' + keys.omdb.apiKey;
    axios.get(queryUrl)
        .then((result) => {
            console.log(result.data);
            const {
                Title,
                Year,
                imdbRating,
                Country,
                Language,
                Plot,
                Actors
            } = result.data;
            if (!result.data.Ratings[1]) {
                tomatoRating = "N/A";
            } else {
                tomatoRating = result.data.Ratings[1].Value;
            }

            console.log(`
    ${Title}
    ${Year}
    ${imdbRating}
    ${Country}
    ${Language}
    ${Plot}
    ${Actors}
    `);
        }
        )
};






