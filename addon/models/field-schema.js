import DS from "ember-data";
import attr from "ember-data/attr";

export default DS.Model.extend({
  name: attr("string"),
  slug: attr("string"),
  order: attr("string"),
  description: attr("string"),
  data_type: attr("string"),
  field_type: attr("string"),
});
