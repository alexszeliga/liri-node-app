# liri-node-app

A language interpretation command line app focused on music movies and bands. It's a contrived exercise which demonstrates a handful of Node best-practices and exemplifies basic functions of a few packages.

# What it does:

liri takes in commands via the command line and spits out useful information.

# How to interact:

liri is a Node.js app, so it can only be launched in the command line after installing Node.

[Install Node](https://nodejs.org/en/download/)

Once this repository is cloned locally and node is installed, run the following command to install necessary packages.

`npm install`

![clone and npm install](./pres-gif/clone-repo.gif)

You will have to set up an .env file with the following structure:

```
# Spotify API keys

SPOTIFY_ID=<your spotify api id>
SPOTIFY_SECRET=<your spotify app secret code>

# OMDB API Key

OMDB_KEY=<omdb api key>
```

The following command needs to be sent to the command line before this app will function:

# Operation Modes:

At this time, liri has three main modes and one supplimental mode.

### Movie Info Mode:

Movie info mode is executed by entering the following command on the command line:

`node liri movie-this The Wizard of Oz`

Replace `The Wizard of Oz` with the name of any movie!

### Concert info mode:

Concert info mode is executed by entering the following command on the command line:

`node liri concert-this Foo Fighters`

Replace `Foo Fighters` with the name of any musical artist!

### Spotify song info mode:

Spotify song info mode is executed by entering the following command on the command line:

`node liri spotify-this-song Just a Girl`

Replace `Just a Girl` with the name of any song; you can also include the artist name to further hone in the result!

### Parse text mode:

The 'random.txt' file included with this repository is parsed to provide a mode and search string for the app.

To have this app parse the text file, enter the following command:

`node liri do-what-it-says`

random.txt can be updated, replacing `spotify-this-song` with any mode argument and `"I Want It That Way"` with a corresponding search string.

## Help Mode:

Additional help is availabe in the app by using the following command:

`node liri help`
