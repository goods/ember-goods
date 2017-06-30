import Ember from 'ember';
const { Service, get, isEmpty } = Ember;

export default Service.extend({

  fieldsToHash(fields) {
    return fields.reduce((fieldHash, field) => {
      fieldHash[get(field, 'slug')] = get(field, 'values');
      return fieldHash;
    }, []);
  },

  getProductFieldValue(product, slug) {

    let field = get(product, 'productFields').find(field => 
      get(field, 'slug') === slug
    );
    if (isEmpty(field)) {
      throw new Error(`Product field with the reference  ${slug} not found in product with ID ${product.id}`);
    }
    return field.get('values');
  }

});
