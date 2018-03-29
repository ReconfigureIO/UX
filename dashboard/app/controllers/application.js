import Ember from 'ember';

export default Ember.Controller.extend({
  isIndex: Ember.computed('currentRouteName',function(){
    if(this.get('currentRouteName') === 'index' || 'sign-up/installation'){
      return true;
    }
    return false;
  }),
  hideSideBar: Ember.computed('currentRouteName',function(){
    if(this.get('currentRouteName') === 'index' || 'sign-up/*'){
      return true;
    }
    return false;
  }),
  hideNav: function() {
    var curPath =this.get('currentPath');
    if(curPath == 'sign-up'){
      return true;
    } else {
     return false;
    }
  }.property('currentPath'),
  showSubNav: function(){
    var curPath =this.get('currentPath');
    if(curPath == 'account.details' || curPath == 'account.billing' || curPath == 'account.api'){
      return true;
    } else {
     return false;
    }
  }.property('currentPath')
});
