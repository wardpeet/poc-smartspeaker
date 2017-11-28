const playVideo = require('./client');
const express = require('express');
const r2 = require('r2');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('static'));
app.use(bodyParser.json());

const videoIndex = new Map();
app.all('/json', (req, res) => {
    let url = req.query.file;
    let index = req.query.index || 0;

    if (url) {
        r2(url).json.then(data => {
            if (req.body && req.body.result) {
                const intent = req.body.result.metadata.intentName;
                const sessid = req.body.sessionId;

                if (!index) {
                    index = videoIndex.get(sessid) || 0;
                }

                if (intent === 'play video - next') {
                    index += 1;
                }

                if (data.videos.length <= index) {
                    index = 0;
                }

                videoIndex.set(sessid, index);
            }

            const { url, title } = data.videos[index];
            playVideo(url, () => {}, () => {}, title);
            success(res)(index + 1);
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
    return (msg) => res.json({
        speech: `Starting video ${msg}`,
    });
}

function error(res) {
    return err => res.json({
        speech: err.message,
    });
}

app.listen(3000, () => console.log('Running De Standaard Chromecast Server'));