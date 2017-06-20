import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default Model.extend({
  basketItems: hasMany('basket-item'),
  total: attr('number'),
  quantity: attr('number')
});
