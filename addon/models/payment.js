import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  amount: attr('number'),
  order: belongsTo('order'),
  paymentMethod: belongsTo('payment-method'),
  token: attr('string'),
  cardNumber: attr('string'),
  cardholder: attr('string'),
  validFrom: attr('string'),
  expiryDate: attr('string'),
  issueNumber: attr('string'),
  cvv: attr('string')
});
