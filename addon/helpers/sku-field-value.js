import Ember from 'ember';
const { Helper, get, inject } = Ember;
const { service } = inject;

export default Helper.extend({

  skuService: service('sku'),

  compute(params) {
    const sku = params[0];
    const fieldName = params[1];
    return get(this, 'skuService').getSkuFieldValue(sku, fieldName);
  }
});

