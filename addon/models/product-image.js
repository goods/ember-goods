import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  product: belongsTo('product'),
  filename: attr('string'),
  originalUrl: attr('string'),
  thumbUrl: attr('string'),
  thumbLargeUrl: attr('string'),
});
