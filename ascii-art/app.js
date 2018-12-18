const express = require('express');
const app = express();
const path = require("path");

// serve static files
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

const allArt = [
    {
        title: 'rose',
        date: '2018-09-29',
        artwork: `@-->--->---`,
        tags: ['flower']
    },
    {
        title: 'darth vader',
        date: '2017-06-17',
        artwork: `     .-.\n     |_:_|\n     /(_Y_)\\\n     (_\\/M\\/_)\n      /.'-'.\\\n     //|[_]|\\\\\n     \\\\|   |//\n      #|===|\\#\n     / |\\ /I \\\n     /_ | | I _\\\n      |_|_| `,
        tags: ['movie', 'villain']
    },
    {
        title: 'wsq park',
        date: '2018-09-29',
        artwork: ` _______________\n |~|_________|~|\n |::::\\^o^/::::|\n ---------------\n |..|/     \\|..|\n ----       ----\n |  |       |  |\n |  |       |  |\n |  |       |  |\n .|__|.     .|__|.`,
        tags: ['architecture', 'public']
    }
];

// set up handlebars
app.set('view engine', 'hbs');

// parses the http req body and creates a prop on the req object called body
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {

    // log out the request received
    console.log(`REQUEST METHOD: ${req.method}\nREQUEST PATH: ${req.path}\nREQUEST QUERY STRING: ${JSON.stringify(req.query, null, "\t")}\nREQUEST BODY: ${JSON.stringify(req.body, null, " ")}\n`);

    let filtered = allArt.filter((art) => { return art.tags.includes(req.query.tag) == true });

    const artToShow = filtered.length > 0 ? filtered : allArt;

    res.render('template', {artwork: artToShow.reverse()});

});

// route for the add page
app.get('/add', (req, res) => {

    // log out the request received
    console.log(`REQUEST METHOD: ${req.method}\nREQUEST PATH: ${req.path}\nREQUEST QUERY STRING: ${JSON.stringify(req.query, null, "\t")}\nREQUEST BODY: ${JSON.stringify(req.body, null, " ")}\n`);

    res.render('template-add');
});

app.post('/add', (req, res) => {

    // log out the request received
    console.log(`REQUEST METHOD: ${req.method}\nREQUEST PATH: ${req.path}\nREQUEST QUERY STRING: ${JSON.stringify(req.query, null, "\t")}\nREQUEST BODY: ${JSON.stringify(req.body, null, " ")}\n`);

    const {title, date, tags, artwork} = req.body;
    const obj = {title, date, tags, artwork};
    obj.tags = obj.tags.split(' ');
    obj.artwork += ``;
    allArt.push(obj);

    res.redirect('/');
});

app.listen(3000);
console.log('Started server on port 3000');

// Do we need to know how to make regular strings into templated strings?