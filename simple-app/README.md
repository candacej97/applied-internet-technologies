
# A Site About Blue-Nose Pitbulls

## Description

There are two parts to this assignment:

1. using the sample code from class, refactor the code into classes, functions and objects
2. use this code to create a website about an animal

At the end, you'll have a reusable toy web framework that you can use to write simple web applications, as well as a demo site.

Again, both parts will be built off of and run from node's built-in TCP server (from the net module).

You can only use the following two modules for this assignment →

* net - a module for creating TCP servers and clients
* fs - a module for file system related tasks, such as reading and writing files

⚠️ We couldn't use the http module… or install additional frameworks, such as express

## Built With

* NodeJS
    * net
    * fs

## Run Instructions

```
git clone <GIT REPO URL>
cd <GIT REPO NAME>/simple-app
npm install
node start
```

go to your browser at type in `localhost:3000`

## Routes

### Root ('/') - responds with a page that links to /gallery

### Gallery ('/gallery') - responds with a page that contains a random number of random images of an animal

### Pics ('/pics') - redirects to /gallery

### CSS ('/css/styles.css') - serves up a stylesheet based on a static file contained in public/css/

### IMG ('/img/animal1.jpg') - serves up an image of an animal