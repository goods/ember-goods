import DS from "ember-data";
import attr from "ember-data/attr";
import { hasMany } from "ember-data/relationships";

export default DS.Model.extend({
  total: attr("number"),
  discount: attr("number"),
  balance: attr("number"),
  quantity: attr("number"),
  basketItems: hasMany("basket-item"),
});
