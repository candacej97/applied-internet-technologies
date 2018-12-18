const mongoose = require('mongoose');

// schema
const soundSchema = new mongoose.Schema({
    what: String,
    where: String,
    date: {
        type: String,
        match: /[0-9]{4}-[0-9]{2}-[0-9]{2}/,
    }, // YYYY-MM-DD
    hour: {
        type: Number,
        min: 0,
        max: 23
    }, // EST
    desc: String,
    sessionID: String
});

mongoose.model('Sound', soundSchema);

mongoose.connect("mongodb://localhost/hw05", { useNewUrlParser: true });
