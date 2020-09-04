import DS from "ember-data";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default DS.Model.extend({
  maxPayableAmount: attr("number"),
  order: belongsTo("order"),
  shopPaymentMethod: belongsTo("shop-payment-method"),
});
