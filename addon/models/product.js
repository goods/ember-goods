import DS from 'ember-data';
const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  name: attr('string'),
  summary: attr('string'),
  description: attr('string'),
  slug: attr('string'),
  skus: hasMany('sku'),
  brand: belongsTo('brand'),
  productFields: hasMany('product-field'),
  productImages: hasMany('product-image'),
  productCategories: hasMany('product-category')
});
