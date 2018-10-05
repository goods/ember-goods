import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";
import { computed, get } from "@ember/object";

export default Model.extend({
  stockQuantity: attr("number"),
  price: attr("number"),
  product: belongsTo("product"),
  skuImages: hasMany("sku-image"),
  skuFields: hasMany("sku-field"),

  attributes: computed("skuFields.[]", function() {
    return get(this, "skuFields").reduce((hash, attribute) => {
      hash[get(attribute, "slug")] = get(attribute, "values");
      return hash;
    }, {});
  })
});
