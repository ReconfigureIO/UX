import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),
  billing_plan: function() {
    return this.get('user.billing_plan');
  }.property('user.billing_plan'),
  show_alert: false,
  actions: {
    updatePlan: function(type) {
      var that = this;

      this.get('ajax').put('/user', {
        data: {
          billing_plan: type,
        },
        contentType: "application/json"
      }).then(function(response) {
        // Track event in intercom
        Intercom('trackEvent', 'Changed Billing Plan');

        // Set billing plan
        that.set('billing_plan', type);

        // Show alert banner
        that.set('show_alert', true);
      }).catch(function() {

      });
    }
  }
});
