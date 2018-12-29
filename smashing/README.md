# Smashing Frustration

## Description

An app that saves random strings created by smashing the keyboard with your hands.

In the "sounds" homework assignment, the page must be reloaded whenever you want to refresh the visible data or insert more data. Most websites don't work/look like this because they use AJAX, i.e. browser-side, they write javascript that makes a web request to some api, then changes the DOM (using document.querySelector) when it requests an http response from the api.

This assignment is to help you practice implementing that, by creating a web app for users to vent their emotions by smashing their keyboard into a text input (a textarea that will be saved to a database (to use later for data mining for ad targeting, of course, because… what else do you do with data, amirite?).

## Built With

* NodeJS
    * express
    * mongoose
    * path
    * express-session

## Run Instructions

In Terminal:

```
git clone <GIT REPO URL>
cd <GIT REPO NAME>/smashing-frustration
npm start
```

**NOTE**: Make sure to set up a MongoDB instance
then go to localhost:3000 in a browser to view.

