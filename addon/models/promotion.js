import DS from "ember-data";
import attr from "ember-data/attr";

export default DS.Model.extend({
  name: attr("string"),
  description: attr("string"),
  code: attr("string"),
  startTime: attr("string"),
  finishTime: attr("string"),
});
