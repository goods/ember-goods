import Ember from 'ember';
const { get, inject } = Ember;
const { service } = inject;

export default Ember.Helper.extend({

  productService: service('product'),

  compute(params) {
    const product = params[0];
    const fieldName = params[1];
    return get(this, 'productService').getProductFieldValue(product, fieldName);
  }
});