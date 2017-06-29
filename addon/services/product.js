import Ember from 'ember';
const { Service, get, isEmpty } = Ember;

export default Service.extend({

  fieldsToHash(fields) {
    return fields.reduce((fieldHash, field) => {
      fieldHash[get(field, 'slug')] = get(field, 'values');
      return fieldHash;
    }, []);
  },

  getProductFieldValue(product, fieldName) {

    let field = get(product, 'productFields').find(field => 
      get(field, 'name') === fieldName
    );
    if (isEmpty(field)) {
      throw new Error(`Product field with the name ${fieldName} not found in Product with ID ${product.id}`);
    }
    return field.get('values.firstObject');
  }

});
