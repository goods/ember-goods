import DS from 'ember-data';
const { Model, attr } = DS;

export default Model.extend({
  name: attr('string'),
  alpha2: attr('string'),
  alpha3: attr('string'),
  continent: attr('string'),
  currencyCode: attr('string')
});
