import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";

export default Model.extend({
  name: attr("string"),
  summary: attr("string"),
  description: attr("string"),
  slug: attr("string"),
  skus: hasMany("sku"),
  brand: belongsTo("brand"),
  productFields: hasMany("product-field"),
  productImages: hasMany("product-image"),
  productCategories: hasMany("product-category")
});
