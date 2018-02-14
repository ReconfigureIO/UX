import Ember from 'ember';

export default Ember.Route.extend({
  stripe: Ember.inject.service(),
  planType: null,
  model(params) {
    return Ember.RSVP.hash({
      billing: this.get('ajax').request('/user/payment-info').catch(function(error) {
        if (error.error == 'Not Found') {
          return true;
        }
      }),
      user: this.get('ajax').request('/user'),
      section: 'plan'
    });
  },
  setupController(controller, model) {
    this._super(...arguments);
    if(model.billing) {
      Ember.set(controller, 'billing', model.billing.value);
      Ember.set(controller, 'fullCard', '•••• •••• •••• '+model.billing.value.last4);
      Ember.set(controller, 'cvc', '•••');
    }
    Ember.set(controller, 'user', model.user.value);
    this.set('planType', model.user.value.billing_plan);
  },
  actions: {
    submitPaymentMethod: function() {
      var customer = this.get('customer');

      // obtain access to the injected service
      var stripe = this.get('stripe');

      var formCompleted = true;

      $('#billingInformation .field.required').each(function() {
        if($('input', this).val() === '') {
          $(this).addClass('error');
          formCompleted = false;
        } else {
          $(this).removeClass('error');
        }
      });

      // Check if all required fields are filled else submit the form
      if(!formCompleted) {
        Ember.$('.form-messages').addClass('error-message').fadeIn().html('<p>Please fill out all required fields.</p>');
      } else {
        // Disable submit button
        Ember.$('#billingInformation .actions .btn').addClass('disabled');

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

        return stripe.card.createToken(card).then(function(response) {
          // Set Stripe Token
          var params = {"token": response.id};

          // Pass stripe token to API to create a customer
          return that.get('ajax').request('/user/payment-info', {
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
          // Updated the plan type
          that.send('updatePlanType');
        })
        .catch(function(response) {
          // if there was an error retrieving the token you could get it here
          Intercom('trackEvent', 'sign up error', {
            type: 'credit-card'
          });

          // Enable submit button
          Ember.$('#billingInformation .actions .btn').removeClass('disabled');

          Ember.$('.form-messages').addClass('error-message').fadeIn().html(response.error.message).fadeIn();
        });
      }
    },
    setPlanType: function(type) {
      // Set button class and the plan type property
      this.set('planType', type);
      this.set('controller.model.section', 'billingInfo');
      Intercom('trackEvent', 'selected Plan', {
        plan: type
      });
    },
    updatePlanType: function() {
      // Update the plan type on the API
      var that = this;
      return this.get('ajax').put('/user', {
        data: {
          billing_plan: this.get('planType'),
        },
        contentType: "application/json"
      }).then(function(response) {
        // Add tracking event
        Intercom('trackEvent', 'signed up', {
          flow: 'require-card',
          plan: that.get('plan')
        });

        // Hide billing form
        Ember.$('.sign-up__form').fadeOut();

        // Show continue button
        $('.sign-up__continue').fadeIn();
      }).catch(function() {

      });
    }
  }
});
