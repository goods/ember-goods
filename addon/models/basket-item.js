import DS from "ember-data";
const { Model, attr, belongsTo } = DS;

export default Model.extend({
  basket: belongsTo("basket"),
  sku: belongsTo("sku"),
  quantity: attr("number"),
  price: attr("number"),
  metadata: attr()
});
