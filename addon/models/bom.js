import DS from "ember-data";
import { belongsTo, hasMany } from "ember-data/relationships";

export default DS.Model.extend({
  sku: belongsTo("sku", { async: false }),
  bomSkus: hasMany("bom-sku", { async: false }),
});
