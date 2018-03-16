import Ember from 'ember';

export default Ember.Route.extend({
  stripe: Ember.inject.service(),
  planType: null,
  model(params) {
    return Ember.RSVP.hash({
      user: this.get('ajax').request('/user').catch(function(error) {
        if (error.error == 'Not Found') {
          return false;
        }
      }),
      section: 'goals'
    });
  },
  setupController(controller, model) {
    this._super(...arguments);
    Ember.set(controller, 'user', model.user.value);
    this.set('planType', model.user.value.billing_plan);
  },
  actions: {
    updateUser: function(id) {
      // Update API
      this.get('ajax').put('/user', {
        data: {
          main_goal: Ember.$('input[name="main_goal"]').val(),
          company: Ember.$('input[name="organisation"]').val(),
          employees: Ember.$('input[name="how_many"]').val(),
          market_verticals: Ember.$('input[name="market_vertical"]').val(),
        },
        contentType: "application/json"
      }).then(function() {
        // Add tracking event
        Intercom('trackEvent', 'Updated Personal Details');
      }).catch(function() {

      });
    },
    submitUserGoals: function(id) {
      var that = this;
      that.send('updateUser', 'id');
      // Hide billing form
      Ember.$('.sign-up__goals').fadeOut();

      this.transitionTo('/sign-up/installation');
    },
  }
});
