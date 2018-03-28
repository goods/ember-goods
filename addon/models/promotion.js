import Model from "ember-data/model";
import attr from "ember-data/attr";

export default Model.extend({
  name: attr("string"),
  description: attr("string"),
  code: attr("string"),
  startTime: attr("string"),
  finishTime: attr("string")
});
