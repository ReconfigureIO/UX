import Ember from 'ember';

export default Ember.Controller.extend({
  isIndex: Ember.computed('currentRouteName',function(){
    if(this.get('currentRouteName') === 'index'){
      return true;
    }
    return false;
  }),
  //hideSideBar: Ember.computed('currentRouteName',function(){
  //  var curPath = this.get('currentRouteName');
  //  console.log(curPath);
  //  if(curPath === 'index' || curPath === 'sign-up.installation' || curPath === 'sign-up.auth' || curPath === 'sign-up.choose-plan' || curPath === 'sign-up.goal' || curPath === 'sign-up.getting-started'){
  //    return true;
  //  }
  //  return false;
  //}),
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
