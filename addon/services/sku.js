import Ember from 'ember';
const { Service, get, isEmpty } = Ember;

export default Service.extend({

  fieldsToHash(fields) {
    return fields.reduce((fieldHash, field) => {
      fieldHash[get(field, 'slug')] = get(field, 'values');
      return fieldHash;
    }, []);
  },

  getSkuFieldValue(sku, fieldName) {
    let field = get(sku, 'skuFields').find(field => 
      get(field, 'name') === fieldName
    );
    if (isEmpty(field)) {
      throw new Error(`SKU field with the name ${fieldName} not found in SKU with ID ${sku.id}`);
    }
    return field.get('values.firstObject');
  }

});
