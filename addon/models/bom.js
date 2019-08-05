import Model from "ember-data/model";
import { belongsTo, hasMany } from "ember-data/relationships";

export default Model.extend({
  sku: belongsTo("sku", { async: false }),
  bomSkus: hasMany("bom-sku", { async: false })
});
