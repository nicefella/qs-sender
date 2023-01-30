// const corsMiddleware = require('restify-cors-middleware');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const notify = require('./v2/notify');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.options('*', cors());

app.use(bodyParser.json());

app.post('/v2/notify', notify.post);
app.get('/v2/notify', notify.get);

module.exports = app;
