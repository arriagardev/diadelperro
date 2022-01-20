const config = require("./config");
const Twitter = require("twitter");
const base64 = require("node-base64-image");
const greetings = require("./saludos");

const client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token_key: config.access_token_key,
    access_token_secret: config.access_token_secret,
});

// Get a random dog using Dog API
function getDog(result) {
    const https = require("https");
    const url = 'https://dog.ceo/api/breeds/image/random';

    https.get(url, function(res) {
        body = '';
        res.on('data', function(chunk) {
            body += chunk;
        })
        res.on('end', encodeImage)
    });
}

// Encode image to base64
function encodeImage(result) {
    const imageURL = JSON.parse(body).message;
    base64.encode(imageURL, {
        string: true
    }, postImage);
}

// Post image to twitter
function postImage(error, image) {
    if (error) {
        console.log(error);
    }
    client.post('media/upload', {
        media_data: image
    }, getTweet);
}

// Select tweet text from array
function getTweet(error, media, result) {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    if (!error) {
        // Tweet
        const status = {
            status: greeting,
            media_ids: media.media_id_string, // Pass the media id string
        }
        client.post('statuses/update', status, function(error, result) {
            if (error) {
                console.log(error);
            }
        });
    }
}
