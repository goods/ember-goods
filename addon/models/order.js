import DS from "ember-data";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";

export default DS.Model.extend({
  total: attr("number", { defaultValue: 0 }),
  quantity: attr("number", { defaultValue: 0 }),
  amountPaid: attr("number", { defaultValue: 0 }),
  balance: attr("number", { defaultValue: 0 }),
  discount: attr("number", { defaultValue: 0 }),
  marketingOptIn: attr("boolean"),
  basket: belongsTo("basket"),
  name: attr("string"),
  emailAddress: attr("string"),
  phoneNumber: attr("string"),
  mobileNumber: attr("string"),
  metadata: attr(),
  billingAddress1: attr("string"),
  billingAddress2: attr("string"),
  billingCity: attr("string"),
  billingRegion: attr("string"),
  billingPostcode: attr("string"),
  billingCountry: attr("string"),
  shippingAddress1: attr("string"),
  shippingAddress2: attr("string"),
  shippingCity: attr("string"),
  shippingRegion: attr("string"),
  shippingPostcode: attr("string"),
  shippingCountry: attr("string"),
  orderPaymentMethods: hasMany("order-payment-method"),
  payments: hasMany("payment"),
  orderLines: hasMany("order-line"),
});
