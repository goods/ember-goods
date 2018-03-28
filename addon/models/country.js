import Model from "ember-data/model";
import attr from "ember-data/attr";

export default Model.extend({
  name: attr("string"),
  alpha2: attr("string"),
  alpha3: attr("string"),
  continent: attr("string"),
  currencyCode: attr("string")
});
