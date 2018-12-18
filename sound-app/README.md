# What Was That Sound? (Sessions and Storing Data)

## Description

a site where users can post reports of weird sounds they heard. By the end of this project… you should be familiar with:

* writing middleware
* some basic read and write operations with mongodb…
* integrating mongodb with an Express web application using Mongoose

### Routes

* / - show all sounds
* /sounds/add - show the add sound form
* /sounds/add - process a new sound
* /sounds/mine - show the sounds added during the user's session

## Goals

This assignment will cover storing and retrieving data in a database and in an in-memory session store. You will:

* use the commandline mongodb client to create a database, collection, and several documents
* use mongoose to read and write data to and from mongodb from an express application
* use pre-built session middleware to read and write data to and from an in-memory session store on a per session basis

## Built With

* MongoDB
* NodeJS
    * express-session
    * express
    * hbs
    * mongoose

## Run Instructions

```
git clone <GIT REPO URL>
cd <GIT REPO NAME>/candacej97-homework05
npm install
node start
```

**NOTE**: Make sure to set up a MongoDB instance

* Go to your browser at type in `localhost:3000`

