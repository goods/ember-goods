import Service from "@ember/service";
import { get } from "@ember/object";
import { isEmpty } from "@ember/utils";

export default Service.extend({
  fieldsToHash(fields) {
    return fields.reduce((fieldHash, field) => {
      fieldHash[get(field, "slug")] = get(field, "values");
      return fieldHash;
    }, []);
  },

  getSkuFieldValue(sku, slug) {
    let field = get(sku, "skuFields").find(
      field => get(field, "slug") === slug
    );
    if (isEmpty(field)) {
      throw new Error(
        `SKU field with the reference ${slug} not found in SKU with ID ${
          sku.id
        }`
      );
    }
    return field.get("values.firstObject");
  }
});
