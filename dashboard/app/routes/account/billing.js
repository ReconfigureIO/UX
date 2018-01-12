import Ember from 'ember';

export default Ember.Route.extend({
  stripe: Ember.inject.service(),
  model(params) {
    return Ember.RSVP.hash({
      billing: this.get('ajax').request('/user/payment-info').catch(function(error) {
        if (error.error == 'Not Found') {
          return true;
        }
      })
    });
  },
  setupController(controller, model) {
    this._super(...arguments);
    if(model.billing) {
      Ember.set(controller, 'billing', model.billing.value);
      Ember.set(controller, 'fullCard', '•••• •••• •••• '+model.billing.value.last4);
      Ember.set(controller, 'cvc', '•••');
    }
  },
  actions: {
    submitPaymentMethod: function() {
      var customer = this.get('customer');

      // obtain access to the injected service
      var stripe = this.get('stripe');

      // Create card from form
      var card = {
        name: Ember.$('#billingInformation input[name="cardName"]').val(),
        number: Ember.$('#billingInformation input[name="cardNumber"]').val(),
        exp_month: Ember.$('#billingInformation input[name="cardExpiryMonth"]').val(),
        exp_year: Ember.$('#billingInformation input[name="cardExpiryYear"]').val(),
        cvc: Ember.$('#billingInformation input[name="cardCvc"]').val(),
        address_line1: Ember.$('#billingInformation input[name="addressLine1"]').val(),
        address_line2: Ember.$('#billingInformation input[name="addressLine2"]').val(),
        address_city: Ember.$('#billingInformation input[name="addressCity"]').val(),
        address_zip: Ember.$('#billingInformation input[name="addressZip"]').val(),
        address_country: Ember.$('#billingInformation input[name="addressCountry"]').val()
      };

      var that = this;

      // TO-DO: Pass options to create token endpoint
      return stripe.card.createToken(card).then(function(response) {
        // Set Stripe Token
        var params = {"token":response.id};

        // Pass stripe token to API to create a customer
        that.get('ajax').request('/user/payment-info', {
          method: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(params),
          xhrFields: {
            withCredentials: true
          }
        });
      })
      .then(function(response) {
        // Add tracking event
        Intercom('trackEvent', 'Updated Billing Details');
        Ember.$('#billingInformation .form-messages').removeClass('error-message').html('Thankyou. We have updated your Billing Information.').fadeIn();
      })
      .catch(function(response) {
        // if there was an error retrieving the token you could get it here
        Ember.$('#billingInformation .form-messages').addClass('error-message').html(response.error.message).fadeIn();
      });
    }
  }
});
