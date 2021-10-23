const request = require('request');

setInterval(() => {
  request({
    uri: 'https://volvohack.herokuapp.com/wakeup-bro',
    method: 'GET',
  }, (error, response) => {
    console.log(error, response.body);
  });
}, 10 * 60 * 1000);

module.exports = (app) => {
  app.get('/wakeup-bro', (req, res) => {
    console.log('[keepalive]: Thanks Bro!');
    res.send('I\'m OK!');
  });
};
