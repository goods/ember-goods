import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | user', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store: any = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('user', {}));
    assert.ok(model);
  });
});
