import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default Model.extend({
  amount: attr("number"),
  order: belongsTo("order"),
  shopPaymentMethod: belongsTo("shop-payment-method"),
  token: attr("string"),
  capture: attr("boolean", { defaultValue: true }),
  cardNumber: attr("string"),
  cardholder: attr("string"),
  cardType: attr("string"),
  validFrom: attr("string"),
  expiryDate: attr("string"),
  issueNumber: attr("string"),
  cvv: attr("string")
});
