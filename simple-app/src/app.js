// app.js

const webby = require('./webby.js');

const HOST = '127.0.0.1';
const PORT = 3000;

// create a web application
const app = new webby.App();

// add a main route
app.get('/', (req, res) => {
    // respond with a page that links to /gallery
    res.status(200).set("Content-Type", "text/html");
    res.send('<html><head><meta charset="utf-8"><title>ccj286 HW #3</title><link rel="stylesheet" href="/css/styles.css"></head><body><h1>Blue Nose Pitbulls</h1><br><a href="/gallery">bow wow wow yippy yo yippy yay <span>🐕<span></a></body></html>');
});

// route to random animal pictures at /gallery
app.get('/gallery', (req, res) => {
    // there should be 1 to 4 images displayed
    const limit = Math.floor((Math.random() * 4) + 1);
    let imagesHTML = ``;

    res.status(200);
    res.set("Content-Type", "text/html");

    for (let i = 1; i <= limit; i++) {
        const currentNum = Math.floor((Math.random() * limit) + 1);
        imagesHTML += `<img src='/img/animal${currentNum}.jpg' alt='pitbull picture #${currentNum}'>`;
    }

    res.send(`<html><head><title>ccj286 HW #3</title><link rel="stylesheet" href="/css/styles.css"></head><body><h1>Look at ${limit} Blue Nose Pitbulls</h1> <br> ${imagesHTML}</body></html>`);

});

// route redirects /pics to /gallery
app.get('/pics', (req, res) => {
    res.status(300);
    res.set("Content-Type", "text/html");
    res.send('<head><meta http-equiv="refresh" content="0; URL=/gallery" /></head>');
});

// route to stylesheet
app.get('/css/styles.css', webby.static('public/'));

// route to animal1
app.get('/img/animal1.jpg', webby.static('public/'));

// route to animal2
app.get('/img/animal2.jpg', webby.static('public/'));

// route to animal3
app.get('/img/animal3.jpg', webby.static('public/'));

// route to animal4
app.get('/img/animal4.jpg', webby.static('public/'));

app.listen(PORT, HOST);