import Model from "ember-data/model";
import attr from "ember-data/attr";
import { hasMany } from "ember-data/relationships";

export default Model.extend({
  total: attr("number"),
  discount: attr("number"),
  balance: attr("number"),
  quantity: attr("number"),
  basketItems: hasMany("basket-item")
});
