import DS from 'ember-data';
const { Model, belongsTo, attr } = DS;

export default Model.extend({
  maxPayableAmount: attr('number'),
  order: belongsTo('order'),
  paymentMethod: belongsTo('payment-method'),
});
