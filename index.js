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
  // .get('/', (req, res) => res.send('index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const bodyParser = require('body-parser');
const OAuthServer = require('express-oauth-server');

// auth
//   ?scope=yandex-home
//   &state=https%3A%2F%2Fsocial.yandex.ru%2Fbroker2%2Fauthz_in_web%2F10a7c327f0b04577a31b4f78b0091553%2Fcallback
//   &redirect_uri=https%3A%2F%2Fsocial.yandex.net%2Fbroker%2Fredirect
//   &response_type=code
//   &client_id=volvohack

app.oauth = new OAuthServer({
  model: {
    getClient(clientId, clientSecret) {
      console.log('getClient', clientId, clientSecret);

      if (clientId !== credentials.clientId) return;
      if (clientSecret !== credentials.clientSecret) return;

      return {
        clientId,
        redirectUris: ['https://social.yandex.net/broker/redirect'],
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

app.use('/auth', sniff);
app.use('/auth', app.oauth.authorize());

app.get('/token', (req, res) => {
  res.send('token');
});

app.get('/refresh', (req, res) => {
  res.send('refresh');
});

function sniff(req, res) {
  console.log('[sniff]', req, res);
}