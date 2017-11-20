const playVideo = require('./client');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    let url = req.query.url;
    playVideo(url);
    res.send({success:true});
});

app.listen(3000, () => console.log('Running De Standaard Chromecast Server'));