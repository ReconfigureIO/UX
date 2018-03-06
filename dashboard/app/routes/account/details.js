import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      user: this.get('ajax').request('/user')
    });
  },
  setupController(controller, model) {
    this._super(...arguments);
    Ember.set(controller, 'user', model.user.value);
  },
  actions: {
    updateUser: function(id) {
      // Update Intercom
      window.Intercom('update', {
        user_id: id,
        name: Ember.$('input[name="fullName"]').val(),
        email: Ember.$('input[name="emailAddress"]').val(),
        phone: Ember.$('input[name="phone"]').val(),
        "company": Ember.$('input[name="company"]').val()
      });

      // Update API
      this.get('ajax').put('/user', {
        data: {
          name: Ember.$('input[name="fullName"]').val(),
          email: Ember.$('input[name="emailAddress"]').val(),
          phone_number: Ember.$('input[name="phone"]').val(),
          company: Ember.$('input[name="company"]').val()
        },
        contentType: "application/json"
      }).then(function(response) {
        // Add callback message
        Ember.$('#personalDetails .form-messages').addClass('success-message').html('Thankyou. We have updated your Personal Details.').fadeIn();

        // Add tracking event
        Intercom('trackEvent', 'Updated Personal Details');
      }).catch(function() {

      });
    }
  }
});
