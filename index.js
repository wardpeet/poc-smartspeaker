const playVideo = require('./client');
const express = require('express');
const r2 = require('r2');
const app = express();

app.use(express.static('static'));

app.all('/json', (req, res) => {
    let url = req.query.file;
    let index = req.query.index || 0;
    if (url) {
        r2(url).json.then(data => {
            const { url, title } = data.videos[index];
            playVideo(url, () => {}, () => {}, title);
            success(res)();
        });
    } else {
        res.send('No video file given');
    }
});

app.all('/video', (req, res) => {
    let url = req.query.url;
    if (url) {
        playVideo(url, success(res), error(res));
    } else {
        res.send('No video url given');
    }
});

function success(res) {
    return () => res.json({
        speech: 'Starting video',
    });
}

function error(res) {
    return err => res.json({
        speech: err.message,
    });
}

app.listen(3000, () => console.log('Running De Standaard Chromecast Server'));