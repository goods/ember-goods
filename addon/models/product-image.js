import DS from "ember-data";
import attr from "ember-data/attr";
import { belongsTo } from "ember-data/relationships";

export default DS.Model.extend({
  product: belongsTo("product"),
  filename: attr("string"),
  originalUrl: attr("string"),
  thumbUrl: attr("string"),
  thumbLargeUrl: attr("string"),
});
