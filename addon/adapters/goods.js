import JSONAPIAdapter from "ember-data/adapters/json-api";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
import { isNone } from "@ember/utils";
import config from "ember-get-config";
import { computed } from "@ember/object";

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  coalesceFindRequests: true,
  host: config.APP.goods.host,

  modelWhitelist: [
    "basket",
    "basket-item",
    "brand",
    "category",
    "country",
    "content-entry-operation",
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
    "shop-member",
    "shop-password-change",
    "shop-payment-method",
    "shop-reset-token",
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

  headers: computed("session.data.authenticated.access_token", function() {
    //Support legacy access_token
    if (!isNone(config.APP.goods.access_token)) {
      return {
        Authorization: `Bearer ${config.APP.goods.access_token}`
      };
    }

    let { access_token } = this.get("session.data.authenticated");

    if (isNone(access_token)) {
      access_token = config.APP.goods.apiKey;
    }
    return {
      Authorization: `Bearer ${access_token}`,
      "Space-ID": config.APP.goods.spaceId
    };
  })
});
