module.exports = (app) => {
  app.get('/alisa/v1.0', (req, res) => {
    console.log(req.query, req.body);
    res.status(200).send();
  });
  app.post('/alisa/v1.0/user/devices/action', async (req, res) => {
    const { setOnOffDevicesStates } = require('./aliceHome');
    res.status(200).send(await setOnOffDevicesStates(req.headers['x-request-id'], req.body));
  });
  app.post('/alisa/v1.0/user/devices/query', async (req, res) => {
    const { getDevicesState } = require('./aliceHome');
    res.status(200).send(await getDevicesState(req.headers['x-request-id'], req.body));
  });
  app.post('/alisa/v1.0/user/unlink', (req, res) => {
    console.log(req.query, req.body);
    res.status(200).send();
  });
  app.get('/alisa/v1.0/user/devices', async (req, res) => {
    const { getDevicesList } = require('./aliceHome');
    res.status(200).send(await getDevicesList(req.headers['x-request-id'], 'volvohack'));
  });
};
