import Ember from 'ember';

export default Ember.Component.extend({
  init: function() {
    this._super(...arguments);
    this.hideLabel(this);
  },
  hideLabel: function(selector) {
    if($('input[type!="radio"], input[type!="checkbox"], input, textarea', selector).val()) {
      $('input[type!="radio"], input[type!="checkbox"], input, textarea', selector).addClass('has-content');
    } else {
      $('input[type!="radio"], input[type!="checkbox"], input, textarea', selector).removeClass('has-content');
    }

    $('input[type!="radio"], input[type!="checkbox"], input, textarea', selector).on('blur', function() {
      if($(this).val().length !== 0) {
        $(this).addClass('has-content');
      } else {
        $(this).removeClass('has-content');
      }
    });
  }
});
