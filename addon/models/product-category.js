import DS from 'ember-data';
const { Model, belongsTo } = DS;

export default Model.extend({
  product: belongsTo('product'),
  category: belongsTo('category'),
});
