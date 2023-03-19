import express from 'express';
import dotenv from 'dotenv';
import basicAuth from 'express-basic-auth';

import getWatherData from './getWeatherData';
import getWeatherMapImage from './getWeatherMapImage';
import Stats from './stats';
import { MapSize } from './types';

dotenv.config();

const app = express();
const port = process.env.PORT || '4000';
const stats = new Stats();

app.set('view engine', 'pug')
app.set('views', './page')

app.get('/', (req, res) => {
  res.render('index')
});

app.use('/assets', stats.collect('Homepage', false, 2), express.static('./page/assets'));

app.get('/map/:size.gif', stats.collect('Map Pic', true, 2), (req, res) => {
  if (['small', 'regular'].includes(req.params.size)) {
    getWatherData()
      .then(data => {
        return getWeatherMapImage((req.params.size as MapSize), data)
      })
      .then(imageBuffer => {
        res.writeHead(200, {
          'Content-Type': 'image/gif',
          'Content-Length': imageBuffer.length
        });
        res.end(imageBuffer);
      });
  } else {
    res.status(404);
    res.end();
  }
});


app.get(process.env.STATS_PATH || '/stats', basicAuth({users: { [process.env.STATS_USER || 'stats']: process.env.STATS_PASS || 'password' }, challenge: true}), (req, res) => {
  res.render('stats', {stats: stats.getData()});
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
