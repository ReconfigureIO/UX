import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('account', function() {
    this.route('details');
    this.route('billing');
  });
  this.route('pricing-plan');
  this.route('dashboard');
  this.route('help');
  this.route('sign-up');
});

export default Router;
