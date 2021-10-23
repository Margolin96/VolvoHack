// const utils = require('../oauth/utils');
// const request = require('request');

const mock = require('./mock.json');

module.exports.call = (url, method = 'get') => {
  const _method = method.toLowerCase();

  if (!(url in mock.paths)) throw new Error('No such url');
  if (!(_method in mock.paths[url])) throw new Error('No such method');

  const responses = mock.paths[url][_method].responses['200'].content;
  return Object.entries(responses)[0][1].example.data;
};

module.exports.routes = (app) => {
  app.get('/volvo/*', (req, res) => {
    const url = req.url.replace('/volvo', '');
    const method = req.method.toLowerCase();

    res.send(module.exports.call(url, method, req.body));

    /*
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
    */
  });
};
