import Model from "ember-data/model";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default Model.extend({
  skus: belongsTo("sku"),
  name: attr("string"),
  slug: attr("string"),
  values: attr()
});
