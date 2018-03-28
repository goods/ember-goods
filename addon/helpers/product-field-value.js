import Helper from "@ember/component/helper";
import { get } from "@ember/object";
import { inject } from "@ember/service";

export default Helper.extend({
  productService: inject("product"),

  compute(params) {
    const product = params[0];
    const fieldName = params[1];
    return get(this, "productService").getProductFieldValue(product, fieldName);
  }
});
