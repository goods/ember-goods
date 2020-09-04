import DS from "ember-data";
import attr from "ember-data/attr";

export default DS.Model.extend({
  name: attr("string"),
  alpha2: attr("string"),
  alpha3: attr("string"),
  continent: attr("string"),
  currencyCode: attr("string"),
});
