import JSONAPIAdapter from "ember-data/adapters/json-api";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
import { isNone } from "@ember/utils";
import config from "ember-get-config";

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  coalesceFindRequests: true,
  host: config.APP.goods.host,

  modelWhitelist: [
    "basket",
    "basket-item",
    "brand",
    "category",
    "country",
    "order",
    "order-line",
    "order-payment-method",
    "payment",
    "payment-method",
    "price",
    "product-category",
    "product-field",
    "product-image",
    "product",
    "promotion",
    "shop-payment-method",
    "shop-role",
    "state",
    "sku-field",
    "sku-image",
    "sku",
    "user"
  ],

  pathForType(type) {
    if (this.modelWhitelist.includes(type)) {
      return this._super(...arguments);
    }
    return "content/" + this._super(...arguments);
  },

  authorize(xhr) {
    let { access_token } = this.get("session.data.authenticated");
    if (isNone(access_token)) {
      access_token = config.APP.goods.apiKey;
    }
    xhr.setRequestHeader("Authorization", `Bearer ${access_token}`);
    xhr.setRequestHeader("Space-ID", config.APP.goods.spaceId);
  }
});
