import { test } from 'qunit';
import moduleForAcceptance from 'reconfigure/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | check token');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});
