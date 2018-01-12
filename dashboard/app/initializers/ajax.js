export function initialize(application) {
  application.inject('route', 'ajax', 'service:ajax');
}

export default {
  name: 'ajax',
  initialize
};
