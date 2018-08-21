import Service from "@ember/service";
import { get } from "@ember/object";
import { inject } from "@ember/service";
import { alias } from "@ember/object/computed";
import { isEmpty } from "@ember/utils";

export default Service.extend({
  store: inject("store"),
  basket: inject("basket"),
  product: inject("product"),
  sku: inject("sku"),

  basketItems: alias("basket.basketItems"),

  createBasket() {
    return get(this, "basket").createBasket();
  },

  getBasket(basketId) {
    return get(this, "basket").getBasket(basketId);
  },

  createBasketItem(
    basketItems,
    sku,
    quantity,
    metadata = null,
    isHidden = false
  ) {
    return get(this, "basket").createBasketItem(
      basketItems,
      sku,
      quantity,
      metadata,
      isHidden
    );
  },

  destroyBasketItems(basketItems, targetBasketItems) {
    return get(this, "basket").destroyBasketItems(
      basketItems,
      targetBasketItems
    );
  },

  destroyBasketItem(basketItems, basketItem) {
    return get(this, "basket").destroyBasketItem(basketItems, basketItem);
  },

  saveBasketItem(basketItem) {
    return get(this, "basket").saveBasketItem(basketItem);
  },

  setBasketItemQuantity(basketItem, quantity) {
    return get(this, "basket").setBasketItemQuantity(basketItem, quantity);
  },

  addToBasket(basketItems, basket) {
    return get(this, "basket").addToBasket(basketItems, basket);
  },

  createOrder(order) {
    return get(this, "basket").createOrder(order);
  },

  createPayment(order) {
    const store = get(this, "store");
    const orderPaymentMethod = get(order, "orderPaymentMethods.firstObject");
    return store.createRecord("payment", {
      amount: get(orderPaymentMethod, "maxPayableAmount"),
      order: order,
      shopPaymentMethod: get(orderPaymentMethod, "shopPaymentMethod"),
      token: ""
    });
  },

  fieldsToHash(fields) {
    return fields.reduce((fieldHash, field) => {
      fieldHash[get(field, "slug")] = get(field, "values");
      return fieldHash;
    }, []);
  },

  getSkuFieldValue(sku, slug) {
    return get(this, "sku").getSkuFieldValue(sku, slug);
  },

  getProductFieldValue(product, slug) {
    return get(this, "product").getProductFieldValue(product, slug);
  },

  getFieldValue(record, reference) {
    let field = get(record, "skuFields").find(
      field => get(field, "slug") === reference
    );
    if (isEmpty(field)) {
      throw new Error(
        `SKU field with the reference ${reference} not found in record with ID ${
          record.id
        }`
      );
    }
    return field.get("values.firstObject");
  },

  attributesToHash(attributes) {
    return attributes.reduce((attributeHash, attribute) => {
      //@ts-ignore
      attributeHash[get(attribute, "slug")] = get(attribute, "values");
      return attributeHash;
    }, []);
  },

  getAttributeValue(attributes, identifier) {
    let attribute = attributes.find(
      attribute => get(attribute, "slug") === identifier
    );

    if (isEmpty(attribute)) {
      throw new Error(
        `Attribute with the reference ${identifier} not found in attribute list`
      );
    }

    return get(attribute, "values");
  }
});
