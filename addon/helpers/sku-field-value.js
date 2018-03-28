import Helper from "@ember/component/helper";
import { get } from "@ember/object";
import { inject } from "@ember/service";

export default Helper.extend({
  skuService: inject("sku"),

  compute(params) {
    const sku = params[0];
    const fieldName = params[1];
    return get(this, "skuService").getSkuFieldValue(sku, fieldName);
  }
});
