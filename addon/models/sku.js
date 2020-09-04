import DS from "ember-data";
import attr from "ember-data/attr";
import { belongsTo, hasMany } from "ember-data/relationships";
import { computed, get } from "@ember/object";

export default DS.Model.extend({
  stockQuantity: attr("number"),
  price: belongsTo("price"),
  product: belongsTo("product"),
  bom: belongsTo("bom", { async: false }),
  skuImages: hasMany("sku-image"),
  skuFields: hasMany("sku-field"),

  attributes: computed("skuFields.[]", function () {
    return get(this, "skuFields").reduce((hash, attribute) => {
      hash[get(attribute, "slug")] = get(attribute, "values");
      return hash;
    }, {});
  }),
});
