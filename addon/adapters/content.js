import JSONAPIAdapter from "ember-data/adapters/json-api";

export default JSONAPIAdapter.extend({
  coalesceFindRequests: true,

  modelWhitelist: [
    "basket",
    "basket-item",
    "category",
    "country",
    "field-schema",
    "order",
    "order-line",
    "order-payment-method",
    "payment",
    "payment-method",
    "price",
    "product-category",
    "product-image",
    "product",
    "promotion",
    "shop-payment-method",
    "state",
    "sku-image",
    "sku"
  ],

  pathForType(type) {
    if (this.modelWhitelist.includes(type)) {
      return this._super(...arguments);
    }

    return "content/" + this._super(...arguments);
  }
});
