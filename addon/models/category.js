import DS from "ember-data";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";

export default DS.Model.extend({
  name: attr("string"),
  isMaster: attr("boolean"),
  productCategories: hasMany("product-category"),
  subCategories: hasMany("category", { inverse: "parentCategory" }),
  parentCategory: belongsTo("category", { inverse: "subCategories" }),
});
