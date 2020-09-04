import DS from "ember-data";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default DS.Model.extend({
  quantity: attr("number"),
  price: attr("number"),
  isHidden: attr("boolean"),
  metadata: attr(),
  order: belongsTo("order"),
  sku: belongsTo("sku"),
  promotion: belongsTo("promotion"),
});
