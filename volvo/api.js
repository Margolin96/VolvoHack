require('dotenv').config();

const utils = require('../oauth/utils');
const request = require('request');
const mock = require('./mock.json');

module.exports.get = url => module.exports.call(url, 'GET');
module.exports.post = url => module.exports.call(url, 'POST');

module.exports.call = (url, method = 'get') => {
  const _method = method.toLowerCase();

  if (!(url in mock.paths)) throw new Error('No such url');
  if (!(_method in mock.paths[url])) throw new Error('No such method');

  const responses = mock.paths[url][_method].responses['200'].content;
  return Object.entries(responses)[0][1].example.data;
};

module.exports.api = async (url, method = 'get', data) => {
  const volvoReq = {
    method,
    form: data,
    uri: `https://api.volvocars.com/connected-vehicle/${url}`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Expose-Headers': '*',
      'Content-type': 'application/json',
      Authorization: `Bearer ${utils.createToken()}`,
    },
  };

  return new Promise((resolve, reject) => {
    request(volvoReq, (error, response) => {
      if (error) {
        console.log(method, error);
        reject(error);
      }
      console.log(method, response.body);
      resolve(response.body.data);
    });
  });
};

module.exports.routes = (app) => {
  app.get('/volvo/*', async (req, res) => {
    const url = req.url.replace('/volvo', '');
    const method = req.method.toLowerCase();
    const data = req.body;

    res.send(process.env.mock
      ? module.exports.call(url, method, data)
      : await module.exports.api(url, method, data));
  });
};
