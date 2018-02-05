import Ember from 'ember';

export default Ember.Component.extend({
  init: function() {
    this._super(...arguments);
    new Clipboard('.btn');
  },
  actions: {
    toggleKey: function() {
      if(Ember.$('.api-key__container__key').attr('type') == 'password') {
        Ember.$('.api-key__container__key').attr('type', 'text');
      } else {
        Ember.$('.api-key__container__key').attr('type', 'password');
      }
      Ember.$('.api-key__container__trigger').text(function(i, text){
        return text === "Show API key" ? "Hide API key" : "Show API key";
      });
      Ember.$('.api-key__container__copy').toggleClass('active');
    }
  }
});
