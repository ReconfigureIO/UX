import Ember from 'ember';
import ENV from "../config/environment";

export default Ember.Route.extend({
  actions: {
    login: function() {
      window.location.replace(ENV.apiURL+"/oauth/signin?redirect_url="+window.location+"dashboard");
    }
  }
});
