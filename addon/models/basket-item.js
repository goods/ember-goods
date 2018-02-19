import DS from "ember-data";
const { Model, attr, belongsTo } = DS;

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
