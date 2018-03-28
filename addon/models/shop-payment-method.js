import Model from "ember-data/model";
import { belongsTo } from "ember-data/relationships";

export default Model.extend({
  paymentMethod: belongsTo("payment-method")
});
