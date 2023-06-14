import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | goods/tickets/form/ticket-type',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`{{goods/tickets/form/ticket-type}}`);

      assert.equal(this.element.textContent.trim(), '');

      // Template block usage:
      await render(hbs`
      {{#goods/tickets/form/ticket-type}}
        template block text
      {{/goods/tickets/form/ticket-type}}
    `);

      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  }
);
