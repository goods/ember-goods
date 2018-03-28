import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default Model.extend({
  quantity: attr("number"),
  price: attr("number"),
  isHidden: attr("boolean"),
  code: attr("string"),
  discount: attr("number"),
  metadata: attr(),
  basket: belongsTo("basket"),
  sku: belongsTo("sku"),
  promotion: belongsTo("promotion")
});
