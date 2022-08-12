import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | content entry operation', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store: any = this.owner.lookup('service:store');
    let model = run(() => store.createRecord('content-entry-operation', {}));
    assert.ok(model);
  });
});
