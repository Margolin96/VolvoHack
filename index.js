const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

const credentials = {
  clientId: 'volvohack',
  clientSecret: 'TtLy5iPbB3jdXR29pUfeuMfPgfC4wznQ'
};

app
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const bodyParser = require('body-parser');
const OAuthServer = require('express-oauth-server');

app.oauth = new OAuthServer({
  model: {
    getClient(clientId, clientSecret) {
      if (clientId !== credentials.clientId) return;
      if (clientSecret !== credentials.clientSecret) return;

      return {
        id: clientId,
        redirectUris: ['https://localhost:5001'],
        grants: ['authorization_code']
      };
    },
    saveAuthorizationCode() {
      console.log('saveAuthorizationCode');
    },
    getAccessToken() {
      console.log('getAccessToken');
    }
  }
});

app.get('/auth', (req, res) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(app.oauth.authorize());

  app.use(function(req, res) {
    res.send('Secret area');
  });
});

app.get('/token', (req, res) => {
  res.send('token');
});

app.get('/refresh', (req, res) => {
  res.send('refresh');
})