import DS from 'ember-data';
const { Model, belongsTo, attr, hasMany } = DS;

export default Model.extend({
  basket: belongsTo('basket'),
  name: attr('string'),
  emailAddress: attr('string'),
  phoneNumber: attr('string'),
  mobileNumber: attr('string'),
  billingAddress1: attr('string'),
  billingAddress2: attr('string'),
  billingCity: attr('string'),
  billingRegion: attr('string'),
  billingPostcode: attr('string'),
  billingCountry: attr('string'),
  shippingAddress1: attr('string'),
  shippingAddress2: attr('string'),
  shippingCity: attr('string'),
  shippingRegion: attr('string'),
  shippingPostcode: attr('string'),
  shippingCountry: attr('string'),
  total: attr('number', {defaultValue: 0}),
  quantity: attr('number', {defaultValue: 0}),
  orderPaymentMethods: hasMany('order-payment-method')

});
