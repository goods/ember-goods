import DS from "ember-data";
const { Model, attr } = DS;

export default Model.extend({
  name: attr("string"),
  description: attr("string"),
  code: attr("string"),
  startTime: attr("string"),
  finishTime: attr("string")
});
