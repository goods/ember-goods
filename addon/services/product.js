import Ember from 'ember';
const { Service, get } = Ember;

export default Service.extend({

  fieldsToHash(fields) {
    return fields.reduce((fieldHash, field) => {
      fieldHash[get(field, 'slug')] = get(field, 'values');
      return fieldHash;
    }, []);
  },

});
