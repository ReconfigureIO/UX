import Ember from 'ember';

export default Ember.Component.extend({
  ajax: Ember.inject.service(),
  actions: {
    showMainNav: function() {
      Ember.$(".sidebar__main__content").toggleClass('active');
      Ember.$(".sidebar__secondary").toggleClass('mobile-show');

      Ember.$('.sidebar nav a').on('click', function() {
        Ember.$('.sidebar__main__content').removeClass('active');
        Ember.$('.sidebar__secondary').removeClass('mobile-show');
      });
    },
    showSubNav: function() {
      Ember.$(".sidebar__secondary").toggleClass('active');
    }
  }
});
