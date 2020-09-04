import DS from "ember-data";
import { belongsTo } from "ember-data/relationships";

export default DS.Model.extend({
  product: belongsTo("product"),
  category: belongsTo("category"),
});
