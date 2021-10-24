require('dotenv').config();

const utils = require('../oauth/utils');
const request = require('request');
const mock = require('./mock.json');

module.exports.get = url => module.exports.call(url, 'GET');
module.exports.post = url => module.exports.call(url, 'POST');

module.exports.call = (url, method = 'get') => {
  console.log('mock', url, method);
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
  app.get('/state', (req, res) => {
    const { state } = require('../volvo/volvoApi');

    const fuelLevelPercent = Math.floor(state.fuelLevel / state.fuelTankCapacity * 100);
    const fuelLevel = `${state.fuelLevel} из ${state.fuelTankCapacity} (${fuelLevelPercent}%)`;
    let fuelLevelColor = '';
    switch (true) {
      case fuelLevelPercent < 15: fuelLevelColor = 'red'; break;
      case fuelLevelPercent < 40: fuelLevelColor = 'yellow'; break;
      default: fuelLevelColor = 'green';
    }
    const warnings = Object.keys(state.warnings).length;
    const _state = {
      fuelLevel: {
        value: fuelLevel,
        color: fuelLevelColor,
      },
      engineStarted: {
        value: state.engineStarted ? 'заведен' : 'выключен',
        color: state.engineStarted ? 'green' : 'gray',
      },
      outsideTemprature: {
        value: state.outsideTemprature,
        color: '',
      },
      locked: {
        value: state.locked ? 'закрыт' : 'открыт',
        color: state.locked ? 'green' : 'gray',
      },
      climatization: {
        value: state.climatization ? 'включен' : 'выключен',
        color: state.climatization ? 'green' : 'gray',
      },
      doorsOpened: {
        value: state.doorsOpened ? 'открыты' : 'закрыты',
        color: state.doorsOpened ? 'red' : 'green',
      },
      windowsOpened: {
        value: state.windowsOpened ? 'открыты' : 'закрыты',
        color: state.windowsOpened ? 'red' : 'green',
      },
      warnings: {
        value: warnings.length,
        color: warnings.length ? 'red' : 'grey',
      },
    };

    res.status(200).send(_state);
  });

  app.get('/volvo/*', async (req, res) => {
    const url = req.url.replace('/volvo', '');
    const method = req.method.toLowerCase();
    const data = req.body;

    res.send(process.env.mock
      ? module.exports.call(url, method, data)
      : await module.exports.api(url, method, data));
  });

  app.get('/addFuel', async (req, res) => {
    const { addFuel } = require('./volvoApi');
    addFuel();
    res.status(200).send();
  });
  app.get('/subtractFuel', async (req, res) => {
    const { subtractFuel } = require('./volvoApi');
    subtractFuel();
    res.status(200).send();
  });
  app.get('/engineOn', async (req, res) => {
    const { startEngine } = require('./volvoApi');
    startEngine();
    res.status(200).send();
  });
  app.get('/engineOff', async (req, res) => {
    const { stopEngine } = require('./volvoApi');
    stopEngine();
    res.status(200).send();
  });
  app.get('/lockOn', async (req, res) => {
    const { lockVehicle } = require('./volvoApi');
    lockVehicle();
    res.status(200).send();
  });
  app.get('/lockOff', async (req, res) => {
    const { unlockVehicle } = require('./volvoApi');
    unlockVehicle();
    res.status(200).send();
  });
  app.get('/climateOn', async (req, res) => {
    const { turnOnClimatization } = require('./volvoApi');
    turnOnClimatization();
    res.status(200).send();
  });
  app.get('/climateOff', async (req, res) => {
    const { turnOffClimatization } = require('./volvoApi');
    turnOffClimatization();
    res.status(200).send();
  });
  app.get('/doorOpen', async (req, res) => {
    const { doorOpen } = require('./volvoApi');
    doorOpen();
    res.status(200).send();
  });
  app.get('/doorClose', async (req, res) => {
    const { doorClose } = require('./volvoApi');
    doorClose();
    res.status(200).send();
  });
  app.get('/windowOpen', async (req, res) => {
    const { windowOpen } = require('./volvoApi');
    windowOpen();
    res.status(200).send();
  });
  app.get('/windowClose', async (req, res) => {
    const { windowClose } = require('./volvoApi');
    windowClose();
    res.status(200).send();
  });
};
