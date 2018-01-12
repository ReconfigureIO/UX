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
  }
});
