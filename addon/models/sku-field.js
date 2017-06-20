import DS from 'ember-data';
const { attr, belongsTo, Model } = DS;

export default Model.extend({
  skus: belongsTo('sku'),
  name: attr('string'),
  slug: attr('string'),
  values: attr(),
});
