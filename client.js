const HOSTORIGIN = process.env.DS_TVHUB ? `https://${process.env.DS_TVHUB}` : 'http://localhost:3000';

function playVideo(url, successCB, errorCB, title = 'unknown') {
    var Client = require('castv2-client').Client;
    var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
    var mdns = require('mdns');

    DefaultMediaReceiver.APP_ID = 'D8CDBF0A';
    console.log(`Trying to play ${title} (${url})`)

    var browser = mdns.createBrowser(mdns.tcp('googlecast'));

    browser.on('error', function(service) {
        console.log('down down down');
    })
    browser.on('serviceUp', function (service) {
        console.log('found device "%s" at %s:%d', service.name, service.addresses[0], service.port);
        ondeviceup(service.addresses[0]);
        browser.stop();
    });

    browser.start();

    function ondeviceup(host) {

        var client = new Client();

        client.connect(host, function () {
            console.log('connected, launching app ...');

            client.launch(DefaultMediaReceiver, function (err, player) {
                if (player === undefined) {
                    errorCB(new Error('player is undefiend'));
                    console.log('player undefined', err);
                    return;
                }

                var media = {
                    // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
                    contentId: url,
                    contentType: 'video/mp4',
                    streamType: 'BUFFERED', // or LIVE

                    // Title and cover displayed while buffering
                    metadata: {
                        type: 0,
                        metadataType: 0,
                        title,
                        images: [
                            { url: `${HOSTORIGIN}/dsopicture.jpg` }
                        ]
                    }
                };

                player.on('status', function (status) {
                    if (status) {
                        console.log('status broadcast playerState=%s', status.playerState);
                    }
                });

                console.log('app "%s" launched, loading media %s ...', player.session.displayName, media.contentId);

                player.load(media, { autoplay: true }, function (err, status) {
                    if (!err) {
                        successCB();
                    }
                    console.log('media loaded playerState=%s', status.playerState);
                });

            });

        });

        client.on('error', function (err) {
            errorCB(err);
            console.log('Error: %s', err.message);
            client.close();
        });

    }
}

module.exports = playVideo;