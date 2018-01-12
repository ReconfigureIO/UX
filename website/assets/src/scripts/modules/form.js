/* --------------------------------------------------------------
   Form
-------------------------------------------------------------- */
var form = {

  formContainer         : $('.form'),
  formActions           : $('.form--actions'),
  formMessages          : $('.form--ajax .form__messages'),
  ajaxForm              : $('.form--ajax'),
  selectContainer       : $('.select'),
  planTrigger           : $('.signup .plan-trigger'),
  billingForm           : $('#billingInformation'),
  termsTrigger          : $('#terms-trigger'),
  apiEndpoint           : 'https://api.reconfigure.io',

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Get user details
    if(window.location.pathname == '/sign-up/authenticate') {
      $.ajax({
        url: form.apiEndpoint + "/user",
        crossDomain: true,
        xhrFields: { withCredentials: true }
      }).done(function(data) {
        token = data['value']['token'];
        document.cookie = "token=" + token + ";path=/";

        window.location.href = '/sign-up/choose-plan';
      });
    }

    // Add select2 to dropdowns
    if(form.selectContainer.length) {
      form.selectContainer.select2({
        theme: "",
        minimumResultsForSearch: Infinity
      });
    }

    // Hide field labels
    $('.field', form.formActions).each(function() {
      form.hideLabel($(this));
    });

    // Ajax submit form
    form.ajaxForm.on('submit', function(event) {
      form.formSubmit($(this));
      event.preventDefault();
    });

    // Terms trigger action
    if(form.termsTrigger.length) {
      form.termsTrigger.on('click', function() {
        if($(this).is(':checked')) {
          $('.btn', form.billingForm).prop('disabled', false);
        } else {
          $('.btn', form.billingForm).prop('disabled', true);
        }
      });
    }

    // Trigger set billing info on billing information page
    if(window.location.pathname == '/sign-up/billing-information') {
      form.setBillingInfo();
    }

  },

  hideLabel: function(selector) {
    if($('input[type!="radio"], input[type!="checkbox"], input, textarea',  selector).val()) {
      $('input[type!="radio"], input[type!="checkbox"], input, textarea',  selector).addClass('has-content');
    } else {
      $('input[type!="radio"], input[type!="checkbox"], input, textarea',  selector).removeClass('has-content');
    }

    $('input[type!="radio"], input[type!="checkbox"], input, textarea',  selector).on('blur', function() {
      if($(this).val().length !== 0) {
        $(this).addClass('has-content');
      } else {
        $(this).removeClass('has-content');
      }
    });
  },

  setPlan: function() {

    var data = '{"billing_plan": "single-user"}';

    $.ajax({
      type: 'PUT',
      url: form.apiEndpoint + "/user",
      crossDomain: true,
      xhrFields: { withCredentials: true },
      data: data
    })
    .done(function() {
      // Send the user to the goal page
      window.location.href = window.location.hostname + '/sign-up/goal?source=billing-information';
    });

  },

  setBillingInfo: function() {

    // Create a Stripe client
    var stripe = Stripe('pk_live_7FZrMrqbWelJY5MrhuZHySCJ');

    // Create an instance of Elements
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '23px',
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
          color: '#161616'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    // Create an instance of the card Element
    var card = elements.create('card', {style: style, hidePostalCode: true});

    // Add an instance of the card Element into the `card-element` <div>
    card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    // Handle form submission
    form.billingForm.on('submit', function(event) {
      // Disable the submit button
      $('.btn', form.billingForm).prop('disabled', true).addClass('btn--disabled').text('Submitting...');

      // Create card from form
      var cardData = {
        name: $('#billingInformation input[name="card_name"]').val(),
        address_line1: $('#billingInformation input[name="billing_address_1"]').val(),
        address_line2: $('#billingInformation input[name="billing_address_2"]').val(),
        address_city: $('#billingInformation input[name="billing_city"]').val(),
        address_zip: $('#billingInformation input[name="billing_zip"]').val(),
        address_country: $('#billingInformation input[name="billing_country"]').val()
      };

      stripe.createToken(card, cardData).then(function(result) {
        if (result.error) {
          // Inform the user if there was an error
          form.formMessages.addClass('active');
          form.formMessages.addClass('error');
          form.formMessages.text('There was an error submitting your payment details, please try again.');
        } else {
          // Send the token to your server
          var params = {"token":result.id};

          // Pass stripe token to API to create a customer
          $.ajax({
            type: 'POST',
            url: form.apiEndpoint + "/user/payment-info",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(params),
            crossDomain: true,
            xhrFields: { withCredentials: true }
          })
          .then(function() {
            // Run set plan function
            form.setPlan();
          })
          .catch(function() {
            // Show the user an error message
            form.formMessages.addClass('active');
            form.formMessages.addClass('error');
            form.formMessages.text('There was an error submitting your payment details, please try again.');
          });
        }
      });

      // Stop the form submitting
      event.preventDefault();
    });

  },

  formSubmit: function(target) {
    // Serialize the form data.
    var formData = $(target).serialize();

    // Store button text
    var buttonText = $('.actions .btn', target).text();

    // Disable button
    $('.actions .btn', target).addClass('disabled').text('Loading...');

    $.ajax({
      type: 'POST',
      url: $(target).attr('action'),
      data: formData
    }).done(function(response) {
      // Make sure that the formMessages div has the 'success' class.
      form.formMessages.addClass('active');
      form.formMessages.removeClass('error');
      form.formMessages.addClass('success');

      // Set the message text.
      if(response.redirect) {
        // Send GA Goal
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'signUpAutomation'
        });

        // Redirect to dashboard
        window.location.replace(response.url);
      } else {
        // Hide the form
        $('.form__content').fadeOut();

        form.formMessages.text(response.text);
      }
    }).fail(function(data) {
      // Re-enable button
      $('.actions .btn', target).removeClass('disabled').text(buttonText);

      // Make sure that the formMessages div has the 'error' class.
      form.formMessages.addClass('active');
      form.formMessages.removeClass('success');
      form.formMessages.addClass('error');

      // Set the message text.
      if (data.responseText !== '') {
        form.formMessages.text(data.responseText);
      } else {
        form.formMessages.text('Oops! An error occured and your message could not be sent.');
      }
    });
  }

};
