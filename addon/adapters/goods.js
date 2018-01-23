import Ember from "ember";
import JSONAPIAdapter from "ember-data/adapters/json-api";

export default JSONAPIAdapter.extend({
  coalesceFindRequests: true,

  host: "",
  modelWhitelist: [
    "basket",
    "basket-item",
    "category",
    "country",
    "order",
    "order-line",
    "order-payment-method",
    "payment",
    "payment-method",
    "price",
    "product-category",
    "product-image",
    "product",
    "shop-payment-method",
    "state",
    "sku-image",
    "sku"
  ],

  pathForType(type) {
    if (this.modelWhitelist.includes(type)) {
      return this._super(...arguments);
    }
    return "entries";
  },

  /**
   @override
   */
  findAll(store, type, sinceToken) {
    let modelName = type.modelName;

    if (this.modelWhitelist.includes(type.modelName)) {
      return this._super(...arguments);
    }

    let query = {
      content_group_api_identifier: Ember.String.camelize(modelName)
    };

    const url = this.buildURL(modelName, null, null, "findAll");

    if (sinceToken) {
      query.since = sinceToken;
    }

    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }
    return this.ajax(url, "GET", { data: { filter: query } });
  },

  // /**
  //  @override
  //  */
  query(store, type, query) {
    let modelName = type.modelName;

    if (this.modelWhitelist.includes(type.modelName)) {
      return this._super(...arguments);
    }

    query.filter = Ember.$.extend(query.filter, {
      content_group_api_identifier: Ember.String.camelize(modelName)
    });

    if (this.sortQueryParams) {
      query = this.sortQueryParams(query);
    }

    let url = this.buildURL(modelName, null, null, "query", query);

    return this.ajax(url, "GET", { data: query });
  },

  /**
   @override
   * */
  queryRecord() {
    throw new Ember.Error(
      "You may not call 'queryRecord' on a store. Use 'query'."
    );
  },
  /**
   @override
   */
  findMany(store, type) {
    if (this.modelWhitelist.includes(type.modelName)) {
      return this._super(...arguments);
    }
    return null;
  },

  /**
   @override
   */
  findHasMany(store, type) {
    if (this.modelWhitelist.includes(type.modelName)) {
      return this._super(...arguments);
    }
    return null;
  },

  /**
   @override
   */
  findBelongsTo(store, type) {
    if (this.modelWhitelist.includes(type.modelName)) {
      return this._super(...arguments);
    }
    return null;
  },

  /**
   @override
   */
  updateRecord(store, type) {
    if (this.modelWhitelist.includes(type.modelName)) {
      return this._super(...arguments);
    }
    throw new Ember.Error(
      "You may not call 'updateRecord' on a content entry."
    );
  },

  /**
   @override
   * */
  deleteRecord(store, type) {
    if (this.modelWhitelist.includes(type.modelName)) {
      return this._super(...arguments);
    }
    throw new Ember.Error(
      "You may not call 'deleteRecord' on a content entry."
    );
  }
});
