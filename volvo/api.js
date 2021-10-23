const utils = require('../oauth/utils');
const request = require('request');

module.exports = (app) => {
  app.get('/volvo/*', (req, res) => {
    const methodUrl = req.url.replace('/volvo/', '');
    const volvoReq = {
      method: req.method,
      form: req.body,
      uri: `https://api.volvocars.com/connected-vehicle/${methodUrl}`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Expose-Headers': '*',
        'Content-type': 'application/json',
        Authorization: `Bearer ${utils.createToken()}`,
      },
    };

    request(volvoReq, (error, response) => {
      if (error) {
        console.log(methodUrl, error);
        res.send(error);
      }
      console.log(methodUrl, response.body);
      res.send(response.body);
    });
  });
};
