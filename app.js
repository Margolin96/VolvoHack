'use strict';

const express = require('express');

const app = express();

require('./oauth/')(app);
require('./keepalive')(app);
require('./volvo/api')(app);
require('./alice/')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));