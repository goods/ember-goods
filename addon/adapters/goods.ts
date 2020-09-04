//@ts-ignore
import JSONAPIAdapter from "@ember-data/adapter/json-api";
//@ts-ignore
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
import { isNone } from "@ember/utils";
//@ts-ignore
import config from "ember-get-config";
import { computed, get } from "@ember/object";
import { inject } from "@ember/service";

export default class ApplicationAdapter extends JSONAPIAdapter.extend(
  DataAdapterMixin,
  {
    pathForType(type: any) {
      if (this.modelWhitelist.includes(type)) {
        return this._super(...arguments);
      }
      return "content/" + this._super(...arguments);
    },
  }
) {
  coalesceFindRequests = true;
  host = config.APP.goods.host;

  modelWhitelist = [
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
    "user",
  ];

  @inject session: any;

  @computed("session.data.authenticated.access_token")
  get headers() {
    //Support legacy access_token
    if (!isNone(config.APP.goods.access_token)) {
      return {
        Authorization: `Bearer ${config.APP.goods.access_token}`,
      };
    }

    //@ts-ignore
    let { access_token } = get(this, "session.data.authenticated");

    if (isNone(access_token)) {
      access_token = config.APP.goods.apiKey;
    }
    return {
      Authorization: `Bearer ${access_token}`,
      "Space-ID": config.APP.goods.spaceId,
    };
  }
}
