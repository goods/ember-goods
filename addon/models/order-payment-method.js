import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default Model.extend({
  maxPayableAmount: attr("number"),
  order: belongsTo("order"),
  shopPaymentMethod: belongsTo("shop-payment-method")
});
