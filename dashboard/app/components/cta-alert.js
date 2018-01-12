import Ember from 'ember';

export default Ember.Component.extend({
  isVisible: true,
  notifications: '',
  getNotifications: function() {
    var that = this;
    var sp = new StatusPage.page({ page: '8d80qh0jc9m6'});

    sp.summary({
      success: function(data) {
        if(data.incidents.length) {
          that.set('notifications', data.incidents);
        }
      }
    });
  }.on('init'),
  actions: {
    close() {
      this.set('isVisible', false);
    }
  }
});
