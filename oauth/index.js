const express = require('express');
const bodyParser = require('body-parser');
const client = require('./client');
const cookieParser = require('cookie-parser');
const config = require('../config');
const db = require('./db');
const expressSession = require('express-session');
const oauth2 = require('./oauth2');
const passport = require('passport');
const site = require('./site');
const token = require('./token');
const user = require('./user');

const MemoryStore = expressSession.MemoryStore;

module.exports = (app) => {
  require('dotenv').config();

  // Express configuration
  app.set('view engine', 'ejs');
  app.use(cookieParser());

  // Session Configuration
  app.use(expressSession({
    saveUninitialized: true,
    resave: true,
    secret: config.session.secret,
    store: new MemoryStore(),
    key: 'authorization.sid',
    cookie: { maxAge: config.session.maxAge },
  }));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  require('./auth');

  app.get('/', site.index);
  app.get('/login', site.loginForm);
  app.post('/login', site.login);
  app.get('/logout', site.logout);
  app.get('/account', site.account);

  app.get('/dialog/authorize', oauth2.authorization);
  app.post('/dialog/authorize/decision', oauth2.decision);
  app.post('/oauth/token', oauth2.token);

  app.get('/api/userinfo', user.info);
  app.get('/api/clientinfo', client.info);

  // Mimicking google's token info endpoint from
  // https://developers.google.com/accounts/docs/OAuth2UserAgent#validatetoken
  app.get('/api/tokeninfo', token.info);

  // Mimicking google's token revoke endpoint from
  // https://developers.google.com/identity/protocols/OAuth2WebServer
  app.get('/api/revoke', token.revoke);

  // Catch all for error messages.  Instead of a stack
  // trace, this will log the json of the error message
  // to the browser and pass along the status with it
  app.use((err, req, res, next) => {
    if (err) {
      if (err.status == null) {
        console.error('Internal unexpected error from:', err.stack);
        res.status(500);
        res.json(err);
      } else {
        res.status(err.status);
        res.json(err);
      }
    } else {
      next();
    }
  });

  // From time to time we need to clean up any expired tokens
  // in the database
  setInterval(() => {
    db.accessTokens.removeExpired()
      .catch(err => console.error('Error trying to remove expired tokens:', err.stack));
  }, config.db.timeToCheckExpiredTokens * 1000);
};
