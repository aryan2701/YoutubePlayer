// app.js

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const videoId = '42pHrNZ_8Dk';
const apiKey = 'AIzaSyDRxWLQwwjVELTrbiA6qi1HehgWeSlc0-g'; 

const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

app.get('/json', (req, res) => {
  axios.get(apiUrl)
    .then(response => {
      if (response.data.items && response.data.items.length > 0) {
        const videoTitle = response.data.items[0].snippet.title;
        const videoDescription = response.data.items[0].snippet.description;
        const videoThumbnail = response.data.items[0].snippet.thumbnails.default.url;

        res.json({
          title: videoTitle,
          description: videoDescription,
          thumbnail: videoThumbnail,
          videoId: videoId,
        });
      } else {
        console.error('Error: No video information found');
        res.status(500).send('Internal Server Error');
      }
    })
    .catch(error => {
      console.error('Error fetching video information', error);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/', (req, res) => {
  axios.get(apiUrl)
    .then(response => {
      const videoTitle = response.data.items[0].snippet.title;
      const videoDescription = response.data.items[0].snippet.description;

      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>YouTube Video App</title>
        </head>
        <body>
          <h1>${videoTitle}</h1>
          <p>${videoDescription}</p>
          <div id="player"></div>

          <script>
            // Load the YouTube iFrame API asynchronously
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            let player;
            function onYouTubeIframeAPIReady() {
              player = new YT.Player('player', {
                height: '360',
                width: '640',
                videoId: '${videoId}',
                events: {
                  'onReady': onPlayerReady,
                },
              });
            }

            function onPlayerReady(event) {
              event.target.playVideo();
            }
          </script>
        </body>
        </html>
      `);
    })
    .catch(error => {
      console.error('Error fetching video information', error);
      res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
