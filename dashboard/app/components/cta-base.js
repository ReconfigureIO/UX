import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    close() {
      this.set('isVisible', false);
    }
  }
});
