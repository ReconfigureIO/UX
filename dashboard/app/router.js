import Ember from 'ember';
import config from './config/environment';
import RouterScroll from 'ember-router-scroll';

const Router = Ember.Router.extend(
  RouterScroll,
  {
    location: config.locationType
  }
);

Router.map(function() {
  this.route('account', function() {
    this.route('details');
    this.route('billing');
  });
  this.route('pricing-plan');
  this.route('dashboard');
  this.route('help');
  this.route('sign-up', function() {
    this.route('choose-plan');
    this.route('goal');
    this.route('installation');
    this.route('auth');
    this.route('getting-started');
  });
});

export default Router;
