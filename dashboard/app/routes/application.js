import Ember from 'ember';
import {isAjaxError, isNotFoundError, isForbiddenError} from 'ember-ajax/errors';

export default Ember.Route.extend({
  beforeModel() {
    var that = this;

    // Check if user is logged in by pinging one of the endpoints on the api
    this.get('ajax').request('/projects').catch(function(error) {
      if(isForbiddenError(error)) {
        that.transitionTo('index');
        return true;
      }
    });
  },
  setCurrentUser: function() {
    var that = this;
    this.get('ajax').request('/user').then(function(response) {
      window.Intercom('boot', {
         app_id: 'do6j5zjy',
         email: response.value.email,
         user_id: response.value.id,
         created_at: response.value.created_at,
      });
      
      // SJ - Added lucky orange data
      var customData = {
        'name' : response.value.name,
        'email' : response.value.email
      };
      window._loq = window._loq || [];
      window._loq.push(['custom', customData]);
    });
  }.on('init'),
  actions: {
    logout() {
      // Clear intercom session
      Intercom('shutdown');

      var that = this;
      this.get('ajax').request('/oauth/logout').then(function(response) {
        that.transitionTo('index');
      });
    }
  }
});
