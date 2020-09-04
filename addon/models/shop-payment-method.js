import DS from "ember-data";
import { belongsTo } from "ember-data/relationships";

export default DS.Model.extend({
  paymentMethod: belongsTo("payment-method"),
});
