const express = require('express');
const app = express();
const path = require('path');

// session information
const session = require('express-session');
app.use(session({
    secret: 'keyboard secretive',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: false }
}));

// require the db file
require('./db');

// retrieving the model registered with mongoose
const mongoose = require('mongoose');
const Sound = mongoose.model('Sound');

// serve static files
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// change views directory
app.set('views', path.join(__dirname, 'views'));

// set up handlebars
app.set('view engine', 'hbs');

// parses the http req body and creates a prop on the req object called body
app.use(express.urlencoded({ extended: false }));

// keeps track of the session views - code from api
app.use(function (req, res, next) {
    if (!req.session.views) {
      req.session.views = 1;
    }
    else { req.session.views++; }
    
    next();
});

// route for the home page
app.get('/', (req, res) => {

    // console.log(`REQUEST SESSION: ${JSON.stringify(req.session, null, "\t")}\nREQUEST SESSION ID: ${JSON.stringify(req.session.id, null, "\t")}`); 
    
    const filterObj = {};

    for (const key in req.query) {
        if (req.query[key] !== '') {
            // added the regex for the date filter option
            filterObj[key] = { $regex : new RegExp(req.query[key], 'i') };
        }
    }

    // show all the sounds in the db
    Sound.find(filterObj, function(err, varToStoreResult) {
        if (varToStoreResult.length === 0) {
            res.render('template', {sounds: varToStoreResult, pagecount: req.session.views,zeromessage: "Aww, we don't currently have data to match your filtering options."});
        }
        else {
            res.render('template', {sounds: varToStoreResult, pagecount: req.session.views});
        }
    });
});

app.get('/sounds/add', (req, res) => {
    // console.log(`REQUEST SESSION: ${JSON.stringify(req.session, null, "\t")}\nREQUEST SESSION ID: ${JSON.stringify(req.session.id, null, "\t")}`); 
    
    res.render('template-add', {pagecount: req.session.views});
});

app.post('/sounds/add', (req, res) => {
    // console.log(`REQUEST SESSION: ${JSON.stringify(req.session, null, "\t")}\nREQUEST SESSION ID: ${JSON.stringify(req.session.id, null, "\t")}`);    
    
    // get the data
    const dataToAdd = req.body;
    dataToAdd['sessionID'] = res.session.id;
    // console.log(dataToAdd);
    
    // create a new sound & add the data to the db
    new Sound(dataToAdd).save(() => {
		res.redirect('/');
    });

});

app.get('/sounds/mine', (req, res) => {
    // show all the sounds stored in this session in the db
    Sound.find({'sessionID': req.session.id}, function(err, varToStoreResult) {
        if (varToStoreResult.length === 0) {
            res.render('template-mine', {sounds: varToStoreResult, pagecount: req.session.views, zeromessage: "Aww, it looks like you haven't contributed to our data yet."});
        }
        else {
            res.render('template-mine', {sounds: varToStoreResult, pagecount: req.session.views});
        }
    });
});

app.listen(3000);
console.log('Started server on port 3000');