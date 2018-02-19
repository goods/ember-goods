import DS from "ember-data";
const { Model, attr, hasMany } = DS;

export default Model.extend({
  total: attr("number"),
  discount: attr("number"),
  balance: attr("number"),
  quantity: attr("number"),
  basketItems: hasMany("basket-item")
});
