import Helper from "@ember/component/helper";
import { get } from "@ember/object";
import { inject } from "@ember/service";

export default Helper.extend({
  goods: inject("goods"),

  compute(params) {
    const sku = params[0];
    const fieldName = params[1];
    return get(this, "goods").getFieldValue(sku, fieldName);
  }
});
