import DS from 'ember-data';
const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
  name: attr('string'),
  isMaster: attr('boolean'),
  productCategories: hasMany('product-category'),
  subCategories: hasMany('category', {inverse: 'parentCategory'}),
  parentCategory: belongsTo('category', {inverse: 'subCategories'})
});
