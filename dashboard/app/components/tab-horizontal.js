import Ember from 'ember';

export default Ember.Component.extend({
  currentTab: 1,
  init: function() {
    this._super(...arguments);
  },
  actions: {
    setTab: function(tabId) {
      this.set('currentTab', tabId);
    }
  }
});
