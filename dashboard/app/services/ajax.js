import Ember from 'ember';
import ENV from "../config/environment";
import AjaxService from 'ember-ajax/services/ajax';

$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  }
});

export default AjaxService.extend({
  host: ENV.apiURL
});
