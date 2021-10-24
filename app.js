'use strict';

const express = require('express');
const path = require('path');

const app = express();

// static resources for stylesheets, images, javascript files
app.use('/static', express.static(path.join(__dirname, 'public')));

require('./oauth/')(app);
require('./keepalive')(app);
require('./volvo/api').routes(app);
require('./alice/')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
