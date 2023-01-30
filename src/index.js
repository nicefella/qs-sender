/* eslint-disable no-underscore-dangle */
const express = require('express');
const api = require('./api/app');

const app = express();

if (process.env.NOBL_ENV === 'production') app.enable('trust proxy');


app.use(express.static('assets'));

app.use('/api', api);

// Setup server
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
