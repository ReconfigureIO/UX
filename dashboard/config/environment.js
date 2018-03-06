/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'reconfigure',
    environment: environment,
    baseURL: '/',
    apiURL: '',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    contentSecurityPolicy: {
      'connect-src': [
        '*',
        'https://api.reconfigure.io',
        'ws://local.reconfigure.io:49152/livereload',
        'https://api-iam.intercom.io',
        'https://api-ping.intercom.io',
        'https://nexus-websocket-a.intercom.io',
        'https://nexus-websocket-b.intercom.io',
        'wss://nexus-websocket-a.intercom.io',
        'wss://nexus-websocket-b.intercom.io'].join(' '),
      'img-src': [
        'data:',
        'http://localhost:4200',
        'http://local.reconfigure.io:4200',
        'https://static.intercomcdn.com',
        'https://js.intercomcdn.com'].join(' '),
      'frame-src' : [
        'https://js.stripe.com',
      ],
      'default-src': [
        '*',
        'http://localhost:4200',
        'http://local.reconfigure.io:4200'
      ],
      'script-src': [
        '*',
        'http://localhost:4200',
        'http://localhost:49154',
        'http://local.reconfigure.io:4200',
        'http://local.reconfigure.io:49154',
        'https://js.stripe.com',
        'https://widget.intercom.io',
        'https://js.intercomcdn.com'].join(' '),
      'media-src': [
        'https://js.intercomcdn.com'].join(' '),
      'font-src': [
        '*'
      ],
      'style-src': [
        'http://localhost:4200',
        'http://local.reconfigure.io:4200',
        '\'unsafe-inline\''].join(' ')
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    if(process.env.BASE_URL) {
      ENV.baseURL = process.env.BASE_URL;
    }
    ENV.contentSecurityPolicy = {
      'connect-src': [
        '*',
        'https://api.reconfigure.io',
        'ws://local.reconfigure.io:49152/livereload',
        'https://api-iam.intercom.io',
        'https://api-ping.intercom.io',
        'https://nexus-websocket-a.intercom.io',
        'https://nexus-websocket-b.intercom.io',
        'wss://nexus-websocket-a.intercom.io',
        'wss://nexus-websocket-b.intercom.io'].join(' '),
      'img-src': [
        'data:',
        'http://localhost:4200',
        'http://local.reconfigure.io:4200',
        'https://d10lpsik1i8c69.cloudfront.net',
        'https://static.intercomcdn.com',
        'https://js.intercomcdn.com'].join(' '),
      'frame-src' : [
        'https://js.stripe.com',
      ],
      'default-src': [
        '*',
        'http://localhost:4200',
        'http://local.reconfigure.io:4200'
      ],
      'script-src': [
        '*',
        'http://localhost:4200',
        '\'unsafe-inline\'',
        'https://d10lpsik1i8c69.cloudfront.net',
        'http://localhost:49154',
        'http://local.reconfigure.io:4200',
        'http://local.reconfigure.io:49154',
        'https://js.stripe.com',
        'https://widget.intercom.io',
        'https://js.intercomcdn.com'].join(' '),
      'media-src': [
        'https://js.intercomcdn.com'].join(' '),
      'font-src': [
        '*'
      ],
      'style-src': [
        'http://localhost:4200',
        'https://d10lpsik1i8c69.cloudfront.net',
        'http://local.reconfigure.io:4200',
        '\'unsafe-inline\''].join(' ')
    },
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.apiURL = 'http://localhost:8080';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  // STRIPE
  ENV.stripe = {
    publishableKey: 'pk_test_OHUfyQNHtSkzZLtkpwxew3rj'
  };


  if (environment === 'production') {
    ENV.apiURL = 'https://api.reconfigure.io';
    ENV.stripe.publishableKey = 'pk_live_7FZrMrqbWelJY5MrhuZHySCJ';
  }

  return ENV;
};
