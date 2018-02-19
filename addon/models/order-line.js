import DS from "ember-data";
const { Model, belongsTo, attr } = DS;

export default Model.extend({
  quantity: attr("number"),
  price: attr("number"),
  isHidden: attr("boolean"),
  metadata: attr(),
  order: belongsTo("order"),
  sku: belongsTo("sku"),
  promotion: belongsTo("promotion")
});
