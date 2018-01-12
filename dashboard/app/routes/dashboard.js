import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      user: this.get('ajax').request('/user'),
      hoursRemaining: this.get('ajax').request('/user/hours-remaining'),
      projects: this.get('ajax').request('/projects'),
      builds: this.get('ajax').request('/builds')
      // deployments: this.get('ajax').request('/deployments')
    });
  },
  setupController(controller, model) {
    this._super(...arguments);
    Ember.set(controller, 'projects', model.projects);
    Ember.set(controller, 'builds', model.builds);
    Ember.set(controller, 'hoursRemaining', model.hoursRemaining.value);
    // Ember.set(controller, 'deployments', model.deployments);
    Ember.set(controller, 'key', model.user.value.token);
  }
});
