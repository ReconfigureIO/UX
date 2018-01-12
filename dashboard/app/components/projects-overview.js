import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    setTab: function(tab) {
      Ember.$('.projects-overview__stats__stat').removeClass('active');
      Ember.$('.projects-overview__stats__stat--'+tab).addClass('active');
      Ember.$('.projects-overview__content').removeClass('active');
      Ember.$('.projects-overview__content--'+tab).addClass('active');
    },
    toggleItem: function(index, item) {
      // Toggle header active class
      Ember.$('.projects-overview__content--'+item+' .table__header').removeClass('active');
      Ember.$('.projects-overview__content--'+item+' .table__header[data-id="'+index+'"]').addClass('active');

      // Toggle content active class
      Ember.$('.projects-overview__content--'+item+' .table__content').removeClass('active');
      Ember.$('.projects-overview__content--'+item+' .table__content[data-id="'+index+'"]').addClass('active');
    }
  }
});
