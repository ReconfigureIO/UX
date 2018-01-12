/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('vendor/fonts/bill-corporate-narrow-bold-webfont.woff');
  app.import('vendor/fonts/bill-corporate-narrow-bold-webfont.woff2');
  app.import('vendor/fonts/bill-corporate-narrow-book-webfont.woff');
  app.import('vendor/fonts/bill-corporate-narrow-book-webfont.woff2');
  app.import('vendor/fonts/bill-corporate-narrow-roman-webfont.woff');
  app.import('vendor/fonts/bill-corporate-narrow-roman-webfont.woff2');
  app.import('vendor/fonts/bill-corporate-narrow-semibold-webfont.woff');
  app.import('vendor/fonts/bill-corporate-narrow-semibold-webfont.woff2');
  app.import('vendor/fonts/fontello.eot');
  app.import('vendor/fonts/fontello.woff2');
  app.import('vendor/fonts/fontello.woff');
  app.import('vendor/fonts/fontello.ttf');
  app.import('vendor/fonts/fontello.svg');
  app.import('vendor/js/se-v2.js');

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
