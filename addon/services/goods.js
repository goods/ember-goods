import Service from "@ember/service";
import { get, set } from "@ember/object";
import { inject } from "@ember/service";
import { alias } from "@ember/object/computed";
import { isEmpty } from "@ember/utils";
import { isNone } from "@ember/utils";
import RSVP from "rsvp";

export default Service.extend({
  store: inject("store"),

  basketItems: alias("basket.basketItems"),

  createBasket() {
    return get(this, "store").createRecord("basket").save();
  },

  async getBasket(basketId) {
    return await get(this, "store").find("basket", basketId);
  },

  createBasketItem(
    basketItems,
    sku,
    quantity,
    metadata = null,
    isHidden = false
  ) {
    const store = get(this, "store");
    let basketItem = store.createRecord("basketItem", {
      basket: null,
      quantity: quantity,
      sku: sku,
      price: get(sku, "price"),
      metadata: metadata,
      isHidden: isHidden,
    });
    if (isNone(basketItems) === false) {
      basketItems.pushObject(basketItem);
    }
    return basketItem;
  },

  async destroyBasketItems(basketItems, targetBasketItems) {
    if (isNone(basketItems) === false) {
      basketItems.removeObjects(targetBasketItems);
    }

    let baskets = basketItems.mapBy("basket.content").uniq();

    await RSVP.all(targetBasketItems.invoke("destroyRecord"));
    await RSVP.all(baskets.invoke("reload"));
  },

  destroyBasketItem(basketItems, basketItem) {
    return this.destroyBasketItem(basketItems, basketItem);
  },

  saveBasketItem(basketItem) {
    return basketItem.save();
  },

  setBasketItemQuantity(basketItem, quantity) {
    set(basketItem, "quantity", quantity);
  },

  async addToBasket(basketItems, basket) {
    let unsavedBasketItems = basketItems
      .filterBy("isNew")
      .filterBy("isSaving", false);
    unsavedBasketItems.setEach("basket", basket);

    await unsavedBasketItems.reduce(function (previous, basketItem) {
      return previous.then(basketItem.save.bind(basketItem));
    }, RSVP.resolve());

    await basket.reload();
  },

  createOrder(order) {
    return order.save();
  },

  createPayment(order) {
    const store = get(this, "store");
    const orderPaymentMethod = get(order, "orderPaymentMethods.firstObject");
    return store.createRecord("payment", {
      amount: get(orderPaymentMethod, "maxPayableAmount"),
      order: order,
      shopPaymentMethod: get(orderPaymentMethod, "shopPaymentMethod"),
      token: "",
    });
  },

  fieldsToHash(fields) {
    return fields.reduce((fieldHash, field) => {
      fieldHash[get(field, "slug")] = get(field, "values");
      return fieldHash;
    }, []);
  },

  getFieldValue(record, reference) {
    let field = get(record, "skuFields").find(
      (field) => get(field, "slug") === reference
    );
    if (isEmpty(field)) {
      throw new Error(
        `SKU field with the reference ${reference} not found in record with ID ${record.id}`
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
      (attribute) => get(attribute, "slug") === identifier
    );

    if (isEmpty(attribute)) {
      throw new Error(
        `Attribute with the reference ${identifier} not found in attribute list`
      );
    }

    return get(attribute, "values");
  },
});
